export function formatMatchDate(dateEvent: string, time?: string | null): string {
  const iso = time ? `${dateEvent}T${time}` : `${dateEvent}T00:00:00`;
  const date = new Date(iso);

  const datePart = date.toLocaleDateString("es-MX", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  if (!time) return datePart;

  const timePart = date.toLocaleTimeString("es-MX", {
    hour: "numeric",
    minute: "2-digit",
  });

  return `${datePart} · ${timePart}`;
}
