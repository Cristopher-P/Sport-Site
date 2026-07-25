import { redirect, notFound } from "next/navigation";
import { getAuthorizedEmail } from "@/lib/require-access";
import { getAllUpcomingFixtures, getRecentLeagueRounds, type Fixture } from "@/lib/sportsdb";
import { getTeamFormFromPool, estimateProbability } from "@/lib/team-form";
import type { League } from "@/lib/leagues";
import { formatMatchDate } from "@/lib/format";
import { ProbabilityBar } from "@/components/ProbabilityBar";
import { StatsTable } from "@/components/StatsTable";

const REPORT_SIZE = 4;

async function analyzeFixtures(fixtures: Fixture[]) {
  const leaguePools = new Map<string, Promise<Awaited<ReturnType<typeof getRecentLeagueRounds>>>>();
  const poolFor = (league: League) => {
    if (!leaguePools.has(league.slug)) {
      leaguePools.set(league.slug, getRecentLeagueRounds(league));
    }
    return leaguePools.get(league.slug)!;
  };

  return Promise.all(
    fixtures.map(async (fixture) => {
      const pool = (await poolFor(fixture.league)).filter((e) => e.idEvent !== fixture.idEvent);
      const home = getTeamFormFromPool(pool, fixture.strHomeTeam);
      const away = getTeamFormFromPool(pool, fixture.strAwayTeam);
      const probability = estimateProbability(home, away, fixture.league.sport);
      return { fixture, home, away, probability };
    })
  );
}

export default async function ReportPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const isExample = slug === "ejemplo";

  if (!isExample) {
    const email = await getAuthorizedEmail();
    if (!email) redirect("/premium/acceso");
    // Reportes reales se agregan aquí conforme se publican cada semana.
    notFound();
  }

  const fixtures = (await getAllUpcomingFixtures()).slice(0, REPORT_SIZE);
  const analyses = await analyzeFixtures(fixtures);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-2">
        <h1 className="text-2xl font-bold text-white">Reporte de la semana</h1>
        <span className="rounded-full bg-amber-400/20 text-amber-300 text-xs font-semibold px-2 py-0.5">
          EJEMPLO
        </span>
      </div>
      <p className="text-neutral-400 text-sm">
        Así se ve un reporte real — de hecho, estas son estadísticas reales de cada
        equipo, tomadas de sus últimos partidos jugados. Cada semana el reporte
        real trae esto mismo para varios partidos por venir — no apuestas
        garantizadas, análisis para que decidas tú.
      </p>

      <div className="space-y-4">
        {analyses.map(({ fixture, home, away, probability }) => {
          const hasStats = home.played > 0 || away.played > 0;
          return (
            <div
              key={fixture.idEvent}
              className="rounded-xl border border-white/10 bg-neutral-900 p-4 space-y-4"
            >
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
                <StatsTable home={home} away={away} />
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-xs text-neutral-600">
        Estadísticas calculadas a partir de resultados reales (hasta 5 partidos
        recientes por equipo). La probabilidad es una estimación simple basada en
        esos datos, no un modelo profesional ni una garantía de resultado.
        Contenido informativo. +18.
      </p>
    </div>
  );
}
