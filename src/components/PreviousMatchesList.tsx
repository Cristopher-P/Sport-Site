import type { SportEvent } from "@/lib/sportsdb";
import { TeamBadge } from "@/components/TeamBadge";

function resultBadge(event: SportEvent, teamName: string): { label: string; className: string } {
  const isHome = event.strHomeTeam === teamName;
  const own = Number(isHome ? event.intHomeScore : event.intAwayScore);
  const opp = Number(isHome ? event.intAwayScore : event.intHomeScore);
  if (own > opp) return { label: "G", className: "bg-emerald-500/20 text-emerald-400" };
  if (own < opp) return { label: "P", className: "bg-red-500/20 text-red-400" };
  return { label: "E", className: "bg-neutral-700 text-neutral-300" };
}

export function PreviousMatchesList({
  teamName,
  results,
}: {
  teamName: string;
  results: SportEvent[];
}) {
  if (results.length === 0) {
    return <p className="text-sm text-neutral-500">Sin partidos recientes disponibles.</p>;
  }

  return (
    <ul className="space-y-2.5">
      {results.slice(0, 5).map((event) => {
        const isHome = event.strHomeTeam === teamName;
        const opponent = isHome ? event.strAwayTeam : event.strHomeTeam;
        const opponentBadge = isHome ? event.strAwayTeamBadge : event.strHomeTeamBadge;
        const badge = resultBadge(event, teamName);
        return (
          <li key={event.idEvent} className="flex items-center gap-2 text-sm">
            <span
              className={`shrink-0 h-5 w-5 flex items-center justify-center rounded text-xs font-bold ${badge.className}`}
            >
              {badge.label}
            </span>
            <TeamBadge src={opponentBadge} alt={opponent} />
            <span className="text-neutral-300 truncate flex-1">vs {opponent}</span>
            <span className="text-neutral-500 tabular-nums">
              {event.intHomeScore}-{event.intAwayScore}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
