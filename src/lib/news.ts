import { XMLParser } from "fast-xml-parser";

// Marca's own public RSS feed. Deliberately NOT using Google News' RSS proxy —
// its feed is explicitly licensed "solely for personal, non-commercial use
// in a feed reader", which this site (subscriptions + ads) would violate.
// A publisher's own RSS feed exists specifically to be aggregated/syndicated,
// so we only ever show headline + short snippet + link back to Marca — never
// the full article — same etiquette as Google News/Apple News aggregation.
const FEED_URL = "https://www.marca.com/rss/futbol.xml";
const REVALIDATE_SECONDS = 60 * 60; // news moves faster than fixtures

export type NewsItem = {
  title: string;
  summary: string;
  link: string;
  pubDate: string;
  image: string | null;
  source: "Marca";
};

const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: "@_" });

function extractImage(item: Record<string, unknown>): string | null {
  const media = item["media:content"];
  const candidate = Array.isArray(media) ? media[0] : media;
  const url = (candidate as Record<string, unknown> | undefined)?.["@_url"];
  return typeof url === "string" && url.length > 0 ? url : null;
}

export async function getFootballNews(limit = 6): Promise<NewsItem[]> {
  try {
    const res = await fetch(FEED_URL, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; CanchaHoyBot/1.0)" },
      next: { revalidate: REVALIDATE_SECONDS, tags: ["news"] },
    });
    if (!res.ok) return [];

    const xml = await res.text();
    const parsed = parser.parse(xml);
    const items: unknown[] = parsed?.rss?.channel?.item ?? [];

    return items
      .map((raw): NewsItem | null => {
        const item = raw as Record<string, unknown>;
        const title = typeof item.title === "string" ? item.title.trim() : "";
        const summary = typeof item.description === "string" ? item.description.trim() : "";
        const link = typeof item.link === "string" ? item.link.trim() : "";
        const pubDate = typeof item.pubDate === "string" ? item.pubDate.trim() : "";
        if (!title || !link) return null;
        return { title, summary, link, pubDate, image: extractImage(item), source: "Marca" };
      })
      .filter((item): item is NewsItem => item !== null)
      .slice(0, limit);
  } catch {
    return [];
  }
}
