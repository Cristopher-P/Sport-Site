import type { MatchAnalysis } from "@/lib/report-analysis";
import { formatMatchDate } from "@/lib/format";
import { ProbabilityBar } from "@/components/ProbabilityBar";
import { StatsTable } from "@/components/StatsTable";

export function MatchAnalysisCard({ analysis }: { analysis: MatchAnalysis }) {
  const { fixture, home, away, probability, nota } = analysis;
  const hasStats = home.played > 0 || away.played > 0;

  return (
    <div className="rounded-xl border border-white/10 bg-neutral-900 p-4 space-y-4">
      <div>
        <p className="text-xs text-emerald-400 font-medium">{fixture.league.name}</p>
        <p className="font-semibold text-neutral-100">
          {fixture.strHomeTeam} vs {fixture.strAwayTeam}
        </p>
        <p className="text-sm text-neutral-500">
          {formatMatchDate(fixture.dateEvent, fixture.strTime)}
          {fixture.strTime ? " (hora CDMX)" : ""}
        </p>
      </div>

      {nota && (
        <p className="text-sm text-neutral-300 bg-white/5 rounded-lg px-3 py-2">{nota}</p>
      )}

      {hasStats && (
        <ProbabilityBar
          home={probability.home}
          draw={probability.draw}
          away={probability.away}
          homeLabel={fixture.strHomeTeam}
          awayLabel={fixture.strAwayTeam}
        />
      )}

      <div className="pt-1 border-t border-white/5">
        <StatsTable home={home} away={away} sport={fixture.league.sport} />
      </div>
    </div>
  );
}
