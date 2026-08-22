import { getLocale } from "next-intl/server";
import { Eyebrow } from "@/components/ui/eyebrow";
import { GlassCard } from "@/components/ui/glass-card";
import { IconTile } from "@/components/ui/icon-tile";
import { Counter } from "@/components/ui/counter";
import { Carousel } from "@/components/ui/carousel";
import { Reveal } from "@/components/ui/reveal";
import { GlowOrb } from "@/components/decorative/glow-orb";
import { getHomeStatsSection, getPublishedHomeStats } from "@/lib/data/home";
import { pickLocale } from "@/lib/i18n-content";
import { getIcon } from "@/lib/icon-map";

export async function StatsSlider() {
  const locale = await getLocale();
  const [section, stats] = await Promise.all([getHomeStatsSection(), getPublishedHomeStats()]);

  const slides = stats.map((item) => {
    const Icon = getIcon(item.icon);
    return (
      <GlassCard key={item.id} hover className="flex w-[220px] flex-col items-center gap-4 p-7 text-center sm:w-[240px]">
        <IconTile icon={Icon} />
        <Counter
          value={item.value}
          suffix={item.suffix}
          className="text-3xl font-extrabold text-ink-900 sm:text-4xl"
        />
        <p className="text-sm leading-snug text-ink-600">{pickLocale(item.label, locale)}</p>
      </GlassCard>
    );
  });

  return (
    <section id="stats" className="relative overflow-hidden py-20 sm:py-28">
      <GlowOrb className="top-1/3 -end-24 h-72 w-72" />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal className="mx-auto mb-12 max-w-2xl text-center">
          <Eyebrow align="center" className="mb-4">
            {pickLocale(section?.eyebrow, locale)}
          </Eyebrow>
          <h2 className="text-balance text-3xl font-extrabold tracking-tight text-ink-900 sm:text-4xl">
            {pickLocale(section?.heading, locale)}
          </h2>
          {pickLocale(section?.description, locale) && (
            <p className="mt-4 text-[0.98rem] leading-relaxed text-ink-600">{pickLocale(section?.description, locale)}</p>
          )}
        </Reveal>

        <Reveal delay={120}>
          <Carousel slides={slides} className="mx-auto" showDots />
        </Reveal>
      </div>
    </section>
  );
}
