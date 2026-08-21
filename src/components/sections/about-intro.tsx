import Image from "next/image";
import { useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";
import { Eyebrow } from "@/components/ui/eyebrow";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { GlowOrb } from "@/components/decorative/glow-orb";

export function AboutIntro() {
  const t = useTranslations("aboutIntro");

  return (
    <section id="about" className="relative overflow-hidden py-20 sm:py-28">
      <GlowOrb className="top-10 -start-24 h-80 w-80" />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2 lg:gap-14">
          <Reveal>
            <Eyebrow className="mb-4">{t("eyebrow")}</Eyebrow>
            <h2 className="text-balance text-3xl font-extrabold leading-[1.15] tracking-tight text-ink-900 sm:text-4xl">
              {t("headingPrefix")} <span className="text-brand-500">{t("headingHighlight")}</span>
            </h2>
            <p className="mt-5 max-w-xl text-[0.98rem] leading-relaxed text-ink-600">{t("paragraph1")}</p>
            <p className="mt-4 max-w-xl text-[0.98rem] leading-relaxed text-ink-600">{t("paragraph2")}</p>
            <Button href="#specialties" className="mt-8" icon={<ArrowRight className="h-4 w-4" />}>
              {t("cta")}
            </Button>
          </Reveal>

          <Reveal delay={120} className="order-first lg:order-last">
            <div className="relative mx-auto aspect-[4/5] w-full max-w-sm">
              <div
                aria-hidden
                className="absolute inset-0 rounded-card border-2 border-line bg-glass shadow-glass"
                style={{ transform: "rotate(-7deg)" }}
              />
              <div
                aria-hidden
                className="absolute inset-0 rounded-card border-2 border-white/40 bg-gradient-to-br from-brand-300/50 to-brand-500/40 shadow-glass"
                style={{ transform: "rotate(4deg)" }}
              />
              <GlassCard hover className="relative h-full p-2.5">
                <div className="relative h-full w-full overflow-hidden rounded-[calc(var(--radius-card)-0.625rem)]">
                  <Image
                    src="/images/doctor-portrait.jpg"
                    alt={t("doctorName")}
                    fill
                    sizes="(min-width: 1024px) 420px, 90vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy-950/85 via-navy-950/10 to-transparent p-5 pt-14">
                    <p className="text-sm font-extrabold text-white">{t("doctorName")}</p>
                    <p className="mt-0.5 text-xs font-medium text-white/70">{t("doctorTitle")}</p>
                  </div>
                </div>
              </GlassCard>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
