import type { NewsItem } from "@/lib/news";

export function NewsCard({ item }: { item: NewsItem }) {
  return (
    <a
      href={item.link}
      target="_blank"
      rel="noopener noreferrer"
      className="block rounded-xl border border-white/10 bg-neutral-900 overflow-hidden hover:border-emerald-400/50 transition-colors"
    >
      {item.image && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={item.image}
          alt={item.title}
          className="h-40 w-full object-cover"
          loading="lazy"
        />
      )}
      <div className="px-4 py-3">
        <p className="font-semibold text-neutral-100 leading-snug">{item.title}</p>
        {item.summary && (
          <p className="text-sm text-neutral-400 mt-1 line-clamp-2">{item.summary}</p>
        )}
        <p className="text-xs text-neutral-600 mt-2">vía {item.source} ↗</p>
      </div>
    </a>
  );
}
