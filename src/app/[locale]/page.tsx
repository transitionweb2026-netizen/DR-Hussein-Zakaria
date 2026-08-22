import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Hero } from "@/components/sections/hero";
import { AboutIntro } from "@/components/sections/about-intro";
import { VideoIntro } from "@/components/sections/video-intro";
import { StatsSlider } from "@/components/sections/stats-slider";
import { CareerTimeline } from "@/components/sections/career-timeline";
import { Certificates } from "@/components/sections/certificates";
import { MainSpecialties } from "@/components/sections/main-specialties";
import { DoctorMessage } from "@/components/sections/doctor-message";
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
        <AboutIntro />
        <VideoIntro />
        <StatsSlider />
        <CareerTimeline />
        <Certificates />
        <MainSpecialties />
        <DoctorMessage />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
