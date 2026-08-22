import { getLocale } from "next-intl/server";
import { Eyebrow } from "@/components/ui/eyebrow";
import { GlassCard } from "@/components/ui/glass-card";
import { IconTile } from "@/components/ui/icon-tile";
import { Reveal } from "@/components/ui/reveal";
import { GlowOrb } from "@/components/decorative/glow-orb";
import { getIcon } from "@/lib/icon-map";
import { getAboutSpecialtiesSection } from "@/lib/data/about";
import { getPublishedServiceCategories } from "@/lib/data/shared-content";
import { pickLocale } from "@/lib/i18n-content";

/** Same shared service_categories data as the Home page's Specialties
 * section and the /services page's category list. */
export async function AboutSpecialties() {
  const locale = await getLocale();
  const [section, items] = await Promise.all([getAboutSpecialtiesSection(), getPublishedServiceCategories()]);

  return (
    <section id="about-specialties" className="relative overflow-hidden py-20 sm:py-28">
      <GlowOrb className="top-10 -end-16 h-72 w-72" />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal className="mx-auto mb-12 max-w-2xl text-center">
          <Eyebrow align="center" className="mb-4">
            {pickLocale(section?.eyebrow, locale)}
          </Eyebrow>
          <h2 className="text-balance text-3xl font-extrabold tracking-tight text-ink-900 sm:text-4xl">
            {pickLocale(section?.heading, locale)}
          </h2>
        </Reveal>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item, i) => (
            <Reveal key={item.id} delay={i * 90}>
              <GlassCard hover className="h-full p-6">
                <IconTile icon={getIcon(item.icon)} />
                <h3 className="mt-5 text-[1.05rem] font-bold text-ink-900">{pickLocale(item.title, locale)}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-600">{pickLocale(item.description, locale)}</p>
              </GlassCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
