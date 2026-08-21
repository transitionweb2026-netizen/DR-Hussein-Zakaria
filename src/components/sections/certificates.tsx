"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Expand } from "lucide-react";
import { Eyebrow } from "@/components/ui/eyebrow";
import { GlassCard } from "@/components/ui/glass-card";
import { Modal } from "@/components/ui/modal";
import { Reveal } from "@/components/ui/reveal";
import { GlowOrb } from "@/components/decorative/glow-orb";

type CertItem = {
  title: string;
  issuer: string;
  year: string;
};

export function Certificates() {
  const t = useTranslations("certificates");
  const items = t.raw("items") as CertItem[];
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const active = openIndex !== null ? items[openIndex] : null;

  return (
    <section id="certificates" className="relative overflow-hidden py-20 sm:py-28">
      <GlowOrb className="bottom-0 -end-20 h-72 w-72" />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal className="mx-auto mb-12 max-w-2xl text-center">
          <Eyebrow align="center" className="mb-4">
            {t("eyebrow")}
          </Eyebrow>
          <h2 className="text-balance text-3xl font-extrabold tracking-tight text-ink-900 sm:text-4xl">
            {t("heading")}
          </h2>
        </Reveal>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item, i) => (
            <Reveal key={item.title} delay={i * 90}>
              <GlassCard hover className="group h-full p-2.5">
                <button
                  type="button"
                  onClick={() => setOpenIndex(i)}
                  className="relative block aspect-[7/5] w-full overflow-hidden rounded-[calc(var(--radius-card)-0.625rem)]"
                  aria-label={item.title}
                >
                  <Image
                    src={`/images/certificate-${i + 1}.jpg`}
                    alt={item.title}
                    fill
                    sizes="(min-width: 1024px) 320px, 90vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-navy-950/0 transition-colors duration-300 group-hover:bg-navy-950/20">
                    <span className="flex h-10 w-10 scale-90 items-center justify-center rounded-full bg-white/90 text-brand-600 opacity-0 shadow-glass-sm transition-all duration-300 group-hover:scale-100 group-hover:opacity-100">
                      <Expand className="h-4.5 w-4.5" />
                    </span>
                  </div>
                </button>
                <div className="px-2 pb-1 pt-3">
                  <h3 className="text-sm font-bold text-ink-900">{item.title}</h3>
                  <p className="mt-1 text-xs text-ink-400">
                    {item.issuer} · {item.year}
                  </p>
                </div>
              </GlassCard>
            </Reveal>
          ))}
        </div>
      </div>

      <Modal open={active !== null} onClose={() => setOpenIndex(null)} className="max-w-2xl p-3">
        {active && (
          <>
            <div className="relative aspect-[7/5] w-full overflow-hidden rounded-[calc(var(--radius-card)-0.625rem)]">
              <Image
                src={`/images/certificate-${openIndex! + 1}.jpg`}
                alt={active.title}
                fill
                sizes="700px"
                className="object-cover"
              />
            </div>
            <div className="px-2 pb-1 pt-4">
              <h3 className="text-base font-bold text-ink-900">{active.title}</h3>
              <p className="mt-1 text-sm text-ink-400">
                {active.issuer} · {active.year}
              </p>
            </div>
          </>
        )}
      </Modal>
    </section>
  );
}
