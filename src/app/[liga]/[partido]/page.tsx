import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LEAGUES, getLeagueBySlug } from "@/lib/leagues";
import {
  getLeagueFixtures,
  getFixtureBySlug,
  getLineup,
  getTeamRecentResults,
} from "@/lib/sportsdb";
import { getTeamForm, estimateProbability, type SimpleProbability } from "@/lib/team-form";
import { getAuthorizedEmail } from "@/lib/require-access";
import { MatchHero } from "@/components/MatchHero";
import { LineupSection } from "@/components/LineupSection";
import { PreviousMatchesList } from "@/components/PreviousMatchesList";
import { ProbabilityBar } from "@/components/ProbabilityBar";

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

  const played = fixture.intHomeScore != null && fixture.intAwayScore != null;

  return {
    title: played
      ? `${fixture.strHomeTeam} ${fixture.intHomeScore}-${fixture.intAwayScore} ${fixture.strAwayTeam} — resultado y alineaciones`
      : `${fixture.strHomeTeam} vs ${fixture.strAwayTeam} — horario y análisis`,
    description: played
      ? `Resultado final: ${fixture.strHomeTeam} ${fixture.intHomeScore}-${fixture.intAwayScore} ${fixture.strAwayTeam} en ${league.name}, con alineaciones.`
      : `¿A qué hora juegan ${fixture.strHomeTeam} y ${fixture.strAwayTeam} en ${league.name}? Horario, sede y análisis estadístico premium.`,
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

  const played = fixture.intHomeScore != null && fixture.intAwayScore != null;

  const [lineup, homeResults, awayResults, email] = await Promise.all([
    getLineup(fixture.idEvent),
    fixture.idHomeTeam ? getTeamRecentResults(fixture.idHomeTeam) : Promise.resolve([]),
    fixture.idAwayTeam ? getTeamRecentResults(fixture.idAwayTeam) : Promise.resolve([]),
    getAuthorizedEmail(),
  ]);

  // Recent results include the match itself once it's played — exclude it
  // from "partidos anteriores" so a team doesn't show up playing itself.
  const homePrevious = homeResults.filter((e) => e.idEvent !== fixture.idEvent);
  const awayPrevious = awayResults.filter((e) => e.idEvent !== fixture.idEvent);

  let insight: { home: string; away: string; probability: SimpleProbability } | null = null;
  if (email && !played) {
    const [home, away] = await Promise.all([
      fixture.idHomeTeam
        ? getTeamForm(fixture.idHomeTeam, fixture.strHomeTeam)
        : { sequence: "Sin datos recientes", points: 0, played: 0 },
      fixture.idAwayTeam
        ? getTeamForm(fixture.idAwayTeam, fixture.strAwayTeam)
        : { sequence: "Sin datos recientes", points: 0, played: 0 },
    ]);
    insight = {
      home: home.sequence,
      away: away.sequence,
      probability: estimateProbability(home, away, fixture.league.sport),
    };
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <Link href={`/${league.slug}`} className="text-sm text-emerald-400 hover:underline">
          ← {league.name}
        </Link>
      </div>

      <MatchHero fixture={fixture} played={played} />

      <LineupSection
        lineup={lineup}
        homeTeam={fixture.strHomeTeam}
        homeBadge={fixture.strHomeTeamBadge}
        awayTeam={fixture.strAwayTeam}
        awayBadge={fixture.strAwayTeamBadge}
      />

      <section className="rounded-xl border border-white/10 bg-neutral-900 px-5 py-5">
        <h2 className="text-sm font-semibold text-neutral-200 text-center mb-4">
          📋 Partidos anteriores
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs font-medium text-emerald-400 mb-2 truncate">
              {fixture.strHomeTeam}
            </p>
            <PreviousMatchesList teamName={fixture.strHomeTeam} results={homePrevious} />
          </div>
          <div>
            <p className="text-xs font-medium text-emerald-400 mb-2 truncate">
              {fixture.strAwayTeam}
            </p>
            <PreviousMatchesList teamName={fixture.strAwayTeam} results={awayPrevious} />
          </div>
        </div>
      </section>

      {!played &&
        (insight ? (
          <div className="rounded-xl border border-emerald-400/30 bg-emerald-400/5 px-5 py-5 space-y-4">
            <p className="text-xs font-semibold text-emerald-400 text-center">
              ⭐ ANÁLISIS PREMIUM
            </p>
            <ProbabilityBar
              home={insight.probability.home}
              draw={insight.probability.draw}
              away={insight.probability.away}
              homeLabel={fixture.strHomeTeam}
              awayLabel={fixture.strAwayTeam}
            />
            <dl className="text-sm text-neutral-200 space-y-1 pt-2 border-t border-white/5">
              <div>
                <dt className="inline text-neutral-400">
                  Forma reciente {fixture.strHomeTeam}:{" "}
                </dt>
                <dd className="inline">{insight.home}</dd>
              </div>
              <div>
                <dt className="inline text-neutral-400">
                  Forma reciente {fixture.strAwayTeam}:{" "}
                </dt>
                <dd className="inline">{insight.away}</dd>
              </div>
            </dl>
            <p className="text-xs text-neutral-500 text-center">
              Forma reciente real (últimos 5 partidos jugados). Probabilidad: estimación
              simple, no un modelo profesional ni garantía de resultado.
            </p>
          </div>
        ) : (
          <div className="rounded-xl border border-emerald-400/30 bg-emerald-400/5 px-5 py-4 text-center space-y-2">
            <p className="text-neutral-200 font-medium">
              ¿Quieres forma reciente y probabilidad estimada para este y otros
              partidos por venir?
            </p>
            <Link
              href="/premium"
              className="inline-block rounded-full bg-emerald-500 px-5 py-2 text-sm font-semibold text-neutral-950 hover:bg-emerald-400 transition-colors"
            >
              Ver CanchaHoy Premium
            </Link>
          </div>
        ))}

      <p className="text-xs text-neutral-600 text-center">
        Información con fines informativos. CanchaHoy no procesa apuestas — decides
        y apuestas en la casa de tu preferencia. +18. Juega con responsabilidad.
      </p>
    </div>
  );
}
