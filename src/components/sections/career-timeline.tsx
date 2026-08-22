import { getLocale } from "next-intl/server";
import { Eyebrow } from "@/components/ui/eyebrow";
import { GlowOrb } from "@/components/decorative/glow-orb";
import { getHomeTimelineSection } from "@/lib/data/home";
import { getPublishedCareerTimeline } from "@/lib/data/shared-content";
import { pickLocale } from "@/lib/i18n-content";
import { CareerTimelineList } from "./career-timeline-list";

export async function CareerTimeline() {
  const locale = await getLocale();
  const [section, items] = await Promise.all([getHomeTimelineSection(), getPublishedCareerTimeline()]);

  const resolvedItems = items.map((item) => ({
    id: item.id,
    year: item.year,
    icon: item.icon,
    title: pickLocale(item.title, locale),
    description: pickLocale(item.description, locale),
  }));

  return (
    <section id="timeline" className="relative overflow-hidden py-20 sm:py-28">
      <GlowOrb className="top-0 -start-20 h-80 w-80" />
      <div className="relative mx-auto max-w-5xl px-5 sm:px-8">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <Eyebrow align="center" className="mb-4">
            {pickLocale(section?.eyebrow, locale)}
          </Eyebrow>
          <h2 className="text-balance text-3xl font-extrabold tracking-tight text-ink-900 sm:text-4xl">
            {pickLocale(section?.heading, locale)}
          </h2>
        </div>

        <CareerTimelineList items={resolvedItems} />
      </div>
    </section>
  );
}
