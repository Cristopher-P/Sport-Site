import { SITE_TIME_ZONE, fixtureUtcDate } from "./timezone";

export function formatMatchDate(dateEvent: string, time?: string | null): string {
  const date = fixtureUtcDate(dateEvent, time);

  const datePart = date.toLocaleDateString("es-MX", {
    timeZone: SITE_TIME_ZONE,
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  if (!time) return datePart;

  const timePart = date.toLocaleTimeString("es-MX", {
    timeZone: SITE_TIME_ZONE,
    hour: "numeric",
    minute: "2-digit",
  });

  return `${datePart} · ${timePart}`;
}
