// Reference timezone for "today" bucketing and displayed match times.
// TheSportsDB gives event dates/times in UTC, but a match at 02:00 UTC is
// still "tonight" for most of our audience (Mexico / Latin America) — using
// raw UTC dates made evening games show up a day late. Centralized here so
// bucketing (lib/homepage.ts, lib/sportsdb.ts) and display (lib/format.ts)
// stay consistent.
export const SITE_TIME_ZONE = "America/Mexico_City";

/** Returns the current date as YYYY-MM-DD in SITE_TIME_ZONE. */
export function todayInSiteTimeZone(): string {
  return dateInSiteTimeZone(new Date());
}

/** Converts a UTC event date/time into a YYYY-MM-DD string in SITE_TIME_ZONE. */
export function dateInSiteTimeZone(date: Date): string {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: SITE_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  return formatter.format(date);
}

/** Combines TheSportsDB's dateEvent + strTime (both UTC) into a real Date. */
export function fixtureUtcDate(dateEvent: string, time?: string | null): Date {
  const iso = time ? `${dateEvent}T${time}Z` : `${dateEvent}T00:00:00Z`;
  return new Date(iso);
}
