import type { Metadata } from "next";
import { getFootballNews } from "@/lib/news";
import { NewsCard } from "@/components/NewsCard";
import { NewsHero } from "@/components/NewsHero";

export const metadata: Metadata = {
  title: "Noticias de fútbol",
  description: "Últimas noticias de fútbol, vía Marca.",
};

export default async function NoticiasPage() {
  const news = await getFootballNews(24);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white">Noticias</h1>
        <p className="text-neutral-400 mt-1">
          Titulares de fútbol vía Marca — el resumen es nuestro, la nota completa
          está en el enlace.
        </p>
      </div>

      {news.length === 0 ? (
        <p className="text-neutral-500">No hay noticias disponibles por el momento.</p>
      ) : (
        <div className="space-y-6">
          <NewsHero item={news[0]} />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {news.slice(1).map((item) => (
              <NewsCard key={item.link} item={item} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
