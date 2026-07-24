import type { Fixture } from "./sportsdb";
import { isFeaturedTeam } from "./featured";
import { dateInSiteTimeZone, fixtureUtcDate, todayInSiteTimeZone } from "./timezone";

function inNextDays(fixture: Fixture, days: number): boolean {
  const today = new Date(`${todayInSiteTimeZone()}T00:00:00Z`);
  const limit = new Date(today);
  limit.setUTCDate(limit.getUTCDate() + days);

  const eventLocalDate = new Date(
    `${dateInSiteTimeZone(fixtureUtcDate(fixture.dateEvent, fixture.strTime))}T00:00:00Z`
  );

  return eventLocalDate >= today && eventLocalDate <= limit;
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
 *
 * "Today" is evaluated in SITE_TIME_ZONE (see lib/timezone.ts), not in the
 * event's raw UTC date — a match at 02:00 UTC is still tonight for most of
 * our audience.
 */
export function buildHomepage(fixtures: Fixture[], featuredLimit = 6): Homepage {
  const today: Fixture[] = [];
  const rest: Fixture[] = [];
  const todayLocal = todayInSiteTimeZone();

  for (const fixture of fixtures) {
    const eventLocalDate = dateInSiteTimeZone(
      fixtureUtcDate(fixture.dateEvent, fixture.strTime)
    );

    if (eventLocalDate === todayLocal) {
      today.push(fixture);
    } else {
      rest.push(fixture);
    }
  }

  const featured: Fixture[] = [];
  const more: Fixture[] = [];

  for (const fixture of rest) {
    const isBigMatch =
      inNextDays(fixture, 7) &&
      (isFeaturedTeam(fixture.strHomeTeam) || isFeaturedTeam(fixture.strAwayTeam));

    if (isBigMatch && featured.length < featuredLimit) {
      featured.push(fixture);
    } else {
      more.push(fixture);
    }
  }

  return { today, featured, more };
}
