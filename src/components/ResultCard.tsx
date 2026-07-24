import Link from "next/link";
import type { Fixture } from "@/lib/sportsdb";
import { formatMatchDate } from "@/lib/format";

function TeamBadge({ src, alt }: { src?: string | null; alt: string }) {
  if (!src) {
    return (
      <div className="h-8 w-8 shrink-0 rounded-full bg-neutral-800 border border-white/10" />
    );
  }
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={alt} className="h-8 w-8 shrink-0 object-contain" loading="lazy" />;
}

export function ResultCard({ fixture, showLeague = false }: { fixture: Fixture; showLeague?: boolean }) {
  return (
    <Link
      href={`/${fixture.league.slug}/${fixture.slug}`}
      className="block rounded-xl border border-white/10 bg-neutral-900 px-4 py-3 hover:border-emerald-400/50 hover:bg-neutral-900/70 transition-colors"
    >
      <div className="flex items-center justify-between gap-2 mb-2">
        {showLeague ? (
          <p className="text-xs font-medium text-emerald-400">{fixture.league.name}</p>
        ) : (
          <span />
        )}
        <span className="text-xs font-medium text-neutral-500">Final</span>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex-1 flex items-center gap-2 min-w-0">
          <TeamBadge src={fixture.strHomeTeamBadge} alt={fixture.strHomeTeam} />
          <span className="font-semibold text-neutral-100 truncate">{fixture.strHomeTeam}</span>
        </div>
        <span className="shrink-0 rounded-md bg-neutral-800 px-2 py-1 text-sm font-bold text-white tabular-nums">
          {fixture.intHomeScore} - {fixture.intAwayScore}
        </span>
        <div className="flex-1 flex items-center gap-2 min-w-0 justify-end text-right">
          <span className="font-semibold text-neutral-100 truncate">{fixture.strAwayTeam}</span>
          <TeamBadge src={fixture.strAwayTeamBadge} alt={fixture.strAwayTeam} />
        </div>
      </div>
      <p className="text-sm text-neutral-500 mt-2 text-center">
        {formatMatchDate(fixture.dateEvent, null)}
      </p>
    </Link>
  );
}
