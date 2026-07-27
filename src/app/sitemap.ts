import type { MetadataRoute } from "next";
import { LEAGUES } from "@/lib/leagues";
import { getLeagueFixtures } from "@/lib/sportsdb";
import { SITE_URL } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: "hourly", priority: 1 },
    { url: `${SITE_URL}/premium`, changeFrequency: "weekly", priority: 0.8 },
  ];

  for (const league of LEAGUES) {
    entries.push({
      url: `${SITE_URL}/${league.slug}`,
      changeFrequency: "hourly",
      priority: 0.7,
    });

    const fixtures = await getLeagueFixtures(league);
    for (const fixture of fixtures) {
      entries.push({
        url: `${SITE_URL}/${league.slug}/${fixture.slug}`,
        changeFrequency: "daily",
        priority: 0.5,
      });
    }
  }

  return entries;
}
