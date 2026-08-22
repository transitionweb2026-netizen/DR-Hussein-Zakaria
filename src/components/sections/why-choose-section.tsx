import Image from "next/image";
import { getLocale } from "next-intl/server";
import { Award } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { Eyebrow } from "@/components/ui/eyebrow";
import { IconTile } from "@/components/ui/icon-tile";
import { Reveal } from "@/components/ui/reveal";
import { GlowOrb } from "@/components/decorative/glow-orb";
import { getIcon } from "@/lib/icon-map";
import { getHomeWhyChooseSection, getPublishedWhyChooseReasons } from "@/lib/data/home";
import { getSiteSettings } from "@/lib/data/global-settings";
import { pickLocale } from "@/lib/i18n-content";

/** Adapted from the (previously unused) why-choose.tsx -- same visual
 * treatment, now Supabase-backed, with the image/text sides swapped to
 * match the new Home structure's "reasons left, image right" layout. */
export async function WhyChooseSection() {
  const locale = await getLocale();
  const [section, reasons, settings] = await Promise.all([
    getHomeWhyChooseSection(),
    getPublishedWhyChooseReasons(),
    getSiteSettings(),
  ]);
  const doctorName = pickLocale(settings?.site_name, locale, "Dr. Hussein Zakaria");
  const doctorTitle = pickLocale(settings?.tagline, locale);

  return (
    <section id="why-choose" className="relative overflow-hidden py-20 sm:py-28">
      <GlowOrb className="top-0 -end-24 h-80 w-80" />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <GlassCard className="overflow-hidden p-5 sm:p-8 lg:p-10">
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-14">
            <Reveal>
              <Eyebrow className="mb-4">{pickLocale(section?.eyebrow, locale)}</Eyebrow>
              <h2 className="text-balance text-3xl font-extrabold leading-[1.15] tracking-tight text-ink-900 sm:text-4xl">
                {pickLocale(section?.heading_prefix, locale)}{" "}
                <span className="text-brand-500">{pickLocale(section?.heading_highlight, locale)}</span>
              </h2>
              <p className="mt-4 max-w-xl text-[0.98rem] leading-relaxed text-ink-600">
                {pickLocale(section?.description, locale)}
              </p>

              <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
                {reasons.map((reason) => (
                  <div key={reason.id} className="flex items-start gap-3.5">
                    <IconTile icon={getIcon(reason.icon)} size="sm" />
                    <div>
                      <h3 className="text-sm font-bold text-ink-900">{pickLocale(reason.title, locale)}</h3>
                      <p className="mt-1 text-[0.85rem] leading-relaxed text-ink-600">{pickLocale(reason.description, locale)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal delay={120} className="relative mx-auto w-full max-w-sm">
              <GlassCard hover className="p-2.5" sheen={false}>
                <div className="relative overflow-hidden rounded-[calc(var(--radius-card)-0.625rem)]">
                  <Image
                    src={section?.image_url || "/images/doctor-portrait.jpg"}
                    alt={doctorName}
                    width={900}
                    height={1100}
                    className="aspect-[4/5] w-full object-cover"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy-950/90 via-navy-950/20 to-transparent p-6 pt-16">
                    <p className="font-signature text-3xl leading-none text-white">{doctorName}</p>
                    <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-white/70">{doctorTitle}</p>
                  </div>
                </div>
              </GlassCard>
              <span className="absolute -bottom-4 -end-4 flex h-16 w-16 items-center justify-center rounded-full border border-line bg-white/80 shadow-glass-lg backdrop-blur-xl">
                <Award className="h-7 w-7 text-brand-500" strokeWidth={1.7} />
              </span>
            </Reveal>
          </div>
        </GlassCard>
      </div>
    </section>
  );
}
