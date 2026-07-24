// Curación manual de "grandes equipos" por liga para armar la sección de
// destacados. No es un ranking de popularidad real (no tenemos esos datos
// gratis) — es una selección editorial honesta, no analítica.
const FEATURED_TEAMS = [
  // Premier League
  "Manchester United",
  "Manchester City",
  "Liverpool",
  "Arsenal",
  "Chelsea",
  "Tottenham",
  // La Liga
  "Real Madrid",
  "Barcelona",
  "Atletico Madrid",
  "Atlético Madrid",
  // Liga MX
  "América",
  "Guadalajara",
  "Chivas",
  "Cruz Azul",
  "Monterrey",
  "Tigres",
  "Pumas",
  // MLS
  "Inter Miami",
  "LA Galaxy",
  "Los Angeles FC",
  // NBA
  "Lakers",
  "Warriors",
  "Celtics",
  "Knicks",
  // NFL
  "Cowboys",
  "Chiefs",
  "Eagles",
  "49ers",
];

export function isFeaturedTeam(teamName: string): boolean {
  const normalized = teamName.toLowerCase();
  return FEATURED_TEAMS.some((team) => normalized.includes(team.toLowerCase()));
}
