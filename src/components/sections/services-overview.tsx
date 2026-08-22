import Image from "next/image";
import { getLocale } from "next-intl/server";
import { ArrowRight } from "lucide-react";
import { Eyebrow } from "@/components/ui/eyebrow";
import { GlassCard } from "@/components/ui/glass-card";
import { Reveal } from "@/components/ui/reveal";
import { GlowOrb } from "@/components/decorative/glow-orb";
import { getServicesPageContent } from "@/lib/data/services";
import { getPublishedServiceCategories } from "@/lib/data/shared-content";
import { pickLocale } from "@/lib/i18n-content";

export async function ServicesOverview() {
  const locale = await getLocale();
  const [content, categories] = await Promise.all([getServicesPageContent(), getPublishedServiceCategories()]);

  return (
    <section id="services-overview" className="relative overflow-hidden py-20 sm:py-28">
      <GlowOrb className="top-10 -end-16 h-72 w-72" />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal className="mx-auto mb-12 max-w-2xl text-center">
          <Eyebrow align="center" className="mb-4">
            {pickLocale(content?.intro_eyebrow, locale)}
          </Eyebrow>
          <h2 className="text-balance text-3xl font-extrabold tracking-tight text-ink-900 sm:text-4xl">
            {pickLocale(content?.intro_heading, locale)}
          </h2>
          <p className="mt-4 text-[0.98rem] leading-relaxed text-ink-600">{pickLocale(content?.intro_paragraph, locale)}</p>
        </Reveal>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category, i) => (
            <Reveal key={category.id} delay={i * 90}>
              <a href={`#surgeries-${category.slug}`} className="group block h-full">
                <GlassCard hover className="flex h-full flex-col overflow-hidden p-2.5">
                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[calc(var(--radius-card)-0.625rem)]">
                    <Image
                      src={category.image_url || "/images/service-category-1.jpg"}
                      alt={pickLocale(category.title, locale)}
                      fill
                      sizes="(min-width: 1024px) 320px, 90vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="flex flex-1 flex-col px-2 pb-1 pt-4">
                    <h3 className="text-base font-bold text-ink-900">{pickLocale(category.title, locale)}</h3>
                    <p className="mt-1.5 flex-1 text-sm leading-relaxed text-ink-600">{pickLocale(category.description, locale)}</p>
                    <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600">
                      {pickLocale(content?.view_procedures_label, locale)}
                      <ArrowRight className="h-4 w-4 transition-transform duration-300 rtl:-scale-x-100 group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
                    </span>
                  </div>
                </GlassCard>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
