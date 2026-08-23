import type { MetadataRoute } from "next";
import { getAllPageSeo, getSiteSettings } from "@/lib/data/global-settings";
import { PAGE_ROUTES, SITE_URL, buildAlternates, isNoindex, type PageKey } from "@/lib/seo";

type ChangeFreq = "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";

// Same values the migration seeds into page_seo.sitemap_priority /
// sitemap_change_frequency. Used only as a fallback for a row that somehow
// has no value (e.g. the columns not having landed in the database yet) --
// once the CMS value is present, it always wins. This guarantees current
// sitemap output can never regress to something generic mid-rollout.
const FALLBACK_PRIORITY: Record<PageKey, number> = {
  home: 1,
  about: 0.9,
  services: 0.9,
  videos: 0.7,
  "patient-stories": 0.7,
  articles: 0.7,
  contact: 0.8,
};

const FALLBACK_CHANGE_FREQUENCY: Record<PageKey, ChangeFreq> = {
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
 * the pages themselves declare as canonical. Priority and change frequency
 * are CMS-controlled per page (Settings -> SEO); a page marked noindex in
 * the CMS is excluded entirely rather than submitted for indexing. The
 * sitewide "block all indexing" switch empties the sitemap outright --
 * there's no point submitting URLs the site has asked not to be indexed. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [rows, siteSettings] = await Promise.all([getAllPageSeo(), getSiteSettings()]);
  if (siteSettings?.block_all_indexing) return [];

  const rowByKey = new Map(rows.map((row) => [row.page_key, row]));
  const entries: MetadataRoute.Sitemap = [];

  for (const pageKey of Object.keys(PAGE_ROUTES) as PageKey[]) {
    const row = rowByKey.get(pageKey);
    if (isNoindex(row?.robots)) continue;

    const path = PAGE_ROUTES[pageKey];
    const { languages } = buildAlternates("en", path);

    for (const locale of ["en", "ar"] as const) {
      entries.push({
        url: `${SITE_URL}/${locale}${path}`,
        lastModified: row?.updated_at ?? undefined,
        changeFrequency:
          (row?.sitemap_change_frequency as ChangeFreq | undefined) ?? FALLBACK_CHANGE_FREQUENCY[pageKey],
        priority: row?.sitemap_priority ?? FALLBACK_PRIORITY[pageKey],
        alternates: { languages },
      });
    }
  }

  return entries;
}
