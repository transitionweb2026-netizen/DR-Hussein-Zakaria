import { getLocale, getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { Play } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { PageHero } from "@/components/sections/page-hero";
import { FeaturedVideos } from "@/components/sections/featured-videos";
import { FinalCta } from "@/components/sections/final-cta";
import { getVideosPageContent } from "@/lib/data/videos";
import { getPageSeo } from "@/lib/data/global-settings";
import { pickLocale } from "@/lib/i18n-content";

export async function generateMetadata(
  props: PageProps<"/[locale]/videos">
): Promise<Metadata> {
  const { locale } = await props.params;
  const seo = await getPageSeo("videos");
  const seoTitle = pickLocale(seo?.seo_title, locale);
  if (seoTitle) return { title: seoTitle, description: pickLocale(seo?.meta_description, locale) || undefined };

  const t = await getTranslations({ locale, namespace: "videosPage" });
  return { title: t("hero.headingPrefix") + " " + t("hero.headingHighlight") };
}

export default async function VideosPage() {
  const locale = await getLocale();
  const content = await getVideosPageContent();

  return (
    <>
      <Header />
      <main className="flex-1">
        <PageHero
          sectionId="videos-hero"
          eyebrow={pickLocale(content?.hero_eyebrow, locale)}
          headingPrefix={pickLocale(content?.hero_heading_prefix, locale)}
          headingHighlight={pickLocale(content?.hero_heading_highlight, locale)}
          paragraph={pickLocale(content?.hero_paragraph, locale)}
          primaryCta={{ label: pickLocale(content?.intro_heading, locale), href: "#featured-videos", icon: <Play className="h-4 w-4" /> }}
          showPhoneCard={false}
          compact
        />
        <FeaturedVideos />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
