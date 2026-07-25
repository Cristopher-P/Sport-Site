import { z } from "zod";
import { League, LEAGUES } from "./leagues";
import { matchSlug } from "./slug";
import { dateInSiteTimeZone, fixtureUtcDate, todayInSiteTimeZone } from "./timezone";

const API_KEY = process.env.THESPORTSDB_API_KEY || "123";
const BASE_URL = `https://www.thesportsdb.com/api/v1/json/${API_KEY}`;

// Revalidate cadence: fixtures don't change minute to minute, a daily refresh
// is enough and keeps us well under the free-tier rate limits.
const REVALIDATE_SECONDS = 60 * 60 * 12;

const EventSchema = z.object({
  idEvent: z.string(),
  strEvent: z.string(),
  strHomeTeam: z.string(),
  strAwayTeam: z.string(),
  idHomeTeam: z.string().nullable().optional(),
  idAwayTeam: z.string().nullable().optional(),
  strHomeTeamBadge: z.string().nullable().optional(),
  strAwayTeamBadge: z.string().nullable().optional(),
  dateEvent: z.string(),
  strTime: z.string().nullable().optional(),
  strTimestamp: z.string().nullable().optional(),
  strVenue: z.string().nullable().optional(),
  strCountry: z.string().nullable().optional(),
  strLeague: z.string(),
  strLeagueBadge: z.string().nullable().optional(),
  intRound: z.string().nullable().optional(),
  strSeason: z.string().nullable().optional(),
  strStatus: z.string().nullable().optional(),
  intHomeScore: z.string().nullable().optional(),
  intAwayScore: z.string().nullable().optional(),
});

export type SportEvent = z.infer<typeof EventSchema>;

export type Fixture = SportEvent & {
  slug: string;
  league: League;
};

const EventsResponseSchema = z.object({
  events: z.array(EventSchema).nullable(),
});

// eventslast.php uses a different envelope key ("results") than every other
// endpoint here ("events") — TheSportsDB is inconsistent about this.
const ResultsResponseSchema = z.object({
  results: z.array(EventSchema).nullable(),
});

async function fetchJson(path: string): Promise<unknown> {
  const res = await fetch(`${BASE_URL}/${path}`, {
    next: { revalidate: REVALIDATE_SECONDS, tags: ["fixtures"] },
  });
  if (!res.ok) return null;
  return res.json();
}

async function fetchEvents(path: string): Promise<SportEvent[]> {
  const json = await fetchJson(path);
  const parsed = EventsResponseSchema.safeParse(json);
  if (!parsed.success || !parsed.data.events) return [];
  return parsed.data.events;
}

async function fetchResults(path: string): Promise<SportEvent[]> {
  const json = await fetchJson(path);
  const parsed = ResultsResponseSchema.safeParse(json);
  if (!parsed.success || !parsed.data.results) return [];
  return parsed.data.results;
}

async function getNextEvent(leagueId: string): Promise<SportEvent | null> {
  const events = await fetchEvents(`eventsnextleague.php?id=${leagueId}`);
  return events[0] ?? null;
}

async function getPastEvent(leagueId: string): Promise<SportEvent | null> {
  const events = await fetchEvents(`eventspastleague.php?id=${leagueId}`);
  return events[0] ?? null;
}

const LineupPlayerSchema = z.object({
  idPlayer: z.string(),
  strPlayer: z.string(),
  strPosition: z.string().nullable().optional(),
  strHome: z.string().nullable().optional(), // "Yes" | "No"
  strSubstitute: z.string().nullable().optional(), // "Yes" | "No"
  strTeam: z.string(),
  strCutout: z.string().nullable().optional(),
  intSquadNumber: z.string().nullable().optional(),
});

const LineupResponseSchema = z.object({
  lineup: z.array(LineupPlayerSchema).nullable(),
});

export type LineupPlayer = z.infer<typeof LineupPlayerSchema>;

export type MatchLineup = {
  home: { starters: LineupPlayer[]; substitutes: LineupPlayer[] };
  away: { starters: LineupPlayer[]; substitutes: LineupPlayer[] };
};

/**
 * Lineups are usually only populated close to kickoff or after the match —
 * for fixtures weeks out this will normally be null, which is expected, not
 * a bug.
 */
