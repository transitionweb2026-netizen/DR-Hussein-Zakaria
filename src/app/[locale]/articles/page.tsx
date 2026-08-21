import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { BookOpen } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { PageHero } from "@/components/sections/page-hero";
import { ArticlesSection } from "@/components/sections/articles-section";

export async function generateMetadata(
  props: PageProps<"/[locale]/articles">
): Promise<Metadata> {
  const { locale } = await props.params;
  const t = await getTranslations({ locale, namespace: "articlesPage" });
  return { title: t("hero.headingPrefix") + " " + t("hero.headingHighlight") };
}

export default async function ArticlesPage() {
  const t = await getTranslations("articlesPage");

  return (
    <>
      <Header />
      <main className="flex-1">
        <PageHero
          sectionId="articles-hero"
          eyebrow={t("hero.eyebrow")}
          headingPrefix={t("hero.headingPrefix")}
          headingHighlight={t("hero.headingHighlight")}
          paragraph={t("hero.paragraph")}
          primaryCta={{ label: t("readMore"), href: "#articles", icon: <BookOpen className="h-4 w-4" /> }}
          showPhoneCard={false}
          compact
        />
        <ArticlesSection />
      </main>
      <Footer />
    </>
  );
}
