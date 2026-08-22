import { getLocale, getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { BookOpen } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { PageHero } from "@/components/sections/page-hero";
import { ArticlesSection } from "@/components/sections/articles-section";
import { getArticlesPageContent } from "@/lib/data/articles";
import { getPageSeo } from "@/lib/data/global-settings";
import { pickLocale } from "@/lib/i18n-content";

export async function generateMetadata(
  props: PageProps<"/[locale]/articles">
): Promise<Metadata> {
  const { locale } = await props.params;
  const seo = await getPageSeo("articles");
  const seoTitle = pickLocale(seo?.seo_title, locale);
  if (seoTitle) return { title: seoTitle, description: pickLocale(seo?.meta_description, locale) || undefined };

  const t = await getTranslations({ locale, namespace: "articlesPage" });
  return { title: t("hero.headingPrefix") + " " + t("hero.headingHighlight") };
}

export default async function ArticlesPage() {
  const locale = await getLocale();
  const content = await getArticlesPageContent();

  return (
    <>
      <Header />
      <main className="flex-1">
        <PageHero
          sectionId="articles-hero"
          eyebrow={pickLocale(content?.hero_eyebrow, locale)}
          headingPrefix={pickLocale(content?.hero_heading_prefix, locale)}
          headingHighlight={pickLocale(content?.hero_heading_highlight, locale)}
          paragraph={pickLocale(content?.hero_paragraph, locale)}
          primaryCta={{ label: pickLocale(content?.read_more_label, locale), href: "#articles", icon: <BookOpen className="h-4 w-4" /> }}
          showPhoneCard={false}
          compact
        />
        <ArticlesSection />
      </main>
      <Footer />
    </>
  );
}
