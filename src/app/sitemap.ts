import type { MetadataRoute } from "next";
import { getAllPageSeo } from "@/lib/data/global-settings";
import { PAGE_ROUTES, SITE_URL, buildAlternates, isNoindex, type PageKey } from "@/lib/seo";

const PRIORITY: Record<PageKey, number> = {
  home: 1,
  about: 0.9,
  services: 0.9,
  videos: 0.7,
  "patient-stories": 0.7,
  articles: 0.7,
  contact: 0.8,
};

const CHANGE_FREQUENCY: Record<PageKey, "weekly" | "monthly"> = {
  home: "weekly",
  about: "monthly",
  services: "monthly",
  videos: "monthly",
  "patient-stories": "monthly",
  articles: "weekly",
  contact: "monthly",
};

/** Generated from the same page_seo rows and PAGE_ROUTES map every page's
 * own metadata reads, so the sitemap can never drift out of sync with what
 * the pages themselves declare as canonical. A page marked noindex in the
 * CMS is excluded entirely rather than submitted for indexing. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const rows = await getAllPageSeo();
  const robotsByKey = new Map(rows.map((row) => [row.page_key, row.robots]));
  const updatedByKey = new Map(rows.map((row) => [row.page_key, row.updated_at]));

  const entries: MetadataRoute.Sitemap = [];

  for (const pageKey of Object.keys(PAGE_ROUTES) as PageKey[]) {
    if (isNoindex(robotsByKey.get(pageKey))) continue;

    const path = PAGE_ROUTES[pageKey];
    const lastModified = updatedByKey.get(pageKey) ?? undefined;
    const { languages } = buildAlternates("en", path);

    for (const locale of ["en", "ar"] as const) {
      entries.push({
        url: `${SITE_URL}/${locale}${path}`,
        lastModified,
        changeFrequency: CHANGE_FREQUENCY[pageKey],
        priority: PRIORITY[pageKey],
        alternates: { languages },
      });
    }
  }

  return entries;
}
