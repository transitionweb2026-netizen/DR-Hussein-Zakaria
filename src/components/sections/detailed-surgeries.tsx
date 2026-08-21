"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Eyebrow } from "@/components/ui/eyebrow";
import { GlassCard } from "@/components/ui/glass-card";
import { Modal } from "@/components/ui/modal";
import { Reveal } from "@/components/ui/reveal";
import { GlowOrb } from "@/components/decorative/glow-orb";

type Surgery = {
  id: string;
  title: string;
  short: string;
  description: string;
  image: string;
};

type ServiceItem = {
  id: string;
  title: string;
};

export function DetailedSurgeries() {
  const t = useTranslations("servicesPage");
  const ts = useTranslations("services");
  const categories = ts.raw("items") as ServiceItem[];
  const surgeriesByCategory = t.raw("surgeries") as Record<string, Surgery[]>;
  const [active, setActive] = useState<Surgery | null>(null);

  return (
    <section className="relative overflow-hidden py-20 sm:py-28">
      <GlowOrb className="-bottom-10 -start-24 h-80 w-80" />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal className="mx-auto mb-16 max-w-2xl text-center">
          <Eyebrow align="center" className="mb-4">
            {t("detailedHeading")}
          </Eyebrow>
        </Reveal>

        <div className="space-y-20">
          {categories.map((category) => {
            const surgeries = surgeriesByCategory[category.id] ?? [];
            return (
              <div key={category.id} id={`surgeries-${category.id}`} className="scroll-mt-28">
                <Reveal>
                  <h3 className="text-balance text-2xl font-extrabold tracking-tight text-ink-900 sm:text-3xl">
                    {category.title}
                  </h3>
                </Reveal>
                <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {surgeries.map((surgery, i) => (
                    <Reveal key={surgery.id} delay={i * 90}>
                      <GlassCard hover className="group h-full overflow-hidden p-2.5">
                        <button type="button" onClick={() => setActive(surgery)} className="block w-full text-start">
                          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[calc(var(--radius-card)-0.625rem)]">
                            <Image
                              src={`/images/${surgery.image}`}
                              alt={surgery.title}
                              fill
                              sizes="(min-width: 1024px) 320px, 90vw"
                              className="object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                          </div>
                          <div className="px-2 pb-1 pt-4">
                            <h4 className="text-sm font-bold text-ink-900">{surgery.title}</h4>
                            <p className="mt-1.5 text-xs leading-relaxed text-ink-600">{surgery.short}</p>
                          </div>
                        </button>
                      </GlassCard>
                    </Reveal>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <Modal open={active !== null} onClose={() => setActive(null)} className="max-w-2xl">
        {active && (
          <>
            <div className="relative aspect-video w-full overflow-hidden rounded-t-card">
              <Image src={`/images/${active.image}`} alt={active.title} fill sizes="700px" className="object-cover" />
            </div>
            <div className="p-6 sm:p-8">
              <h3 className="text-xl font-extrabold text-ink-900 sm:text-2xl">{active.title}</h3>
              <p className="mt-4 text-[0.98rem] leading-relaxed text-ink-600">{active.description}</p>
            </div>
          </>
        )}
      </Modal>
    </section>
  );
}
