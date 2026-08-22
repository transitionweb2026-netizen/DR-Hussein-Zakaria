import { getLocale } from "next-intl/server";
import { MapPin } from "lucide-react";
import { Eyebrow } from "@/components/ui/eyebrow";
import { GlassCard } from "@/components/ui/glass-card";
import { IconTile } from "@/components/ui/icon-tile";
import { Reveal } from "@/components/ui/reveal";
import { getSiteSettings } from "@/lib/data/global-settings";
import { getContactPageContent } from "@/lib/data/contact";
import { pickLocale } from "@/lib/i18n-content";

const nodes = [
  { x: "12%", y: "28%" }, { x: "24%", y: "62%" }, { x: "38%", y: "18%" },
  { x: "62%", y: "70%" }, { x: "76%", y: "24%" }, { x: "88%", y: "56%" },
];

export async function LocationPanel() {
  const locale = await getLocale();
  const [settings, content] = await Promise.all([getSiteSettings(), getContactPageContent()]);

  return (
    <section id="location" className="relative py-8 sm:py-10">
      <div className="mx-auto max-w-5xl px-5 sm:px-8">
        <Reveal>
          <GlassCard hover className="relative overflow-hidden p-2.5">
            <div className="relative flex aspect-[21/9] w-full flex-col items-center justify-center overflow-hidden rounded-[calc(var(--radius-card)-0.625rem)] bg-gradient-to-br from-navy-900 via-navy-800 to-brand-700">
              {content?.map_embed_url ? (
                <iframe
                  src={content.map_embed_url}
                  title={pickLocale(content.map_label, locale)}
                  className="absolute inset-0 h-full w-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              ) : (
                <>
                  <svg aria-hidden className="absolute inset-0 h-full w-full opacity-25" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <pattern id="location-grid" width="42" height="42" patternUnits="userSpaceOnUse">
                        <path d="M 42 0 L 0 0 0 42" fill="none" stroke="white" strokeWidth="1" />
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#location-grid)" />
                  </svg>
                  {nodes.map((n, i) => (
                    <span
                      key={i}
                      aria-hidden
                      className="absolute h-2 w-2 rounded-full bg-brand-300 shadow-[0_0_14px_4px_rgb(147_197_253_/_0.55)]"
                      style={{ left: n.x, top: n.y }}
                    />
                  ))}
                  <div className="relative flex flex-col items-center gap-3 text-center">
                    <IconTile icon={MapPin} size="md" tone="onNavy" />
                    <div>
                      <Eyebrow tone="onDark" align="center" className="mb-2">
                        {pickLocale(content?.map_label, locale)}
                      </Eyebrow>
                      <p className="text-lg font-extrabold text-white">{pickLocale(settings?.address, locale)}</p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </GlassCard>
        </Reveal>
      </div>
    </section>
  );
}
