import type { Metadata } from "next";
import { routing } from "@/i18n/routing";
import { getPageSeo, getSiteSettings } from "@/lib/data/global-settings";
import { pickLocale } from "@/lib/i18n-content";

/** The site's canonical public origin. Falls back to the known production
 * Vercel URL so canonical/hreflang/sitemap URLs are always absolute and
 * correct even before a custom domain is attached to the project -- set
 * NEXT_PUBLIC_SITE_URL once one is, no code change needed here. */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://dr-hussein-zakaria.vercel.app"
).replace(/\/$/, "");

/** Every indexable public page, keyed exactly like `page_seo.page_key` in
 * Supabase and mapped to its locale-agnostic path segment ("" for Home).
 * Single source of truth shared by every page's generateMetadata AND
 * sitemap.ts -- add a route here once and both stay in sync. */
export const PAGE_ROUTES = {
  home: "",
  about: "/about",
  services: "/services",
  videos: "/videos",
  "patient-stories": "/patient-stories",
  articles: "/articles",
  contact: "/contact",
} as const;

export type PageKey = keyof typeof PAGE_ROUTES;

export function localizedUrl(locale: string, path: string): string {
  return `${SITE_URL}/${locale}${path}`;
}

/** Self-referencing canonical + reciprocal hreflang + x-default for a page.
 * Always locale-correct by construction: /ar/... points at /ar/..., never
 * at the English URL, and vice versa. */
export function buildAlternates(locale: string, path: string) {
  return {
    canonical: localizedUrl(locale, path),
    languages: {
      en: localizedUrl("en", path),
      ar: localizedUrl("ar", path),
      "x-default": localizedUrl(routing.defaultLocale, path),
    },
  };
}

/** True if a CMS `robots` value should exclude the page from the sitemap
 * (a noindex page has no business being submitted for indexing). */
export function isNoindex(robots: string | null | undefined): boolean {
  return Boolean(robots && robots.toLowerCase().includes("noindex"));
}

/** Central metadata builder every public page's generateMetadata calls.
 * Wires the page_seo CMS row (title, description, canonical override,
 * robots, OG image) into real server-rendered Next.js Metadata. A field
 * comes from the CMS when the admin has set it, otherwise from the page's
 * own on-page fallback -- never a mix of both for the same field. */
export async function buildPageMetadata({
  pageKey,
  locale,
  fallbackTitle,
  fallbackDescription,
}: {
  pageKey: PageKey;
  locale: string;
  fallbackTitle: string;
  fallbackDescription?: string;
}): Promise<Metadata> {
  const path = PAGE_ROUTES[pageKey];
  const [seo, siteSettings] = await Promise.all([getPageSeo(pageKey), getSiteSettings()]);

  const title = pickLocale(seo?.seo_title, locale) || fallbackTitle;
  const description = pickLocale(seo?.meta_description, locale) || fallbackDescription || undefined;
  const alternates = buildAlternates(locale, path);

  // canonical_url is one plain string per page_key in the schema (not
  // bilingual, not per-locale) -- it exists as a deliberate full override
  // for the rare case an admin wants BOTH language versions of this page to
  // canonicalize to one exact URL. Left blank (the default, and correct
  // for virtually every page), the locale-correct self-canonical above
  // applies -- an Arabic page always canonicalizes to its own Arabic URL,
  // never silently to the English one.
  const canonicalOverride = seo?.canonical_url?.trim();
  const canonical = canonicalOverride || alternates.canonical;

  // The sitewide "block all indexing" switch (Settings -> SEO) is a
  // deliberate global override: it wins over whatever a per-page robots
  // value says, the same way WordPress's "discourage search engines"
  // setting overrides individual post settings. Left off (the default),
  // behavior is unchanged from before this field existed.
  const robots = siteSettings?.block_all_indexing ? "noindex,nofollow" : seo?.robots || undefined;

  const ogImage = seo?.og_image_url || siteSettings?.default_hero_bg_url || undefined;
  const ogLocale = locale === "ar" ? "ar_AR" : "en_US";
  const ogAlternateLocale = locale === "ar" ? "en_US" : "ar_AR";

  return {
    title,
    description,
    alternates: { ...alternates, canonical },
    robots,
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: pickLocale(siteSettings?.site_name, locale),
      locale: ogLocale,
      alternateLocale: ogAlternateLocale,
      type: "website",
      ...(ogImage ? { images: [{ url: ogImage }] } : {}),
    },
  };
}
