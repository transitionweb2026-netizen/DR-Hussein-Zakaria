import Image from "next/image";
import { useTranslations } from "next-intl";
import { Quote } from "lucide-react";
import { Eyebrow } from "@/components/ui/eyebrow";
import { GlassCard } from "@/components/ui/glass-card";
import { Reveal } from "@/components/ui/reveal";
import { GlowOrb } from "@/components/decorative/glow-orb";

export function DoctorMessage() {
  const t = useTranslations("doctorMessage");

  return (
    <section className="relative overflow-hidden py-20 sm:py-28">
      <GlowOrb className="bottom-0 -start-24 h-80 w-80" />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          <Reveal>
            <Eyebrow className="mb-4">{t("eyebrow")}</Eyebrow>
            <h2 className="text-balance text-3xl font-extrabold leading-[1.15] tracking-tight text-ink-900 sm:text-4xl">
              {t("headingPrefix")} <span className="text-brand-500">{t("headingHighlight")}</span>
            </h2>

            <div className="relative mt-7">
              <Quote className="h-9 w-9 text-brand-300" fill="currentColor" strokeWidth={0} />
              <p className="mt-3 max-w-xl text-[1.05rem] italic leading-relaxed text-ink-700">
                &ldquo;{t("quote")}&rdquo;
              </p>
            </div>

            <div className="mt-7">
              <p className="font-signature text-3xl leading-none text-brand-600">{t("signatureName")}</p>
              <p className="mt-1.5 text-xs font-semibold uppercase tracking-wider text-ink-400">
                {t("signatureTitle")}
              </p>
            </div>
          </Reveal>

          <Reveal delay={120} className="order-first lg:order-last">
            <GlassCard hover className="mx-auto max-w-sm p-2.5">
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[calc(var(--radius-card)-0.625rem)]">
                <Image
                  src="/images/doctor-portrait-secondary.jpg"
                  alt={t("signatureName")}
                  fill
                  sizes="(min-width: 1024px) 400px, 90vw"
                  className="object-cover"
                />
              </div>
            </GlassCard>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
