import type { LineupPlayer, MatchLineup } from "@/lib/sportsdb";

function PlayerRow({ player }: { player: LineupPlayer }) {
  return (
    <li className="flex items-center gap-2.5">
      {player.strCutout ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={player.strCutout}
          alt=""
          className="h-9 w-9 shrink-0 rounded-full object-cover bg-neutral-800"
          loading="lazy"
        />
      ) : (
        <div className="h-9 w-9 shrink-0 rounded-full bg-neutral-800 border border-white/10 flex items-center justify-center text-xs text-neutral-500 tabular-nums">
          {player.intSquadNumber || "—"}
        </div>
      )}
      <div className="min-w-0">
        <p className="text-sm text-neutral-200 truncate">{player.strPlayer}</p>
        {player.strPosition && (
          <p className="text-xs text-neutral-500 truncate">{player.strPosition}</p>
        )}
      </div>
    </li>
  );
}

export function LineupSection({
  lineup,
  homeTeam,
  homeBadge,
  awayTeam,
  awayBadge,
}: {
  lineup: MatchLineup | null;
  homeTeam: string;
  homeBadge?: string | null;
  awayTeam: string;
  awayBadge?: string | null;
}) {
  if (!lineup) {
    return (
      <section className="rounded-xl border border-white/10 bg-neutral-900 px-5 py-6 text-center">
        <h2 className="text-sm font-semibold text-neutral-200 mb-1">⚽ Alineaciones</h2>
        <p className="text-sm text-neutral-500">
          Aún no anunciadas. Suelen publicarse cerca de la hora del partido.
        </p>
      </section>
    );
  }

  return (
    <section className="rounded-xl border border-white/10 bg-neutral-900 px-5 py-5 space-y-4">
      <h2 className="text-sm font-semibold text-neutral-200 text-center">⚽ Alineaciones</h2>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-3">
            {homeBadge && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={homeBadge} alt="" className="h-5 w-5 object-contain" />
            )}
            <p className="text-xs font-medium text-emerald-400 truncate">{homeTeam}</p>
          </div>
          <ul className="space-y-2.5">
            {lineup.home.starters.map((p) => (
              <PlayerRow key={p.idPlayer} player={p} />
            ))}
          </ul>
        </div>
        <div>
          <div className="flex items-center gap-2 mb-3">
            {awayBadge && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={awayBadge} alt="" className="h-5 w-5 object-contain" />
            )}
            <p className="text-xs font-medium text-emerald-400 truncate">{awayTeam}</p>
          </div>
          <ul className="space-y-2.5">
            {lineup.away.starters.map((p) => (
              <PlayerRow key={p.idPlayer} player={p} />
            ))}
          </ul>
        </div>
      </div>
      {(lineup.home.substitutes.length > 0 || lineup.away.substitutes.length > 0) && (
        <details className="text-sm">
          <summary className="cursor-pointer text-neutral-500 hover:text-neutral-300">
            Ver suplentes
          </summary>
          <div className="grid grid-cols-2 gap-4 mt-3">
            <ul className="space-y-2.5">
              {lineup.home.substitutes.map((p) => (
                <PlayerRow key={p.idPlayer} player={p} />
              ))}
            </ul>
            <ul className="space-y-2.5">
              {lineup.away.substitutes.map((p) => (
                <PlayerRow key={p.idPlayer} player={p} />
              ))}
            </ul>
          </div>
        </details>
      )}
    </section>
  );
}
