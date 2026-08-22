import { getLocale } from "next-intl/server";
import { ArrowRight } from "lucide-react";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Button } from "@/components/ui/button";
import { Accordion } from "@/components/ui/accordion";
import { Reveal } from "@/components/ui/reveal";
import { GlowOrb } from "@/components/decorative/glow-orb";
import { getHomeArticlesSection, getHomeFaqSection, getPublishedFaqs } from "@/lib/data/home";
import { getPublishedArticles } from "@/lib/data/articles";
import { pickLocale } from "@/lib/i18n-content";
import { HomeArticleCards } from "./home-article-cards";

export async function HomeArticlesFaq() {
  const locale = await getLocale();
  const [articlesSection, articles, faqSection, faqs] = await Promise.all([
    getHomeArticlesSection(),
    getPublishedArticles(),
    getHomeFaqSection(),
    getPublishedFaqs(),
  ]);

  const articleItems = articles.slice(0, 3).map((a) => ({
    id: a.id,
    title: pickLocale(a.title, locale),
    excerpt: pickLocale(a.excerpt, locale),
    image: a.image_url,
  }));

  const faqItems = faqs.map((f) => ({
    question: pickLocale(f.question, locale),
    answer: pickLocale(f.answer, locale),
  }));

  return (
    <section id="articles-faq" className="relative overflow-hidden py-20 sm:py-28">
      <GlowOrb className="top-1/4 -start-24 h-72 w-72" />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-2 lg:gap-12">
          <div>
            <Reveal>
              <Eyebrow className="mb-4">{pickLocale(articlesSection?.eyebrow, locale)}</Eyebrow>
              <h2 className="text-balance text-3xl font-extrabold tracking-tight text-ink-900 sm:text-4xl">
                {pickLocale(articlesSection?.heading, locale)}
              </h2>
              {pickLocale(articlesSection?.description, locale) && (
                <p className="mt-4 text-[0.98rem] leading-relaxed text-ink-600">
                  {pickLocale(articlesSection?.description, locale)}
                </p>
              )}
            </Reveal>

            <HomeArticleCards items={articleItems} />

            <Reveal delay={280} className="mt-8">
              <Button href="/articles" size="lg" icon={<ArrowRight className="h-4.5 w-4.5" />}>
                {pickLocale(articlesSection?.view_all_label, locale)}
              </Button>
            </Reveal>
          </div>

          <div>
            <Reveal delay={90}>
              <Eyebrow className="mb-4">{pickLocale(faqSection?.eyebrow, locale)}</Eyebrow>
              <h2 className="text-balance text-3xl font-extrabold tracking-tight text-ink-900 sm:text-4xl">
                {pickLocale(faqSection?.heading, locale)}
              </h2>
              {pickLocale(faqSection?.description, locale) && (
                <p className="mt-4 text-[0.98rem] leading-relaxed text-ink-600">
                  {pickLocale(faqSection?.description, locale)}
                </p>
              )}
            </Reveal>
            <Reveal delay={180}>
              <Accordion items={faqItems} columns={1} className="mt-8" />
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
