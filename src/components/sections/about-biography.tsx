import Image from "next/image";
import { getLocale } from "next-intl/server";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Reveal } from "@/components/ui/reveal";
import { GlassCard } from "@/components/ui/glass-card";
import { GlowOrb } from "@/components/decorative/glow-orb";
import { getAboutPageContent } from "@/lib/data/about";
import { getSiteSettings } from "@/lib/data/global-settings";
import { pickLocale } from "@/lib/i18n-content";

export async function AboutBiography() {
  const locale = await getLocale();
  const [content, settings] = await Promise.all([getAboutPageContent(), getSiteSettings()]);
  const doctorName = pickLocale(settings?.site_name, locale, "Dr. Hussein Zakaria");
  const doctorTitle = pickLocale(settings?.tagline, locale);

  return (
    <section id="biography" className="relative overflow-hidden py-20 sm:py-28">
      <GlowOrb className="top-10 -start-24 h-80 w-80" />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2 lg:gap-14">
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
                    src={content?.doctor_image_url || "/images/doctor-portrait.jpg"}
                    alt={doctorName}
                    fill
                    sizes="(min-width: 1024px) 420px, 90vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy-950/85 via-navy-950/10 to-transparent p-5 pt-14">
                    <p className="text-sm font-extrabold text-white">{doctorName}</p>
                    <p className="mt-0.5 text-xs font-medium text-white/70">{doctorTitle}</p>
                  </div>
                </div>
              </GlassCard>
            </div>
          </Reveal>

          <Reveal>
            {(pickLocale(content?.biography_eyebrow, locale) || pickLocale(content?.biography_heading, locale)) && (
              <div className="mb-6">
                {pickLocale(content?.biography_eyebrow, locale) && (
                  <Eyebrow className="mb-4">{pickLocale(content?.biography_eyebrow, locale)}</Eyebrow>
                )}
                {pickLocale(content?.biography_heading, locale) && (
                  <h2 className="text-balance text-3xl font-extrabold tracking-tight text-ink-900 sm:text-4xl">
                    {pickLocale(content?.biography_heading, locale)}
                  </h2>
                )}
              </div>
            )}
            <div className="space-y-4">
              {pickLocale(content?.biography, locale)
                .split("\n\n")
                .filter(Boolean)
                .map((paragraph, i) => (
                  <p key={i} className="text-[0.98rem] leading-relaxed text-ink-600">
                    {paragraph}
                  </p>
                ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
