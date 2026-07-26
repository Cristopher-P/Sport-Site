import type { TeamForm } from "@/lib/team-form";
import type { SportKey } from "@/lib/leagues";

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

function chipClass(letter: string): string {
  if (letter === "G") return "bg-emerald-500/20 text-emerald-400";
  if (letter === "P") return "bg-red-500/20 text-red-400";
  return "bg-neutral-700 text-neutral-300";
}

function FormChips({ sequence }: { sequence: string }) {
  if (sequence === "Sin datos recientes") {
    return <span className="text-xs text-neutral-600">—</span>;
  }
  const letters = sequence.split("-");
  return (
    <div className="flex gap-1 w-16">
      {letters.map((letter, i) => (
        <span
          key={i}
          className={`h-5 w-5 flex items-center justify-center rounded text-[10px] font-bold ${chipClass(letter)}`}
        >
          {letter}
        </span>
      ))}
    </div>
  );
}

function FormRow({ home, away }: { home: TeamForm; away: TeamForm }) {
  return (
    <div className="flex items-center justify-between py-1.5 text-sm border-b border-white/5">
      <FormChips sequence={home.sequence} />
      <span className="text-neutral-500 text-xs text-center flex-1">
        Forma (reciente a la izquierda)
      </span>
      <div className="flex justify-end w-16">
        <FormChips sequence={away.sequence} />
      </div>
    </div>
  );
}

export function StatsTable({
  home,
  away,
  sport,
}: {
  home: TeamForm;
  away: TeamForm;
  sport: SportKey;
}) {
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
      <FormRow home={home} away={away} />
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
      {sport === "soccer" && (
        <>
          <Row
            label="Ambos anotaron"
            home={home.bothTeamsScoredPct != null ? `${home.bothTeamsScoredPct}%` : "—"}
            away={away.bothTeamsScoredPct != null ? `${away.bothTeamsScoredPct}%` : "—"}
          />
          <Row
            label="Más de 2.5 goles"
            home={home.over25Pct != null ? `${home.over25Pct}%` : "—"}
            away={away.over25Pct != null ? `${away.over25Pct}%` : "—"}
          />
        </>
      )}
    </div>
  );
}