export async function getLineup(eventId: string): Promise<MatchLineup | null> {
  const json = await fetchJson(`lookuplineup.php?id=${eventId}`);
  const parsed = LineupResponseSchema.safeParse(json);
  if (!parsed.success || !parsed.data.lineup || parsed.data.lineup.length === 0) return null;

  const home: MatchLineup["home"] = { starters: [], substitutes: [] };
  const away: MatchLineup["away"] = { starters: [], substitutes: [] };

  for (const player of parsed.data.lineup) {
    const side = player.strHome === "Yes" ? home : away;
    const bucket = player.strSubstitute === "Yes" ? side.substitutes : side.starters;
    bucket.push(player);
  }

  return { home, away };
}

/** Last (up to) 5 finished matches for one team, most recent first. */
export async function getTeamRecentResults(teamId: string): Promise<SportEvent[]> {
  const events = await fetchResults(`eventslast.php?id=${teamId}`);
  return events
    .filter((e) => e.intHomeScore != null && e.intAwayScore != null)
    .sort((a, b) => b.dateEvent.localeCompare(a.dateEvent));
}

async function getRoundEvents(
  leagueId: string,
  round: string,
  season: string
): Promise<SportEvent[]> {
  return fetchEvents(
    `eventsround.php?id=${leagueId}&r=${encodeURIComponent(round)}&s=${encodeURIComponent(season)}`
  );
}

function toFixture(event: SportEvent, league: League): Fixture {
  return {
    ...event,
    league,
    slug: matchSlug(event.strHomeTeam, event.strAwayTeam, event.dateEvent),
  };
}

/**
 * Fixtures for one league: pulls the next scheduled match to discover the
 * current round/season, then fetches that whole round so we get more than
 * a single game out of the free API tier.
 */
export async function getLeagueFixtures(league: League): Promise<Fixture[]> {
  const next = await getNextEvent(league.id);
  if (!next || !next.intRound || !next.strSeason) {
    return next ? [toFixture(next, league)] : [];
  }

  const round = await getRoundEvents(league.id, next.intRound, next.strSeason);
  const todayLocal = todayInSiteTimeZone();

  const upcoming = round.filter(
    (e) => dateInSiteTimeZone(fixtureUtcDate(e.dateEvent, e.strTime)) >= todayLocal
  );
  const source = upcoming.length > 0 ? upcoming : [next];

  return source
    .map((e) => toFixture(e, league))
    .sort((a, b) => a.dateEvent.localeCompare(b.dateEvent));
}

export async function getAllUpcomingFixtures(): Promise<Fixture[]> {
  const results = await Promise.all(LEAGUES.map((league) => getLeagueFixtures(league)));
  return results.flat().sort((a, b) => a.dateEvent.localeCompare(b.dateEvent));
}

/**
 * Recent final scores for one league: same trick as getLeagueFixtures but
 * starting from the last played match to discover its round, so we get a
 * handful of real results instead of just one.
 */
export async function getLeagueRecentResults(league: League): Promise<Fixture[]> {
  const past = await getPastEvent(league.id);
  if (!past || !past.intRound || !past.strSeason) {
    return past ? [toFixture(past, league)] : [];
  }

  const round = await getRoundEvents(league.id, past.intRound, past.strSeason);
  const todayLocal = todayInSiteTimeZone();

  const played = round.filter(
    (e) =>
      e.intHomeScore != null &&
      e.intAwayScore != null &&
      dateInSiteTimeZone(fixtureUtcDate(e.dateEvent, e.strTime)) <= todayLocal
  );
  const source = played.length > 0 ? played : [past];

  return source
    .map((e) => toFixture(e, league))
    .sort((a, b) => b.dateEvent.localeCompare(a.dateEvent))
    .slice(0, 6);
}

export async function getAllRecentResults(): Promise<Fixture[]> {
  const results = await Promise.all(LEAGUES.map((league) => getLeagueRecentResults(league)));
  return results.flat().sort((a, b) => b.dateEvent.localeCompare(a.dateEvent));
}

export async function getFixtureBySlug(
  league: League,
  slug: string
): Promise<Fixture | null> {
  const fixtures = await getLeagueFixtures(league);
  const upcoming = fixtures.find((f) => f.slug === slug);
  if (upcoming) return upcoming;

  // Not in the upcoming round — it may already have been played.
  const results = await getLeagueRecentResults(league);
  return results.find((f) => f.slug === slug) ?? null;
}
