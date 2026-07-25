import Link from "next/link";
import type { Fixture } from "@/lib/sportsdb";
import { formatMatchDate } from "@/lib/format";
import { TeamBadge } from "@/components/TeamBadge";

export function FixtureCard({ fixture, showLeague = false }: { fixture: Fixture; showLeague?: boolean }) {
  return (
    <Link
      href={`/${fixture.league.slug}/${fixture.slug}`}
      className="block rounded-xl border border-white/10 bg-neutral-900 px-4 py-3 hover:border-emerald-400/50 hover:bg-neutral-900/70 transition-colors"
    >
      {showLeague && (
        <p className="text-xs font-medium text-emerald-400 mb-2">{fixture.league.name}</p>
      )}
      <div className="flex items-center gap-3">
        <div className="flex-1 flex items-center gap-2 min-w-0">
          <TeamBadge src={fixture.strHomeTeamBadge} alt={fixture.strHomeTeam} />
          <span className="font-semibold text-neutral-100 truncate">{fixture.strHomeTeam}</span>
        </div>
        <span className="shrink-0 text-xs text-neutral-500 font-medium">vs</span>
        <div className="flex-1 flex items-center gap-2 min-w-0 justify-end text-right">
          <span className="font-semibold text-neutral-100 truncate">{fixture.strAwayTeam}</span>
          <TeamBadge src={fixture.strAwayTeamBadge} alt={fixture.strAwayTeam} />
        </div>
      </div>
      <p className="text-sm text-neutral-400 mt-2 text-center">
        {formatMatchDate(fixture.dateEvent, fixture.strTime)}
        {fixture.strTime ? " (hora CDMX)" : ""}
      </p>
    </Link>
  );
}
