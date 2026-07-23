import { redirect, notFound } from "next/navigation";
import { getAuthorizedEmail } from "@/lib/require-access";
import { getAllUpcomingFixtures } from "@/lib/sportsdb";
import { formatMatchDate } from "@/lib/format";

const EXAMPLE_ANALYSIS = [
  {
    forma: "V-V-E-D-V (últimos 5)",
    headToHead: "3 victorias local, 1 empate, 1 visitante en los últimos 5",
    probabilidad: "Local 48% · Empate 27% · Visitante 25%",
  },
  {
    forma: "E-V-V-V-D (últimos 5)",
    headToHead: "2 victorias local, 2 empates, 1 visitante en los últimos 5",
    probabilidad: "Local 39% · Empate 30% · Visitante 31%",
  },
  {
    forma: "D-E-V-D-E (últimos 5)",
    headToHead: "1 victoria local, 1 empate, 3 visitante en los últimos 5",
    probabilidad: "Local 30% · Empate 26% · Visitante 44%",
  },
];

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

  const fixtures = (await getAllUpcomingFixtures()).slice(0, EXAMPLE_ANALYSIS.length);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-2">
        <h1 className="text-2xl font-bold text-white">Reporte de la semana</h1>
        <span className="rounded-full bg-amber-400/20 text-amber-300 text-xs font-semibold px-2 py-0.5">
          EJEMPLO
        </span>
      </div>
      <p className="text-neutral-400 text-sm">
        Así se ve un reporte real, con datos de ejemplo para mostrar el formato.
        Cada semana el reporte real trae forma reciente, head-to-head y
        probabilidad estimada de varios partidos por venir — no apuestas
        garantizadas, análisis para que decidas tú.
      </p>

      <div className="space-y-4">
        {fixtures.map((fixture, i) => {
          const analysis = EXAMPLE_ANALYSIS[i % EXAMPLE_ANALYSIS.length];
          return (
            <div
              key={fixture.idEvent}
              className="rounded-xl border border-white/10 bg-neutral-900 p-4 space-y-2"
            >
              <p className="text-xs text-emerald-400 font-medium">{fixture.league.name}</p>
              <p className="font-semibold text-neutral-100">
                {fixture.strHomeTeam} vs {fixture.strAwayTeam}
              </p>
              <p className="text-sm text-neutral-500">
                {formatMatchDate(fixture.dateEvent, fixture.strTime)}
                {fixture.strTime ? " UTC" : ""}
              </p>
              <dl className="text-sm text-neutral-300 space-y-1 pt-2 border-t border-white/5">
                <div>
                  <dt className="inline text-neutral-500">Forma reciente: </dt>
                  <dd className="inline">{analysis.forma}</dd>
                </div>
                <div>
                  <dt className="inline text-neutral-500">Head-to-head: </dt>
                  <dd className="inline">{analysis.headToHead}</dd>
                </div>
                <div>
                  <dt className="inline text-neutral-500">Probabilidad estimada: </dt>
                  <dd className="inline">{analysis.probabilidad}</dd>
                </div>
              </dl>
            </div>
          );
        })}
      </div>

      <p className="text-xs text-neutral-600">
        Datos de ejemplo únicamente. El análisis real usa estadísticas verificadas
        de cada equipo. Contenido informativo, no garantiza resultados. +18.
      </p>
    </div>
  );
}
