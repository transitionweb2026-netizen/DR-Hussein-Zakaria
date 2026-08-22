import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Hero } from "@/components/sections/hero";
import { AboutVideoIntro } from "@/components/sections/about-video-intro";
import { MainServices } from "@/components/sections/main-services";
import { StatsSlider } from "@/components/sections/stats-slider";
import { Technologies } from "@/components/sections/technologies";
import { WhyChooseSection } from "@/components/sections/why-choose-section";
import { HomeReviews } from "@/components/sections/home-reviews";
import { HomeFeaturedVideos } from "@/components/sections/home-featured-videos";
import { Certificates } from "@/components/sections/certificates";
import { HomeArticlesFaq } from "@/components/sections/home-articles-faq";
import { FinalCta } from "@/components/sections/final-cta";
import { getPageSeo } from "@/lib/data/global-settings";
import { pickLocale } from "@/lib/i18n-content";

export async function generateMetadata(
  props: PageProps<"/[locale]">
): Promise<Metadata> {
  const { locale } = await props.params;
  const seo = await getPageSeo("home");
  const seoTitle = pickLocale(seo?.seo_title, locale);
  if (seoTitle) return { title: seoTitle, description: pickLocale(seo?.meta_description, locale) || undefined };

  const t = await getTranslations({ locale, namespace: "meta" });
  return { title: t("title"), description: t("description") };
}

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <Hero />
        <AboutVideoIntro />
        <MainServices />
        <StatsSlider />
        <Technologies />
        <WhyChooseSection />
        <HomeReviews />
        <HomeFeaturedVideos />
        <Certificates />
        <HomeArticlesFaq />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
