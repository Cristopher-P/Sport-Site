import Link from "next/link";
import type { Fixture } from "@/lib/sportsdb";
import { formatMatchDate } from "@/lib/format";

export function FixtureCard({ fixture, showLeague = false }: { fixture: Fixture; showLeague?: boolean }) {
  return (
    <Link
      href={`/${fixture.league.slug}/${fixture.slug}`}
      className="block rounded-xl border border-white/10 bg-neutral-900 px-4 py-3 hover:border-emerald-400/50 hover:bg-neutral-900/70 transition-colors"
    >
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          {showLeague && (
            <p className="text-xs font-medium text-emerald-400 mb-1">
              {fixture.league.name}
            </p>
          )}
          <p className="font-semibold text-neutral-100 truncate">
            {fixture.strHomeTeam} <span className="text-neutral-500">vs</span>{" "}
            {fixture.strAwayTeam}
          </p>
          <p className="text-sm text-neutral-400 mt-0.5">
            {formatMatchDate(fixture.dateEvent, fixture.strTime)}
            {fixture.strTime ? " (hora CDMX)" : ""}
          </p>
        </div>
        <span className="shrink-0 text-neutral-600 text-xl">›</span>
      </div>
    </Link>
  );
}
