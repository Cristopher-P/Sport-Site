import type { Fixture } from "./sportsdb";
import { isFeaturedTeam } from "./featured";

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

function inNextDays(dateEvent: string, days: number): boolean {
  const today = new Date(`${todayIso()}T00:00:00Z`);
  const limit = new Date(today);
  limit.setUTCDate(limit.getUTCDate() + days);
  const date = new Date(`${dateEvent}T00:00:00Z`);
  return date >= today && date <= limit;
}

export type Homepage = {
  today: Fixture[];
  featured: Fixture[];
  more: Fixture[];
};

/**
 * Splits the flat fixture list into the sections the home page actually
 * needs: what's on today, a curated set of marquee matchups this week, and
 * everything else — instead of one long undifferentiated list.
 */
export function buildHomepage(fixtures: Fixture[], featuredLimit = 6): Homepage {
  const today: Fixture[] = [];
  const rest: Fixture[] = [];

  for (const fixture of fixtures) {
    if (fixture.dateEvent === todayIso()) {
      today.push(fixture);
    } else {
      rest.push(fixture);
    }
  }

  const featured: Fixture[] = [];
  const more: Fixture[] = [];

  for (const fixture of rest) {
    const isBigMatch =
      inNextDays(fixture.dateEvent, 7) &&
      (isFeaturedTeam(fixture.strHomeTeam) || isFeaturedTeam(fixture.strAwayTeam));

    if (isBigMatch && featured.length < featuredLimit) {
      featured.push(fixture);
    } else {
      more.push(fixture);
    }
  }

  return { today, featured, more };
}
