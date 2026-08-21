import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { Heart } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { PageHero } from "@/components/sections/page-hero";
import { PatientStoryGrid } from "@/components/sections/patient-story-grid";
import { Reviews } from "@/components/sections/reviews";
import { FinalCta } from "@/components/sections/final-cta";

export async function generateMetadata(
  props: PageProps<"/[locale]/patient-stories">
): Promise<Metadata> {
  const { locale } = await props.params;
  const t = await getTranslations({ locale, namespace: "patientStoriesPage" });
  return { title: t("hero.headingPrefix") + " " + t("hero.headingHighlight") };
}

export default async function PatientStoriesPage() {
  const t = await getTranslations("patientStoriesPage");

  return (
    <>
      <Header />
      <main className="flex-1">
        <PageHero
          sectionId="patient-stories-hero"
          eyebrow={t("hero.eyebrow")}
          headingPrefix={t("hero.headingPrefix")}
          headingHighlight={t("hero.headingHighlight")}
          paragraph={t("hero.paragraph")}
          primaryCta={{ label: t("intro.heading"), href: "#patient-stories", icon: <Heart className="h-4 w-4" /> }}
          showPhoneCard={false}
          compact
        />
        <PatientStoryGrid />
        <Reviews
          sectionId="patient-reviews"
          eyebrow={t("reviewsIntro.eyebrow")}
          heading={t("reviewsIntro.heading")}
        />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
