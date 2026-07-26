import { getLeagueBySlug, type League } from "./leagues";
import { getFixtureBySlug, getRecentLeagueRounds, type Fixture, type SportEvent } from "./sportsdb";
import { getTeamFormFromPool, estimateProbability, type TeamForm, type SimpleProbability } from "./team-form";
import type { ReportMatchRef } from "@/content/reports";

export type MatchAnalysis = {
  fixture: Fixture;
  home: TeamForm;
  away: TeamForm;
  probability: SimpleProbability;
  nota?: string;
};

function poolCache() {
  const pools = new Map<string, Promise<SportEvent[]>>();
  return (league: League) => {
    if (!pools.has(league.slug)) {
      pools.set(league.slug, getRecentLeagueRounds(league));
    }
    return pools.get(league.slug)!;
  };
}

function analyze(fixture: Fixture, pool: SportEvent[], nota?: string): MatchAnalysis {
  const relevantPool = pool.filter((e) => e.idEvent !== fixture.idEvent);
  const home = getTeamFormFromPool(relevantPool, fixture.strHomeTeam);
  const away = getTeamFormFromPool(relevantPool, fixture.strAwayTeam);
  const probability = estimateProbability(home, away, fixture.league.sport);
  return { fixture, home, away, probability, nota };
}

/** Resolves editorial match references (from src/content/reports.ts) into full analysis. */
export async function resolveReportMatches(refs: ReportMatchRef[]): Promise<MatchAnalysis[]> {
  const poolFor = poolCache();

  const results = await Promise.all(
    refs.map(async (ref) => {
      const league = getLeagueBySlug(ref.liga);
      if (!league) return null;
      const fixture = await getFixtureBySlug(league, ref.partido);
      if (!fixture) return null;
      const pool = await poolFor(league);
      return analyze(fixture, pool, ref.nota);
    })
  );

  return results.filter((r): r is MatchAnalysis => r !== null);
}

/** Same analysis, for an already-resolved list of fixtures (used by the demo report). */
export async function analyzeFixtures(fixtures: Fixture[]): Promise<MatchAnalysis[]> {
  const poolFor = poolCache();
  return Promise.all(
    fixtures.map(async (fixture) => {
      const pool = await poolFor(fixture.league);
      return analyze(fixture, pool);
    })
  );
}
