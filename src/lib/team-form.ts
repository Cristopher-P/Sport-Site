import type { SportEvent } from "./sportsdb";
import type { SportKey } from "./leagues";

export type TeamForm = {
  sequence: string; // e.g. "G-G-E-P-G", most recent first
  points: number;
  played: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
};

function resultLetter(event: SportEvent, teamName: string): "G" | "E" | "P" {
  const isHome = event.strHomeTeam === teamName;
  const own = Number(isHome ? event.intHomeScore : event.intAwayScore);
  const opp = Number(isHome ? event.intAwayScore : event.intHomeScore);
  if (own > opp) return "G";
  if (own < opp) return "P";
  return "E";
}

const EMPTY_FORM: TeamForm = {
  sequence: "Sin datos recientes",
  points: 0,
  played: 0,
  wins: 0,
  draws: 0,
  losses: 0,
  goalsFor: 0,
  goalsAgainst: 0,
};

/**
 * Real recent form for a team, computed from a pool of finished matches
 * (see sportsdb.ts getRecentLeagueRounds) — no fabricated data. Pass a pool
 * that spans several rounds so this isn't based on a single match.
 */
export function getTeamFormFromPool(pool: SportEvent[], teamName: string): TeamForm {
  const teamEvents = pool
    .filter((e) => e.strHomeTeam === teamName || e.strAwayTeam === teamName)
    .sort((a, b) => b.dateEvent.localeCompare(a.dateEvent))
    .slice(0, 5);

  if (teamEvents.length === 0) return EMPTY_FORM;

  let wins = 0;
  let draws = 0;
  let losses = 0;
  let goalsFor = 0;
  let goalsAgainst = 0;
  const letters: string[] = [];

  for (const event of teamEvents) {
    const isHome = event.strHomeTeam === teamName;
    const own = Number(isHome ? event.intHomeScore : event.intAwayScore);
    const opp = Number(isHome ? event.intAwayScore : event.intHomeScore);
    goalsFor += own;
    goalsAgainst += opp;

    const letter = resultLetter(event, teamName);
    letters.push(letter);
    if (letter === "G") wins++;
    else if (letter === "E") draws++;
    else losses++;
  }

  return {
    sequence: letters.join("-"),
    points: wins * 3 + draws,
    played: teamEvents.length,
    wins,
    draws,
    losses,
    goalsFor,
    goalsAgainst,
  };
}

export type SimpleProbability = {
  home: number;
  draw: number;
  away: number;
};

/**
 * Deliberately simple, transparent heuristic: each team's points-per-game
 * rate from real recent results, normalized into a percentage split. This
 * is NOT a professional prediction model — it's labeled as such wherever
 * it's shown. Soccer gets a fixed draw allowance; other sports don't.
 */
export function estimateProbability(
  home: TeamForm,
  away: TeamForm,
  sport: SportKey
): SimpleProbability {
  const homeRate = home.played > 0 ? home.points / (home.played * 3) : 0.5;
  const awayRate = away.played > 0 ? away.points / (away.played * 3) : 0.5;
  const total = homeRate + awayRate || 1;

  if (sport === "soccer") {
    const drawPct = 26;
    const remaining = 100 - drawPct;
    const homePct = Math.round(remaining * (homeRate / total));
    return { home: homePct, draw: drawPct, away: remaining - homePct };
  }

  const homePct = Math.round(100 * (homeRate / total));
  return { home: homePct, draw: 0, away: 100 - homePct };
}
