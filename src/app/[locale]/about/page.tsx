import { getLocale, getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { PageHero } from "@/components/sections/page-hero";
import { AboutBiography } from "@/components/sections/about-biography";
import { AboutVideoIntroSection } from "@/components/sections/about-video-intro-section";
import { AboutStats } from "@/components/sections/about-stats";
import { AboutCareer } from "@/components/sections/about-career";
import { AboutCertificates } from "@/components/sections/about-certificates";
import { AboutSpecialties } from "@/components/sections/about-specialties";
import { DoctorMessage } from "@/components/sections/doctor-message";
import { FinalCta } from "@/components/sections/final-cta";
import { getAboutPageContent } from "@/lib/data/about";
import { getPageSeo } from "@/lib/data/global-settings";
import { pickLocale } from "@/lib/i18n-content";

export async function generateMetadata(
  props: PageProps<"/[locale]/about">
): Promise<Metadata> {
  const { locale } = await props.params;
  const seo = await getPageSeo("about");
  const seoTitle = pickLocale(seo?.seo_title, locale);
  if (seoTitle) return { title: seoTitle, description: pickLocale(seo?.meta_description, locale) || undefined };

  const t = await getTranslations({ locale, namespace: "aboutIntro" });
  return { title: t("headingPrefix") + " " + t("headingHighlight") };
}

export default async function AboutPage() {
  const locale = await getLocale();
  const content = await getAboutPageContent();

  return (
    <>
      <Header />
      <main className="flex-1">
        <PageHero
          sectionId="about-hero"
          eyebrow={pickLocale(content?.hero_eyebrow, locale)}
          headingPrefix={pickLocale(content?.hero_heading_prefix, locale)}
          headingHighlight={pickLocale(content?.hero_heading_highlight, locale)}
          paragraph={pickLocale(content?.hero_paragraph, locale)}
          primaryCta={{ label: pickLocale(content?.hero_cta_label, locale), href: "#biography", icon: <ArrowRight className="h-4 w-4" /> }}
          showPhoneCard={false}
          compact
        />
        <AboutBiography />
        <AboutVideoIntroSection />
        <AboutStats />
        <AboutCareer />
        <AboutCertificates />
        <AboutSpecialties />
        <DoctorMessage />
        <FinalCta sectionId="contact" title={pickLocale(content?.cta_title, locale)} subtitle={pickLocale(content?.cta_subtitle, locale)} />
      </main>
      <Footer />
    </>
  );
}
