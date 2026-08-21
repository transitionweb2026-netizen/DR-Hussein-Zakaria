import Image from "next/image";
import { useTranslations } from "next-intl";
import { Award } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { Eyebrow } from "@/components/ui/eyebrow";
import { IconTile } from "@/components/ui/icon-tile";
import { GlowOrb } from "@/components/decorative/glow-orb";
import { getIcon } from "@/lib/icon-map";

type Feature = {
  icon: string;
  title: string;
  description: string;
};

export function WhyChoose() {
  const t = useTranslations("whyChoose");
  const features = t.raw("features") as Feature[];

  return (
    <section id="about" className="relative overflow-hidden py-20 sm:py-28">
      <GlowOrb className="top-0 -end-24 h-80 w-80" />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <GlassCard className="overflow-hidden p-5 sm:p-8 lg:p-10">
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-14">
            <div className="relative mx-auto w-full max-w-sm">
              <GlassCard hover className="p-2.5" sheen={false}>
                <div className="relative overflow-hidden rounded-[calc(var(--radius-card)-0.625rem)]">
                  <Image
                    src="/images/doctor-portrait.jpg"
                    alt={t("doctorName")}
                    width={900}
                    height={1100}
                    className="aspect-[4/5] w-full object-cover"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy-950/90 via-navy-950/20 to-transparent p-6 pt-16">
                    <p className="font-signature text-3xl leading-none text-white">{t("doctorName")}</p>
                    <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-white/70">
                      {t("doctorTitle")}
                    </p>
                  </div>
                </div>
              </GlassCard>
              <span className="absolute -bottom-4 -end-4 flex h-16 w-16 items-center justify-center rounded-full border border-line bg-white/80 shadow-glass-lg backdrop-blur-xl">
                <Award className="h-7 w-7 text-brand-500" strokeWidth={1.7} />
              </span>
            </div>

            <div>
              <Eyebrow className="mb-4">{t("eyebrow")}</Eyebrow>
              <h2 className="text-balance text-3xl font-extrabold leading-[1.15] tracking-tight text-ink-900 sm:text-4xl">
                {t("headingPrefix")}{" "}
                <span className="text-brand-500">{t("headingHighlight")}</span>
              </h2>
              <p className="mt-4 max-w-xl text-[0.98rem] leading-relaxed text-ink-600">
                {t("paragraph")}
              </p>

              <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
                {features.map((feature) => (
                  <div key={feature.title} className="flex items-start gap-3.5">
                    <IconTile icon={getIcon(feature.icon)} size="sm" />
                    <div>
                      <h3 className="text-sm font-bold text-ink-900">{feature.title}</h3>
                      <p className="mt-1 text-[0.85rem] leading-relaxed text-ink-600">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </GlassCard>
      </div>
    </section>
  );
}
