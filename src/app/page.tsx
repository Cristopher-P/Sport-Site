import Link from "next/link";
import { getAllUpcomingFixtures } from "@/lib/sportsdb";
import { FixtureCard } from "@/components/FixtureCard";

export default async function HomePage() {
  const fixtures = await getAllUpcomingFixtures();

  return (
    <div className="space-y-10">
      <section className="text-center py-8 space-y-4">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
          Horarios de los próximos partidos
        </h1>
        <p className="text-neutral-400 max-w-xl mx-auto">
          Fútbol, NBA y NFL en un solo lugar. Gratis para siempre. Suscríbete a{" "}
          <Link href="/premium" className="text-emerald-400 hover:underline">
            CanchaHoy Premium
          </Link>{" "}
          para ver análisis estadístico de varios partidos por venir.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-neutral-200">Próximos partidos</h2>
        {fixtures.length === 0 ? (
          <p className="text-neutral-500">
            No hay partidos programados por el momento. Vuelve pronto.
          </p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {fixtures.slice(0, 20).map((fixture) => (
              <FixtureCard key={fixture.idEvent} fixture={fixture} showLeague />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
