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
  strHomeTeamBadge: z.string().nullable().optional(),
  strAwayTeamBadge: z.string().nullable().optional(),
  dateEvent: z.string(),
  strTime: z.string().nullable().optional(),
  strTimestamp: z.string().nullable().optional(),
  strVenue: z.string().nullable().optional(),
  strCountry: z.string().nullable().optional(),
  strLeague: z.string(),
  intRound: z.string().nullable().optional(),
  strSeason: z.string().nullable().optional(),
  strStatus: z.string().nullable().optional(),
});

export type SportEvent = z.infer<typeof EventSchema>;

export type Fixture = SportEvent & {
  slug: string;
  league: League;
};

const EventsResponseSchema = z.object({
  events: z.array(EventSchema).nullable(),
});

async function fetchEvents(path: string): Promise<SportEvent[]> {
  const res = await fetch(`${BASE_URL}/${path}`, {
    next: { revalidate: REVALIDATE_SECONDS, tags: ["fixtures"] },
  });

  if (!res.ok) return [];

  const json = await res.json();
  const parsed = EventsResponseSchema.safeParse(json);
  if (!parsed.success || !parsed.data.events) return [];

  return parsed.data.events;
}

async function getNextEvent(leagueId: string): Promise<SportEvent | null> {
  const events = await fetchEvents(`eventsnextleague.php?id=${leagueId}`);
  return events[0] ?? null;
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

export async function getFixtureBySlug(
  league: League,
  slug: string
): Promise<Fixture | null> {
  const fixtures = await getLeagueFixtures(league);
  return fixtures.find((f) => f.slug === slug) ?? null;
}
