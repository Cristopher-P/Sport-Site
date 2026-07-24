import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LEAGUES, getLeagueBySlug } from "@/lib/leagues";
import { getLeagueFixtures, getLeagueRecentResults } from "@/lib/sportsdb";
import { FixtureCard } from "@/components/FixtureCard";
import { ResultCard } from "@/components/ResultCard";
import { AdSlot } from "@/components/AdSlot";

export async function generateStaticParams() {
  return LEAGUES.map((league) => ({ liga: league.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ liga: string }>;
}): Promise<Metadata> {
  const { liga } = await params;
  const league = getLeagueBySlug(liga);
  if (!league) return {};

  return {
    title: `Horarios y próximos partidos de ${league.name}`,
    description: `Calendario actualizado de ${league.name}: fechas, horarios y próximos partidos.`,
  };
}

export default async function LeaguePage({
  params,
}: {
  params: Promise<{ liga: string }>;
}) {
  const { liga } = await params;
  const league = getLeagueBySlug(liga);
  if (!league) notFound();

  const [fixtures, recentResults] = await Promise.all([
    getLeagueFixtures(league),
    getLeagueRecentResults(league),
  ]);

  return (
    <div className="space-y-10">
      <div>
        <p className="text-sm text-emerald-400 font-medium">{league.sportLabel}</p>
        <h1 className="text-2xl sm:text-3xl font-bold text-white">{league.name}</h1>
        <p className="text-neutral-400 mt-1">Próximos partidos y horarios.</p>
      </div>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-neutral-100">Próximos partidos</h2>
        {fixtures.length === 0 ? (
          <p className="text-neutral-500">
            No hay partidos programados por el momento para {league.name}. Vuelve pronto.
          </p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {fixtures.map((fixture) => (
              <FixtureCard key={fixture.idEvent} fixture={fixture} />
            ))}
          </div>
        )}
      </section>

      <AdSlot slot="REPLACE_WITH_LEAGUE_PAGE_SLOT_ID" />

      {recentResults.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-neutral-100">Resultados recientes</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {recentResults.map((fixture) => (
              <ResultCard key={fixture.idEvent} fixture={fixture} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
