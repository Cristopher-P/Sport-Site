import type { Metadata } from "next";
import { redirect, notFound } from "next/navigation";
import { getAuthorizedEmail } from "@/lib/require-access";
import { getAllUpcomingFixtures } from "@/lib/sportsdb";
import { analyzeFixtures, resolveReportMatches } from "@/lib/report-analysis";
import { REPORTS } from "@/content/reports";
import { MatchAnalysisCard } from "@/components/MatchAnalysisCard";

const EXAMPLE_SIZE = 4;

// This page reads the access cookie for any slug other than "ejemplo", so it
// can never be safely static — without this, an unmatched slug (nobody
// logged in, no such report) crashed with a 500 (DYNAMIC_SERVER_USAGE)
// instead of a clean redirect/404, because generateStaticParams returning an
// empty array (no reports published yet) tells Next to try caching this
// route as static, which conflicts with reading cookies() at request time.
export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  return REPORTS.map((report) => ({ slug: report.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  if (slug === "ejemplo") return { title: "Reporte de ejemplo" };
  const report = REPORTS.find((r) => r.slug === slug);
  return report ? { title: report.titulo } : {};
}

export default async function ReportPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  if (slug === "ejemplo") {
    const fixtures = (await getAllUpcomingFixtures()).slice(0, EXAMPLE_SIZE);
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
          {analyses.map((analysis) => (
            <MatchAnalysisCard key={analysis.fixture.idEvent} analysis={analysis} />
          ))}
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

  const email = await getAuthorizedEmail();
  if (!email) redirect("/premium/acceso");

  const report = REPORTS.find((r) => r.slug === slug);
  if (!report) notFound();

  const analyses = await resolveReportMatches(report.matches);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">{report.titulo}</h1>
        <p className="text-sm text-neutral-500 mt-1">Publicado el {report.publicadoEl}</p>
      </div>

      {analyses.length === 0 ? (
        <p className="text-neutral-500">
          No pudimos cargar los partidos de este reporte por el momento. Intenta de
          nuevo en unos minutos.
        </p>
      ) : (
        <div className="space-y-4">
          {analyses.map((analysis) => (
            <MatchAnalysisCard key={analysis.fixture.idEvent} analysis={analysis} />
          ))}
        </div>
      )}

      <p className="text-xs text-neutral-600">
        Estadísticas calculadas a partir de resultados reales (hasta 5 partidos
        recientes por equipo). La probabilidad es una estimación simple basada en
        esos datos, no un modelo profesional ni una garantía de resultado.
        Contenido informativo. +18.
      </p>
    </div>
  );
}
