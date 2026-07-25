import { SITE_TIME_ZONE, fixtureUtcDate } from "./timezone";

/**
 * Formats a bare "YYYY-MM-DD" calendar date (e.g. a finished match's date,
 * no kickoff time attached). Deliberately does NOT go through fixtureUtcDate
 * — treating a date-only value as UTC midnight and converting to
 * SITE_TIME_ZONE can shift it back a day, which broke result page links
 * (displayed date didn't match the slug's date).
 */
export function formatDateOnly(dateEvent: string): string {
  const [year, month, day] = dateEvent.split("-").map(Number);
  const date = new Date(year, month - 1, day);

  return date.toLocaleDateString("es-MX", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

export function formatMatchDate(dateEvent: string, time?: string | null): string {
  if (!time) return formatDateOnly(dateEvent);

  const date = fixtureUtcDate(dateEvent, time);

  const datePart = date.toLocaleDateString("es-MX", {
    timeZone: SITE_TIME_ZONE,
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  const timePart = date.toLocaleTimeString("es-MX", {
    timeZone: SITE_TIME_ZONE,
    hour: "numeric",
    minute: "2-digit",
  });

  return `${datePart} · ${timePart}`;
}
