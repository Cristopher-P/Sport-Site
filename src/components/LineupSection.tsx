import type { MatchLineup } from "@/lib/sportsdb";

function PlayerList({ players }: { players: { idPlayer: string; strPlayer: string; strPosition?: string | null }[] }) {
  return (
    <ul className="space-y-1 text-sm">
      {players.map((p) => (
        <li key={p.idPlayer} className="flex justify-between gap-2 text-neutral-300">
          <span>{p.strPlayer}</span>
          {p.strPosition && <span className="text-neutral-600 text-xs shrink-0">{p.strPosition}</span>}
        </li>
      ))}
    </ul>
  );
}

export function LineupSection({
  lineup,
  homeTeam,
  awayTeam,
}: {
  lineup: MatchLineup | null;
  homeTeam: string;
  awayTeam: string;
}) {
  if (!lineup) {
    return (
      <section className="rounded-xl border border-white/10 bg-neutral-900 px-5 py-4 text-center">
        <h2 className="text-sm font-semibold text-neutral-200 mb-1">Alineaciones</h2>
        <p className="text-sm text-neutral-500">
          Aún no anunciadas. Suelen publicarse cerca de la hora del partido.
        </p>
      </section>
    );
  }

  return (
    <section className="rounded-xl border border-white/10 bg-neutral-900 px-5 py-4 space-y-4">
      <h2 className="text-sm font-semibold text-neutral-200 text-center">Alineaciones</h2>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs font-medium text-emerald-400 mb-2">{homeTeam}</p>
          <PlayerList players={lineup.home.starters} />
        </div>
        <div>
          <p className="text-xs font-medium text-emerald-400 mb-2">{awayTeam}</p>
          <PlayerList players={lineup.away.starters} />
        </div>
      </div>
      {(lineup.home.substitutes.length > 0 || lineup.away.substitutes.length > 0) && (
        <details className="text-sm">
          <summary className="cursor-pointer text-neutral-500 hover:text-neutral-300">
            Ver suplentes
          </summary>
          <div className="grid grid-cols-2 gap-4 mt-3">
            <PlayerList players={lineup.home.substitutes} />
            <PlayerList players={lineup.away.substitutes} />
          </div>
        </details>
      )}
    </section>
  );
}
