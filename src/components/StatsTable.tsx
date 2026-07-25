import type { TeamForm } from "@/lib/team-form";

function Row({
  label,
  home,
  away,
}: {
  label: string;
  home: string | number;
  away: string | number;
}) {
  return (
    <div className="flex items-center justify-between py-1.5 text-sm border-b border-white/5 last:border-0">
      <span className="w-16 text-neutral-200 font-medium tabular-nums">{home}</span>
      <span className="text-neutral-500 text-xs text-center flex-1">{label}</span>
      <span className="w-16 text-neutral-200 font-medium text-right tabular-nums">{away}</span>
    </div>
  );
}

export function StatsTable({ home, away }: { home: TeamForm; away: TeamForm }) {
  if (home.played === 0 && away.played === 0) {
    return (
      <p className="text-sm text-neutral-500 text-center">
        Sin suficientes partidos recientes para calcular estadísticas.
      </p>
    );
  }

  const homeGoalDiff = home.goalsFor - home.goalsAgainst;
  const awayGoalDiff = away.goalsFor - away.goalsAgainst;

  return (
    <div>
      <Row label="Partidos analizados" home={home.played} away={away.played} />
      <Row
        label="Victorias-Empates-Derrotas"
        home={`${home.wins}-${home.draws}-${home.losses}`}
        away={`${away.wins}-${away.draws}-${away.losses}`}
      />
      <Row label="Puntos" home={home.points} away={away.points} />
      <Row label="Goles a favor" home={home.goalsFor} away={away.goalsFor} />
      <Row label="Goles en contra" home={home.goalsAgainst} away={away.goalsAgainst} />
      <Row
        label="Diferencia de gol"
        home={homeGoalDiff > 0 ? `+${homeGoalDiff}` : homeGoalDiff}
        away={awayGoalDiff > 0 ? `+${awayGoalDiff}` : awayGoalDiff}
      />
    </div>
  );
}
