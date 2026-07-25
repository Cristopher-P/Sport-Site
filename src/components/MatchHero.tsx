import type { Fixture } from "@/lib/sportsdb";
import { formatMatchDate } from "@/lib/format";
import { TeamBadge } from "@/components/TeamBadge";

export function MatchHero({ fixture, played }: { fixture: Fixture; played: boolean }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-gradient-to-b from-neutral-900 to-neutral-950 px-6 py-8 text-center space-y-6">
      <div className="flex items-center justify-center gap-2">
        {fixture.strLeagueBadge && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={fixture.strLeagueBadge} alt="" className="h-5 w-5 object-contain" />
        )}
        <p className="text-sm text-neutral-400">{fixture.league.name}</p>
      </div>

      <div className="flex items-center justify-center gap-6 sm:gap-12">
        <div className="flex-1 flex flex-col items-center gap-3 max-w-[12rem]">
          <TeamBadge src={fixture.strHomeTeamBadge} alt={fixture.strHomeTeam} size="xl" />
          <span className="font-semibold text-neutral-100 text-base sm:text-lg">
            {fixture.strHomeTeam}
          </span>
        </div>

        <div className="shrink-0">
          {played ? (
            <p className="text-4xl sm:text-5xl font-bold text-white tabular-nums">
              {fixture.intHomeScore} - {fixture.intAwayScore}
            </p>
          ) : (
            <p className="text-xl font-semibold text-neutral-500">VS</p>
          )}
        </div>

        <div className="flex-1 flex flex-col items-center gap-3 max-w-[12rem]">
          <TeamBadge src={fixture.strAwayTeamBadge} alt={fixture.strAwayTeam} size="xl" />
          <span className="font-semibold text-neutral-100 text-base sm:text-lg">
            {fixture.strAwayTeam}
          </span>
        </div>
      </div>

      <div className="space-y-1">
        {played ? (
          <span className="inline-block rounded-full bg-neutral-800 px-3 py-1 text-xs font-semibold text-neutral-300">
            FINAL · {formatMatchDate(fixture.dateEvent, null)}
          </span>
        ) : (
          <span className="inline-block rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400">
            {formatMatchDate(fixture.dateEvent, fixture.strTime)}
            {fixture.strTime ? " (hora CDMX)" : ""}
          </span>
        )}
        {fixture.strVenue && (
          <p className="text-sm text-neutral-500">
            📍 {fixture.strVenue}
            {fixture.strCountry ? `, ${fixture.strCountry}` : ""}
          </p>
        )}
      </div>
    </div>
  );
}
