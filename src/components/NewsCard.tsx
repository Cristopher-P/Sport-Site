import type { NewsItem } from "@/lib/news";

export function NewsCard({ item }: { item: NewsItem }) {
  return (
    <a
      href={item.link}
      target="_blank"
      rel="noopener noreferrer"
      className="block rounded-xl border border-white/10 bg-neutral-900 px-4 py-3 hover:border-emerald-400/50 hover:bg-neutral-900/70 transition-colors"
    >
      <p className="font-semibold text-neutral-100 leading-snug">{item.title}</p>
      {item.summary && (
        <p className="text-sm text-neutral-400 mt-1 line-clamp-2">{item.summary}</p>
      )}
      <p className="text-xs text-neutral-600 mt-2">vía {item.source} ↗</p>
    </a>
  );
}
