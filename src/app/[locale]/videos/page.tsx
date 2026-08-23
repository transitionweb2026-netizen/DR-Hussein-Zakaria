import { getLocale, getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { Play } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { PageHero } from "@/components/sections/page-hero";
import { FeaturedVideos } from "@/components/sections/featured-videos";
import { FinalCta } from "@/components/sections/final-cta";
import { getVideosPageContent } from "@/lib/data/videos";
import { pickLocale } from "@/lib/i18n-content";
import { buildPageMetadata } from "@/lib/seo";

export async function generateMetadata(
  props: PageProps<"/[locale]/videos">
): Promise<Metadata> {
  const { locale } = await props.params;
  const t = await getTranslations({ locale, namespace: "videosPage" });
  return buildPageMetadata({
    pageKey: "videos",
    locale,
    fallbackTitle: t("hero.headingPrefix") + " " + t("hero.headingHighlight"),
    fallbackDescription: t("hero.paragraph"),
  });
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
