export function slugify(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function matchSlug(homeTeam: string, awayTeam: string, dateEvent: string): string {
  return `${slugify(homeTeam)}-vs-${slugify(awayTeam)}-${dateEvent}`;
}
