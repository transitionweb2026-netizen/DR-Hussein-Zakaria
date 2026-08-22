"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowRight, Calendar, Tag } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { Modal } from "@/components/ui/modal";
import { Reveal } from "@/components/ui/reveal";
import { GlowOrb } from "@/components/decorative/glow-orb";

type Article = {
  id: string;
  category: string;
  date: string;
  title: string;
  excerpt: string;
  image: string | null;
  content: string;
};

function ArticleBody({ content }: { content: string }) {
  const paragraphs = content.split("\n\n").filter(Boolean);
  return (
    <div className="space-y-4">
      {paragraphs.map((p, i) => (
        <p key={i} className="text-[0.98rem] leading-relaxed text-ink-600">
          {p}
        </p>
      ))}
    </div>
  );
}

export function ArticlesSectionList({
  featured,
  items,
  readMoreLabel,
  locale,
}: {
  featured: Article | null;
  items: Article[];
  readMoreLabel: string;
  locale: string;
}) {
  const [active, setActive] = useState<Article | null>(null);

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString(locale === "ar" ? "ar-EG" : "en-US", { year: "numeric", month: "long", day: "numeric" });

  return (
    <section id="articles" className="relative overflow-hidden py-20 sm:py-28">
      <GlowOrb className="top-10 -end-16 h-72 w-72" />
      <GlowOrb className="-bottom-16 -start-16 h-72 w-72" />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        {featured && (
          <Reveal>
            <GlassCard hover className="group grid grid-cols-1 items-center gap-0 overflow-hidden p-2.5 lg:grid-cols-2 lg:gap-6">
              <button
                type="button"
                onClick={() => setActive(featured)}
                className="relative aspect-[16/10] w-full overflow-hidden rounded-[calc(var(--radius-card)-0.625rem)] lg:aspect-auto lg:h-full"
              >
                <Image
                  src={featured.image || "/images/article-1.jpg"}
                  alt={featured.title}
                  fill
                  sizes="(min-width: 1024px) 600px, 90vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </button>
              <div className="flex flex-col px-3 py-6 sm:px-5 lg:py-8 lg:pe-8">
                <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-brand-600">
                  <span className="inline-flex items-center gap-1.5">
                    <Tag className="h-3.5 w-3.5" />
                    {featured.category}
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-ink-400">
                    <Calendar className="h-3.5 w-3.5" />
                    {formatDate(featured.date)}
                  </span>
                </div>
                <h2 className="mt-3 text-balance text-2xl font-extrabold tracking-tight text-ink-900 sm:text-3xl">{featured.title}</h2>
                <p className="mt-3 text-[0.98rem] leading-relaxed text-ink-600">{featured.excerpt}</p>
                <button
                  type="button"
                  onClick={() => setActive(featured)}
                  className="mt-6 inline-flex w-fit items-center gap-1.5 text-sm font-semibold text-brand-600"
                >
                  {readMoreLabel}
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 rtl:-scale-x-100 group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
                </button>
              </div>
            </GlassCard>
          </Reveal>
        )}

        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((article, i) => (
            <Reveal key={article.id} delay={i * 90}>
              <GlassCard hover className="group h-full overflow-hidden p-2.5">
                <button type="button" onClick={() => setActive(article)} className="block w-full text-start">
                  <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[calc(var(--radius-card)-0.625rem)]">
                    <Image
                      src={article.image || "/images/article-1.jpg"}
                      alt={article.title}
                      fill
                      sizes="(min-width: 1024px) 400px, 90vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="px-1.5 pb-1 pt-4">
                    <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-brand-600">
                      <span>{article.category}</span>
                      <span className="text-ink-400">{formatDate(article.date)}</span>
                    </div>
                    <h3 className="mt-2 text-sm font-bold leading-snug text-ink-900">{article.title}</h3>
                    <p className="mt-1.5 text-xs leading-relaxed text-ink-400">{article.excerpt}</p>
                  </div>
                </button>
              </GlassCard>
            </Reveal>
          ))}
        </div>
        {!featured && items.length === 0 && <p className="text-sm text-ink-400">No articles published yet.</p>}
      </div>

      <Modal open={active !== null} onClose={() => setActive(null)} className="max-w-2xl">
        {active && (
          <>
            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-t-card">
              <Image src={active.image || "/images/article-1.jpg"} alt={active.title} fill sizes="700px" className="object-cover" />
            </div>
            <div className="p-6 sm:p-8">
              <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-brand-600">
                <span className="inline-flex items-center gap-1.5">
                  <Tag className="h-3.5 w-3.5" />
                  {active.category}
                </span>
                <span className="inline-flex items-center gap-1.5 text-ink-400">
                  <Calendar className="h-3.5 w-3.5" />
                  {formatDate(active.date)}
                </span>
              </div>
              <h3 className="mt-3 text-xl font-extrabold text-ink-900 sm:text-2xl">{active.title}</h3>
              <div className="mt-5">
                <ArticleBody content={active.content} />
              </div>
            </div>
          </>
        )}
      </Modal>
    </section>
  );
}
