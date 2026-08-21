import Image from "next/image";
import { useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";
import { Eyebrow } from "@/components/ui/eyebrow";
import { GlassCard } from "@/components/ui/glass-card";
import { Reveal } from "@/components/ui/reveal";
import { GlowOrb } from "@/components/decorative/glow-orb";

type ServiceItem = {
  id: string;
  title: string;
  description: string;
};

type CategoryMeta = {
  id: string;
  image: string;
};

export function ServicesOverview() {
  const t = useTranslations("servicesPage");
  const ts = useTranslations("services");
  const items = ts.raw("items") as ServiceItem[];
  const categories = t.raw("categories") as CategoryMeta[];

  return (
    <section id="services-overview" className="relative overflow-hidden py-20 sm:py-28">
      <GlowOrb className="top-10 -end-16 h-72 w-72" />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal className="mx-auto mb-12 max-w-2xl text-center">
          <Eyebrow align="center" className="mb-4">
            {t("intro.eyebrow")}
          </Eyebrow>
          <h2 className="text-balance text-3xl font-extrabold tracking-tight text-ink-900 sm:text-4xl">
            {t("intro.heading")}
          </h2>
          <p className="mt-4 text-[0.98rem] leading-relaxed text-ink-600">{t("intro.paragraph")}</p>
        </Reveal>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item, i) => {
            const category = categories.find((c) => c.id === item.id) ?? categories[i];
            return (
              <Reveal key={item.id} delay={i * 90}>
                <a href={`#surgeries-${item.id}`} className="group block h-full">
                  <GlassCard hover className="flex h-full flex-col overflow-hidden p-2.5">
                    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[calc(var(--radius-card)-0.625rem)]">
                      <Image
                        src={`/images/${category.image}`}
                        alt={item.title}
                        fill
                        sizes="(min-width: 1024px) 320px, 90vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="flex flex-1 flex-col px-2 pb-1 pt-4">
                      <h3 className="text-base font-bold text-ink-900">{item.title}</h3>
                      <p className="mt-1.5 flex-1 text-sm leading-relaxed text-ink-600">{item.description}</p>
                      <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600">
                        {t("viewProcedures")}
                        <ArrowRight className="h-4 w-4 transition-transform duration-300 rtl:-scale-x-100 group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
                      </span>
                    </div>
                  </GlassCard>
                </a>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
