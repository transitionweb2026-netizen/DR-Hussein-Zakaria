import type { MetadataRoute } from "next";
import { getSiteSettings } from "@/lib/data/global-settings";
import { SITE_URL } from "@/lib/seo";

/** The sitewide "block all indexing" switch (Settings -> SEO) flips this
 * to disallow everything -- the same override applied to every page's meta
 * robots tag and the sitemap (see src/lib/seo.ts and src/app/sitemap.ts),
 * so all three stay consistent with one CMS toggle. Off (the default),
 * behavior is unchanged: allow everything except /admin. */
export default async function robots(): Promise<MetadataRoute.Robots> {
  const settings = await getSiteSettings();
  const blocked = Boolean(settings?.block_all_indexing);

  return {
    rules: {
      userAgent: "*",
      ...(blocked ? {} : { allow: "/" }),
      disallow: blocked ? "/" : "/admin",
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
