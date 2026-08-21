import { useTranslations } from "next-intl";
import { Award, HeartPulse, Users, Clock, Activity } from "lucide-react";
import { Eyebrow } from "@/components/ui/eyebrow";
import { GlassCard } from "@/components/ui/glass-card";
import { IconTile } from "@/components/ui/icon-tile";
import { Counter } from "@/components/ui/counter";
import { Carousel } from "@/components/ui/carousel";
import { Reveal } from "@/components/ui/reveal";
import { GlowOrb } from "@/components/decorative/glow-orb";

type StatItem = {
  value: number;
  suffix: string;
  label: string;
};

const icons = [Users, Activity, HeartPulse, Clock, Award];

export function StatsSlider() {
  const t = useTranslations("stats");
  const items = t.raw("items") as StatItem[];

  const slides = items.map((item, i) => {
    const Icon = icons[i % icons.length];
    return (
      <GlassCard key={item.label} hover className="flex w-[220px] flex-col items-center gap-4 p-7 text-center sm:w-[240px]">
        <IconTile icon={Icon} />
        <Counter
          value={item.value}
          suffix={item.suffix}
          className="text-3xl font-extrabold text-ink-900 sm:text-4xl"
        />
        <p className="text-sm leading-snug text-ink-600">{item.label}</p>
      </GlassCard>
    );
  });

  return (
    <section id="stats" className="relative overflow-hidden py-20 sm:py-28">
      <GlowOrb className="top-1/3 -end-24 h-72 w-72" />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal className="mx-auto mb-12 max-w-2xl text-center">
          <Eyebrow align="center" className="mb-4">
            {t("eyebrow")}
          </Eyebrow>
          <h2 className="text-balance text-3xl font-extrabold tracking-tight text-ink-900 sm:text-4xl">
            {t("heading")}
          </h2>
        </Reveal>

        <Reveal delay={120}>
          <Carousel slides={slides} className="mx-auto" showDots />
        </Reveal>
      </div>
    </section>
  );
}
