import Link from "next/link";
import { getAllUpcomingFixtures, getAllRecentResults } from "@/lib/sportsdb";
import { buildHomepage } from "@/lib/homepage";
import { LEAGUES } from "@/lib/leagues";
import { getFootballNews } from "@/lib/news";
import { FixtureCard } from "@/components/FixtureCard";
import { ResultCard } from "@/components/ResultCard";
import { NewsCard } from "@/components/NewsCard";
import { AdSlot } from "@/components/AdSlot";

export default async function HomePage() {
  const [fixtures, recentResults, news] = await Promise.all([
    getAllUpcomingFixtures(),
    getAllRecentResults(),
    getFootballNews(),
  ]);
  const { today, featured, more } = buildHomepage(fixtures);

  return (
    <div className="space-y-12">
      <section className="text-center py-6 space-y-4">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
          ¿Qué se juega hoy?
        </h1>
        <p className="text-neutral-400 max-w-xl mx-auto">
          Fútbol, NBA y NFL en un solo lugar, actualizado solo todos los días.
          Suscríbete a{" "}
          <Link href="/premium" className="text-emerald-400 hover:underline">
            CanchaHoy Premium
          </Link>{" "}
          para ver análisis estadístico de varios partidos por venir.
        </p>
        <nav className="flex flex-wrap justify-center gap-2 pt-2">
          {LEAGUES.map((league) => (
            <Link
              key={league.slug}
              href={`/${league.slug}`}
              className="rounded-full border border-white/10 px-3 py-1 text-xs text-neutral-300 hover:border-emerald-400/50 hover:text-white transition-colors"
            >
              {league.name}
            </Link>
          ))}
        </nav>
      </section>

      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="inline-block h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <h2 className="text-lg font-semibold text-neutral-100">Hoy</h2>
        </div>
        {today.length === 0 ? (
          <p className="text-neutral-500 text-sm">
            No hay partidos hoy en las ligas que cubrimos por ahora. Mira los
            destacados de la semana abajo.
          </p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {today.map((fixture) => (
              <FixtureCard key={fixture.idEvent} fixture={fixture} showLeague />
            ))}
          </div>
        )}
      </section>

      {news.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-neutral-100">Noticias</h2>
            <Link href="/noticias" className="text-sm text-emerald-400 hover:underline">
              Ver todas
            </Link>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {news.map((item) => (
              <NewsCard key={item.link} item={item} />
            ))}
          </div>
        </section>
      )}

      {recentResults.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-neutral-100">Resultados recientes</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {recentResults.slice(0, 6).map((fixture) => (
              <ResultCard key={fixture.idEvent} fixture={fixture} showLeague />
            ))}
          </div>
        </section>
      )}

      {featured.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-neutral-100">
            Destacados de la semana
          </h2>
          <p className="text-xs text-neutral-500 -mt-2">
            Selección editorial de grandes equipos, no un ranking de popularidad.
          </p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((fixture) => (
              <FixtureCard key={fixture.idEvent} fixture={fixture} showLeague />
            ))}
          </div>
        </section>
      )}

      <AdSlot slot="REPLACE_WITH_HOME_FEED_SLOT_ID" />

      {more.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-neutral-100">
            Más partidos próximos
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {more.slice(0, 12).map((fixture) => (
              <FixtureCard key={fixture.idEvent} fixture={fixture} showLeague />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
