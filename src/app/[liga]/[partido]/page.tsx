import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LEAGUES, getLeagueBySlug } from "@/lib/leagues";
import { getLeagueFixtures, getFixtureBySlug } from "@/lib/sportsdb";
import { formatMatchDate } from "@/lib/format";

export async function generateStaticParams() {
  const params: { liga: string; partido: string }[] = [];

  for (const league of LEAGUES) {
    const fixtures = await getLeagueFixtures(league);
    for (const fixture of fixtures) {
      params.push({ liga: league.slug, partido: fixture.slug });
    }
  }

  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ liga: string; partido: string }>;
}): Promise<Metadata> {
  const { liga, partido } = await params;
  const league = getLeagueBySlug(liga);
  if (!league) return {};

  const fixture = await getFixtureBySlug(league, partido);
  if (!fixture) return {};

  return {
    title: `${fixture.strHomeTeam} vs ${fixture.strAwayTeam} — horario y análisis`,
    description: `¿A qué hora juegan ${fixture.strHomeTeam} y ${fixture.strAwayTeam} en ${league.name}? Horario, sede y análisis estadístico premium.`,
  };
}

export default async function MatchPage({
  params,
}: {
  params: Promise<{ liga: string; partido: string }>;
}) {
  const { liga, partido } = await params;
  const league = getLeagueBySlug(liga);
  if (!league) notFound();

  const fixture = await getFixtureBySlug(league, partido);
  if (!fixture) notFound();

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <Link href={`/${league.slug}`} className="text-sm text-emerald-400 hover:underline">
          ← {league.name}
        </Link>
      </div>

      <div className="text-center space-y-2">
        <p className="text-sm text-neutral-400">{league.name}</p>
        <h1 className="text-2xl sm:text-3xl font-bold text-white">
          {fixture.strHomeTeam} vs {fixture.strAwayTeam}
        </h1>
        <p className="text-neutral-300">
          {formatMatchDate(fixture.dateEvent, fixture.strTime)}
          {fixture.strTime ? " (hora CDMX)" : ""}
        </p>
        {fixture.strVenue && (
          <p className="text-sm text-neutral-500">
            {fixture.strVenue}
            {fixture.strCountry ? `, ${fixture.strCountry}` : ""}
          </p>
        )}
      </div>

      <div className="rounded-xl border border-emerald-400/30 bg-emerald-400/5 px-5 py-4 text-center space-y-2">
        <p className="text-neutral-200 font-medium">
          ¿Quieres forma reciente, historial head-to-head y probabilidades estimadas
          para este y otros partidos por venir?
        </p>
        <Link
          href="/premium"
          className="inline-block rounded-full bg-emerald-500 px-5 py-2 text-sm font-semibold text-neutral-950 hover:bg-emerald-400 transition-colors"
        >
          Ver CanchaHoy Premium
        </Link>
      </div>

      <p className="text-xs text-neutral-600 text-center">
        Información con fines informativos. CanchaHoy no procesa apuestas — decides
        y apuestas en la casa de tu preferencia. +18. Juega con responsabilidad.
      </p>
    </div>
  );
}
