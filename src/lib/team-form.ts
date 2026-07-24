import { getTeamRecentResults, type SportEvent } from "./sportsdb";
import type { SportKey } from "./leagues";

export type TeamForm = {
  sequence: string; // e.g. "G-G-E-P-G", most recent first
  points: number;
  played: number;
};

function resultLetter(event: SportEvent, teamName: string): "G" | "E" | "P" {
  const isHome = event.strHomeTeam === teamName;
  const own = Number(isHome ? event.intHomeScore : event.intAwayScore);
  const opp = Number(isHome ? event.intAwayScore : event.intHomeScore);
  if (own > opp) return "G";
  if (own < opp) return "P";
  return "E";
}

/** Real last-5 form for a team, computed from finished matches (no fabricated data). */
export async function getTeamForm(teamId: string, teamName: string): Promise<TeamForm> {
  const results = (await getTeamRecentResults(teamId)).slice(0, 5);
  const letters = results.map((e) => resultLetter(e, teamName));
  const points = letters.reduce((sum, l) => sum + (l === "G" ? 3 : l === "E" ? 1 : 0), 0);

  return {
    sequence: letters.length > 0 ? letters.join("-") : "Sin datos recientes",
    points,
    played: letters.length,
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
