import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LEAGUES, getLeagueBySlug } from "@/lib/leagues";
import {
  getLeagueFixtures,
  getFixtureBySlug,
  getLineup,
  getRecentLeagueRounds,
} from "@/lib/sportsdb";
import { getTeamFormFromPool, estimateProbability } from "@/lib/team-form";
import { getAuthorizedEmail } from "@/lib/require-access";
import { getFootballNews, filterNewsByTeams } from "@/lib/news";
import { MatchHero } from "@/components/MatchHero";
import { LineupSection } from "@/components/LineupSection";
import { PreviousMatchesList } from "@/components/PreviousMatchesList";
import { ProbabilityBar } from "@/components/ProbabilityBar";
import { StatsTable } from "@/components/StatsTable";
import { NewsCard } from "@/components/NewsCard";

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

  const [lineup, pool, email, news] = await Promise.all([
    getLineup(fixture.idEvent),
    getRecentLeagueRounds(league),
    getAuthorizedEmail(),
    getFootballNews(30),
  ]);

  const relatedNews = filterNewsByTeams(news, [fixture.strHomeTeam, fixture.strAwayTeam]);

  // The pool spans several rounds, so it includes the match itself once
  // played — exclude it from "partidos anteriores" so a team doesn't show
  // up playing itself.
  const poolExcludingThisMatch = pool.filter((e) => e.idEvent !== fixture.idEvent);
  const homePrevious = poolExcludingThisMatch.filter(
    (e) => e.strHomeTeam === fixture.strHomeTeam || e.strAwayTeam === fixture.strHomeTeam
  );
  const awayPrevious = poolExcludingThisMatch.filter(
    (e) => e.strHomeTeam === fixture.strAwayTeam || e.strAwayTeam === fixture.strAwayTeam
  );

  const homeForm = getTeamFormFromPool(poolExcludingThisMatch, fixture.strHomeTeam);
  const awayForm = getTeamFormFromPool(poolExcludingThisMatch, fixture.strAwayTeam);
  const probability = estimateProbability(homeForm, awayForm, fixture.league.sport);
  const hasStats = homeForm.played > 0 || awayForm.played > 0;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
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
          Partidos anteriores
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

      {relatedNews.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-sm font-semibold text-neutral-200 text-center">
            Noticias relacionadas
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {relatedNews.map((item) => (
              <NewsCard key={item.link} item={item} />
            ))}
          </div>
        </section>
      )}

      {!played &&
        (email ? (
          <div className="rounded-xl border border-emerald-400/30 bg-emerald-400/5 px-5 py-5 space-y-5">
            <p className="text-xs font-semibold text-emerald-400 text-center">
              ANÁLISIS PREMIUM
            </p>

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
              <StatsTable home={homeForm} away={awayForm} />
            </div>

            <p className="text-xs text-neutral-500 text-center">
              Estadísticas calculadas con partidos reales (hasta 5 por equipo, de
              rondas recientes). La probabilidad es una estimación simple a partir de
              esos datos, no un modelo profesional ni garantía de resultado.
            </p>
          </div>
        ) : (
          <div className="rounded-xl border border-emerald-400/30 bg-emerald-400/5 px-5 py-4 text-center space-y-2">
            <p className="text-neutral-200 font-medium">
              ¿Quieres estadísticas completas y probabilidad estimada para este y
              otros partidos por venir?
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
