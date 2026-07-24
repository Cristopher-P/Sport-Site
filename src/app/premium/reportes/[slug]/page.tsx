import { redirect, notFound } from "next/navigation";
import { getAuthorizedEmail } from "@/lib/require-access";
import { getAllUpcomingFixtures, type Fixture } from "@/lib/sportsdb";
import { getTeamForm, estimateProbability } from "@/lib/team-form";
import { formatMatchDate } from "@/lib/format";

const REPORT_SIZE = 4;

async function analyzeFixture(fixture: Fixture) {
  const [home, away] = await Promise.all([
    fixture.idHomeTeam
      ? getTeamForm(fixture.idHomeTeam, fixture.strHomeTeam)
      : { sequence: "Sin datos recientes", points: 0, played: 0 },
    fixture.idAwayTeam
      ? getTeamForm(fixture.idAwayTeam, fixture.strAwayTeam)
      : { sequence: "Sin datos recientes", points: 0, played: 0 },
  ]);

  const probability = estimateProbability(home, away, fixture.league.sport);
  return { fixture, home, away, probability };
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
  const analyses = await Promise.all(fixtures.map(analyzeFixture));

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-2">
        <h1 className="text-2xl font-bold text-white">Reporte de la semana</h1>
        <span className="rounded-full bg-amber-400/20 text-amber-300 text-xs font-semibold px-2 py-0.5">
          EJEMPLO
        </span>
      </div>
      <p className="text-neutral-400 text-sm">
        Así se ve un reporte real — de hecho, esta es forma reciente real de cada
        equipo, tomada de sus últimos partidos jugados. Cada semana el reporte
        real trae esto mismo para varios partidos por venir — no apuestas
        garantizadas, análisis para que decidas tú.
      </p>

      <div className="space-y-4">
        {analyses.map(({ fixture, home, away, probability }) => (
          <div
            key={fixture.idEvent}
            className="rounded-xl border border-white/10 bg-neutral-900 p-4 space-y-3"
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

            <dl className="text-sm text-neutral-300 space-y-1 pt-2 border-t border-white/5">
              <div>
                <dt className="inline text-neutral-500">
                  Forma reciente {fixture.strHomeTeam}:{" "}
                </dt>
                <dd className="inline">{home.sequence}</dd>
              </div>
              <div>
                <dt className="inline text-neutral-500">
                  Forma reciente {fixture.strAwayTeam}:{" "}
                </dt>
                <dd className="inline">{away.sequence}</dd>
              </div>
              <div>
                <dt className="inline text-neutral-500">Probabilidad estimada: </dt>
                <dd className="inline">
                  Local {probability.home}%
                  {probability.draw > 0 ? ` · Empate ${probability.draw}%` : ""} · Visitante{" "}
                  {probability.away}%
                </dd>
              </div>
            </dl>
          </div>
        ))}
      </div>

      <p className="text-xs text-neutral-600">
        Forma reciente calculada a partir de resultados reales (últimos 5
        partidos jugados). La probabilidad es una estimación simple basada en
        esos puntos, no un modelo profesional ni una garantía de resultado.
        Contenido informativo. +18.
      </p>
    </div>
  );
}
