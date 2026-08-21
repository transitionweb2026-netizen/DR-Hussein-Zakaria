import Image from "next/image";
import { useTranslations } from "next-intl";
import { Play } from "lucide-react";
import { Eyebrow } from "@/components/ui/eyebrow";
import { GlassCard } from "@/components/ui/glass-card";
import { Reveal } from "@/components/ui/reveal";
import { GlowOrb } from "@/components/decorative/glow-orb";

export function VideoIntro() {
  const t = useTranslations("videoIntro");

  return (
    <section id="video" className="relative overflow-hidden py-20 sm:py-28">
      <GlowOrb className="-bottom-10 -end-24 h-80 w-80" />
      <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
        <Reveal className="mx-auto mb-12 max-w-2xl text-center">
          <Eyebrow align="center" className="mb-4">
            {t("eyebrow")}
          </Eyebrow>
          <h2 className="text-balance text-3xl font-extrabold tracking-tight text-ink-900 sm:text-4xl">
            {t("heading")}
          </h2>
          <p className="mt-4 text-[0.98rem] leading-relaxed text-ink-600">{t("description")}</p>
        </Reveal>

        <Reveal delay={120}>
          <GlassCard hover className="group p-2.5 sm:p-3">
            <div className="relative aspect-video w-full overflow-hidden rounded-[calc(var(--radius-card)-0.625rem)]">
              <Image
                src="/images/video-intro.jpg"
                alt={t("heading")}
                fill
                sizes="(min-width: 1024px) 1000px, 100vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-navy-950/25 transition-colors duration-300 group-hover:bg-navy-950/35">
                <button
                  type="button"
                  aria-label={t("heading")}
                  className="flex h-18 w-18 items-center justify-center rounded-full bg-white/90 text-brand-600 shadow-glass-lg backdrop-blur-xl transition-transform duration-300 group-hover:scale-110"
                >
                  <Play className="h-7 w-7 fill-current ps-1" />
                </button>
              </div>
              <span className="absolute bottom-4 end-4 rounded-md bg-navy-950/80 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur">
                {t("duration")}
              </span>
            </div>
          </GlassCard>
        </Reveal>
      </div>
    </section>
  );
}
