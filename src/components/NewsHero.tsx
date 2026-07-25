import type { NewsItem } from "@/lib/news";

export function NewsHero({ item }: { item: NewsItem }) {
  return (
    <a
      href={item.link}
      target="_blank"
      rel="noopener noreferrer"
      className="block rounded-xl border border-white/10 bg-neutral-900 overflow-hidden hover:border-emerald-400/50 transition-colors sm:flex"
    >
      {item.image && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={item.image}
          alt={item.title}
          className="h-56 sm:h-auto sm:w-1/2 w-full object-cover"
          loading="lazy"
        />
      )}
      <div className="px-5 py-4 flex flex-col justify-center sm:w-1/2">
        <p className="text-xl sm:text-2xl font-bold text-neutral-100 leading-snug">
          {item.title}
        </p>
        {item.summary && (
          <p className="text-neutral-400 mt-2 line-clamp-3">{item.summary}</p>
        )}
        <p className="text-xs text-neutral-600 mt-3">vía {item.source} ↗</p>
      </div>
    </a>
  );
}
