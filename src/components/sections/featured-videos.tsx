"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Play } from "lucide-react";
import { Eyebrow } from "@/components/ui/eyebrow";
import { GlassCard } from "@/components/ui/glass-card";
import { Modal } from "@/components/ui/modal";
import { Reveal } from "@/components/ui/reveal";
import { GlowOrb } from "@/components/decorative/glow-orb";

type VideoItem = {
  title: string;
  description: string;
  duration: string;
};

export function FeaturedVideos() {
  const t = useTranslations("videosPage");
  const tv = useTranslations("videos");
  const items = tv.raw("items") as VideoItem[];
  const [active, setActive] = useState<number | null>(null);
  const activeItem = active !== null ? items[active] : null;

  return (
    <section id="featured-videos" className="relative overflow-hidden py-20 sm:py-28">
      <GlowOrb className="top-10 -end-16 h-72 w-72" />
      <GlowOrb className="-bottom-16 -start-16 h-72 w-72" />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal className="mx-auto mb-14 max-w-2xl text-center">
          <Eyebrow align="center" className="mb-4">
            {t("intro.eyebrow")}
          </Eyebrow>
          <h2 className="text-balance text-3xl font-extrabold tracking-tight text-ink-900 sm:text-4xl">
            {t("intro.heading")}
          </h2>
          <p className="mt-4 text-[0.98rem] leading-relaxed text-ink-600">{t("intro.description")}</p>
        </Reveal>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, i) => (
            <Reveal key={item.title} delay={i * 90}>
              <GlassCard hover className="group h-full p-2.5">
                <button type="button" onClick={() => setActive(i)} className="block w-full text-start">
                  <div className="relative aspect-video w-full overflow-hidden rounded-[calc(var(--radius-card)-0.625rem)]">
                    <Image
                      src={`/images/video-${i + 1}.jpg`}
                      alt={item.title}
                      fill
                      sizes="(min-width: 1024px) 400px, 90vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-navy-950/20 transition-colors duration-300 group-hover:bg-navy-950/35">
                      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-brand-600 shadow-glass-sm transition-transform duration-300 group-hover:scale-110">
                        <Play className="h-5 w-5 fill-current ps-0.5" />
                      </span>
                    </div>
                    <span className="absolute bottom-2.5 end-2.5 rounded-md bg-navy-950/80 px-2 py-0.5 text-xs font-semibold text-white backdrop-blur">
                      {item.duration}
                    </span>
                  </div>
                  <div className="px-1.5 pb-1 pt-4">
                    <h3 className="text-sm font-bold text-ink-900">{item.title}</h3>
                    <p className="mt-1 text-xs text-ink-400">{item.description}</p>
                  </div>
                </button>
              </GlassCard>
            </Reveal>
          ))}
        </div>
      </div>

      <Modal open={activeItem !== null} onClose={() => setActive(null)} className="max-w-3xl p-3">
        {activeItem && active !== null && (
          <>
            <div className="relative aspect-video w-full overflow-hidden rounded-[calc(var(--radius-card)-0.625rem)]">
              <Image
                src={`/images/video-${active + 1}.jpg`}
                alt={activeItem.title}
                fill
                sizes="820px"
                className="object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-navy-950/25">
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white/90 text-brand-600 shadow-glass-lg">
                  <Play className="h-6 w-6 fill-current ps-1" />
                </span>
              </div>
              <span className="absolute bottom-4 end-4 rounded-md bg-navy-950/80 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur">
                {activeItem.duration}
              </span>
            </div>
            <div className="p-5 sm:p-6">
              <h3 className="text-lg font-extrabold text-ink-900 sm:text-xl">{activeItem.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-600">{activeItem.description}</p>
            </div>
          </>
        )}
      </Modal>
    </section>
  );
}
