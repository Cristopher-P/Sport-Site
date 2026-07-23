export type SportKey = "soccer" | "basketball" | "american-football";

export type League = {
  slug: string;
  id: string;
  name: string;
  sport: SportKey;
  sportLabel: string;
};

export const LEAGUES: League[] = [
  {
    slug: "premier-league",
    id: "4328",
    name: "Premier League",
    sport: "soccer",
    sportLabel: "Fútbol",
  },
  {
    slug: "la-liga",
    id: "4335",
    name: "La Liga",
    sport: "soccer",
    sportLabel: "Fútbol",
  },
  {
    slug: "liga-mx",
    id: "4350",
    name: "Liga MX",
    sport: "soccer",
    sportLabel: "Fútbol",
  },
  {
    slug: "mls",
    id: "4346",
    name: "MLS",
    sport: "soccer",
    sportLabel: "Fútbol",
  },
  {
    slug: "nba",
    id: "4387",
    name: "NBA",
    sport: "basketball",
    sportLabel: "Basquetbol",
  },
  {
    slug: "nfl",
    id: "4391",
    name: "NFL",
    sport: "american-football",
    sportLabel: "Fútbol Americano",
  },
];

export function getLeagueBySlug(slug: string): League | undefined {
  return LEAGUES.find((l) => l.slug === slug);
}
