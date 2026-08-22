import Image from "next/image";
import { getLocale } from "next-intl/server";
import { Eyebrow } from "@/components/ui/eyebrow";
import { GlassCard } from "@/components/ui/glass-card";
import { IconTile } from "@/components/ui/icon-tile";
import { Reveal } from "@/components/ui/reveal";
import { GlowOrb } from "@/components/decorative/glow-orb";
import { getIcon } from "@/lib/icon-map";
import { getHomeTechnologiesSection, getPublishedTechnologies } from "@/lib/data/home";
import { pickLocale } from "@/lib/i18n-content";

export async function Technologies() {
  const locale = await getLocale();
  const [section, items] = await Promise.all([getHomeTechnologiesSection(), getPublishedTechnologies()]);

  return (
    <section id="technologies" className="relative overflow-hidden py-20 sm:py-28">
      <GlowOrb className="bottom-0 -start-16 h-72 w-72" />
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

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item, i) => (
            <Reveal key={item.id} delay={i * 90}>
              <GlassCard hover className="group h-full overflow-hidden p-2.5">
                {item.image_url ? (
                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[calc(var(--radius-card)-0.625rem)]">
                    <Image
                      src={item.image_url}
                      alt={pickLocale(item.name, locale)}
                      fill
                      sizes="(min-width: 1024px) 320px, 90vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                ) : (
                  <div className="p-3.5">
                    <IconTile icon={getIcon(item.icon)} />
                  </div>
                )}
                <div className="px-2 pb-1 pt-4">
                  <h3 className="text-base font-bold text-ink-900">{pickLocale(item.name, locale)}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink-600">{pickLocale(item.description, locale)}</p>
                </div>
              </GlassCard>
            </Reveal>
          ))}
          {items.length === 0 && <p className="text-center text-sm text-ink-400 sm:col-span-2 lg:col-span-4">No technologies published yet.</p>}
        </div>
      </div>
    </section>
  );
}
