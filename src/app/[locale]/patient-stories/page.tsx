import { getLocale, getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { Heart } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { PageHero } from "@/components/sections/page-hero";
import { PatientStoryGrid } from "@/components/sections/patient-story-grid";
import { Reviews } from "@/components/sections/reviews";
import { FinalCta } from "@/components/sections/final-cta";
import { getPatientStoriesPageContent } from "@/lib/data/patient-stories";
import { pickLocale } from "@/lib/i18n-content";
import { buildPageMetadata } from "@/lib/seo";

export async function generateMetadata(
  props: PageProps<"/[locale]/patient-stories">
): Promise<Metadata> {
  const { locale } = await props.params;
  const t = await getTranslations({ locale, namespace: "patientStoriesPage" });
  return buildPageMetadata({
    pageKey: "patient-stories",
    locale,
    fallbackTitle: t("hero.headingPrefix") + " " + t("hero.headingHighlight"),
    fallbackDescription: t("hero.paragraph"),
  });
}

export default async function PatientStoriesPage() {
  const locale = await getLocale();
  const content = await getPatientStoriesPageContent();

  return (
    <>
      <Header />
      <main className="flex-1">
        <PageHero
          sectionId="patient-stories-hero"
          eyebrow={pickLocale(content?.hero_eyebrow, locale)}
          headingPrefix={pickLocale(content?.hero_heading_prefix, locale)}
          headingHighlight={pickLocale(content?.hero_heading_highlight, locale)}
          paragraph={pickLocale(content?.hero_paragraph, locale)}
          primaryCta={{ label: pickLocale(content?.intro_heading, locale), href: "#patient-stories", icon: <Heart className="h-4 w-4" /> }}
          showPhoneCard={false}
          compact
        />
        <PatientStoryGrid />
        <Reviews
          sectionId="patient-reviews"
          eyebrow={pickLocale(content?.reviews_intro_eyebrow, locale)}
          heading={pickLocale(content?.reviews_intro_heading, locale)}
        />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
