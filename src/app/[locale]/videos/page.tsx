import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { Play } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { PageHero } from "@/components/sections/page-hero";
import { FeaturedVideos } from "@/components/sections/featured-videos";
import { FinalCta } from "@/components/sections/final-cta";

export async function generateMetadata(
  props: PageProps<"/[locale]/videos">
): Promise<Metadata> {
  const { locale } = await props.params;
  const t = await getTranslations({ locale, namespace: "videosPage" });
  return { title: t("hero.headingPrefix") + " " + t("hero.headingHighlight") };
}

export default async function VideosPage() {
  const t = await getTranslations("videosPage");

  return (
    <>
      <Header />
      <main className="flex-1">
        <PageHero
          sectionId="videos-hero"
          eyebrow={t("hero.eyebrow")}
          headingPrefix={t("hero.headingPrefix")}
          headingHighlight={t("hero.headingHighlight")}
          paragraph={t("hero.paragraph")}
          primaryCta={{ label: t("intro.heading"), href: "#featured-videos", icon: <Play className="h-4 w-4" /> }}
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
