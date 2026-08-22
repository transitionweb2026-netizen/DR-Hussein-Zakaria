import { getLocale } from "next-intl/server";
import { GraduationCap } from "lucide-react";
import { Eyebrow } from "@/components/ui/eyebrow";
import { GlassCard } from "@/components/ui/glass-card";
import { IconTile } from "@/components/ui/icon-tile";
import { Reveal } from "@/components/ui/reveal";
import { GlowOrb } from "@/components/decorative/glow-orb";
import { getAboutPageContent, getPublishedAboutEducation } from "@/lib/data/about";
import { pickLocale } from "@/lib/i18n-content";

export async function AboutEducation() {
  const locale = await getLocale();
  const [content, items] = await Promise.all([getAboutPageContent(), getPublishedAboutEducation()]);

  if (items.length === 0) return null;

  return (
    <section id="education" className="relative overflow-hidden py-20 sm:py-28">
      <GlowOrb className="bottom-0 -end-20 h-72 w-72" />
      <div className="relative mx-auto max-w-5xl px-5 sm:px-8">
        <Reveal className="mx-auto mb-12 max-w-2xl text-center">
          <Eyebrow align="center" className="mb-4">
            {pickLocale(content?.education_heading, locale)}
          </Eyebrow>
        </Reveal>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {items.map((item, i) => (
            <Reveal key={item.id} delay={i * 90}>
              <GlassCard hover className="flex items-start gap-4 p-5">
                <IconTile icon={GraduationCap} size="sm" />
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-brand-600">{item.year}</p>
                  <h3 className="mt-1 text-base font-bold text-ink-900">{pickLocale(item.degree, locale)}</h3>
                  <p className="mt-1 text-sm text-ink-600">{pickLocale(item.institution, locale)}</p>
                </div>
              </GlassCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
