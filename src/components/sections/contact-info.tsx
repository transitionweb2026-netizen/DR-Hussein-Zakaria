import { getLocale } from "next-intl/server";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { IconTile } from "@/components/ui/icon-tile";
import { Reveal } from "@/components/ui/reveal";
import { GlowOrb } from "@/components/decorative/glow-orb";
import { WhatsappIcon } from "@/components/icons/social-icons";
import { getSiteSettings, getActiveSocialLinks, getFooterContent } from "@/lib/data/global-settings";
import { getSocialIcon } from "@/lib/social-icon-map";
import { pickLocale } from "@/lib/i18n-content";

export async function ContactInfo() {
  const locale = await getLocale();
  const [settings, socials, footer] = await Promise.all([getSiteSettings(), getActiveSocialLinks(), getFooterContent()]);

  const phone = settings?.phone ?? "";
  const whatsapp = settings?.whatsapp_number ?? "";
  const email = settings?.email ?? "";
  const address = pickLocale(settings?.address, locale);

  const cards = [
    { icon: Phone, label: phone, href: `tel:${phone}`, dir: "ltr" as const },
    { icon: WhatsappIcon, label: phone, href: `https://wa.me/${whatsapp}`, dir: "ltr" as const },
    { icon: Mail, label: email, href: `mailto:${email}`, dir: "ltr" as const },
    { icon: MapPin, label: address, href: undefined, dir: undefined },
  ];

  return (
    <section id="contact-info" className="relative overflow-hidden pt-20 sm:pt-28">
      <GlowOrb className="top-10 -end-16 h-72 w-72" />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((card, i) => (
            <Reveal key={card.label + i} delay={i * 90}>
              <GlassCard hover className="flex h-full flex-col items-center gap-3 p-6 text-center">
                <IconTile icon={card.icon} size="sm" />
                {card.href ? (
                  <a href={card.href} dir={card.dir} className="text-sm font-bold text-ink-900 transition-colors hover:text-brand-600">
                    {card.label}
                  </a>
                ) : (
                  <p className="text-sm font-bold text-ink-900">{card.label}</p>
                )}
              </GlassCard>
            </Reveal>
          ))}
        </div>

        <Reveal delay={360}>
          <GlassCard className="mt-6 flex flex-col items-center justify-between gap-6 p-6 sm:flex-row">
            <div className="flex items-center gap-3.5">
              <IconTile icon={Clock} size="xs" />
              <div>
                <p className="text-sm font-bold text-ink-900">{pickLocale(footer?.weekdays_label, locale)}</p>
                <p className="text-xs text-ink-400">{pickLocale(footer?.weekday_hours, locale)}</p>
              </div>
              <span className="mx-2 h-8 w-px bg-line" />
              <div>
                <p className="text-sm font-bold text-ink-900">{pickLocale(footer?.weekend_label, locale)}</p>
                <p className="text-xs text-ink-400">{pickLocale(footer?.weekend_status, locale)}</p>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              {socials.map((social) => {
                const Icon = getSocialIcon(social.icon);
                return (
                  <a
                    key={social.id}
                    href={social.url || "#"}
                    aria-label={social.platform}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-line bg-glass-strong text-brand-600 shadow-glass-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-400 hover:text-brand-700"
                  >
                    <Icon className="h-4.5 w-4.5" />
                  </a>
                );
              })}
            </div>
          </GlassCard>
        </Reveal>
      </div>
    </section>
  );
}
