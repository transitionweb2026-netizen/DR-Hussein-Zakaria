import { getLocale } from "next-intl/server";
import { Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { GlowOrb } from "@/components/decorative/glow-orb";
import { Reveal } from "@/components/ui/reveal";
import { WhatsappIcon } from "@/components/icons/social-icons";
import { getFinalCtaContent, getSiteSettings } from "@/lib/data/global-settings";
import { pickLocale } from "@/lib/i18n-content";

export async function FinalCta({
  sectionId = "contact",
  title,
  subtitle,
}: {
  sectionId?: string;
  title?: string;
  subtitle?: string;
}) {
  const locale = await getLocale();
  const [cta, settings] = await Promise.all([getFinalCtaContent(), getSiteSettings()]);
  const whatsappHref = `https://wa.me/${settings?.whatsapp_number || ""}`;
  const phoneHref = `tel:${settings?.phone || ""}`;

  return (
    <section id={sectionId} className="relative py-8 sm:py-10">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal>
          <GlassCard tone="deep" className="relative overflow-hidden px-6 py-10 text-center sm:px-10 sm:py-12">
            <GlowOrb className="-top-16 -end-16 h-64 w-64" />
            <GlowOrb className="-bottom-16 -start-16 h-64 w-64" />
            <div className="relative mx-auto max-w-xl">
              <h2 className="text-2xl font-extrabold text-white sm:text-3xl">{title ?? pickLocale(cta?.title, locale)}</h2>
              <p className="mt-2.5 text-sm text-white/70 sm:text-base">{subtitle ?? pickLocale(cta?.subtitle, locale)}</p>

              <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Button
                  href={whatsappHref}
                  size="lg"
                  icon={<WhatsappIcon className="h-5 w-5" />}
                  className="w-full border-2 border-white/40 sm:w-auto"
                >
                  {pickLocale(cta?.whatsapp_label, locale)}
                </Button>
                <Button
                  href={phoneHref}
                  size="lg"
                  variant="outline"
                  icon={<Phone className="h-4.5 w-4.5" />}
                  className="w-full sm:w-auto"
                >
                  {pickLocale(cta?.call_label, locale)}
                </Button>
              </div>
            </div>
          </GlassCard>
        </Reveal>
      </div>
    </section>
  );
}
