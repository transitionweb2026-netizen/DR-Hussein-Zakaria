import { getLocale } from "next-intl/server";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import type { ComponentType, SVGProps } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { IconTile } from "@/components/ui/icon-tile";
import { Reveal } from "@/components/ui/reveal";
import { GlowOrb } from "@/components/decorative/glow-orb";
import { WhatsappIcon } from "@/components/icons/social-icons";
import { SocialIcon } from "@/components/ui/social-icon";
import { getSiteSettings, getActiveSocialLinks, getFooterContent } from "@/lib/data/global-settings";
import { pickLocale } from "@/lib/i18n-content";

export async function ContactInfo() {
  const locale = await getLocale();
  const [settings, socials, footer] = await Promise.all([getSiteSettings(), getActiveSocialLinks(), getFooterContent()]);

  const phone = settings?.phone ?? "";
  const whatsappNumbers = [settings?.whatsapp_number, settings?.whatsapp_number_2]
    .map((n) => n?.trim())
    .filter((n): n is string => Boolean(n));
  const email = settings?.email ?? "";
  const address = pickLocale(settings?.address, locale);

  const cards: { icon: ComponentType<SVGProps<SVGSVGElement> & { strokeWidth?: number }>; links: { label: string; href?: string }[] }[] = [
    { icon: Phone, links: [{ label: phone, href: `tel:${phone}` }] },
    { icon: WhatsappIcon, links: whatsappNumbers.map((n) => ({ label: `+${n}`, href: `https://wa.me/${n}` })) },
    { icon: Mail, links: [{ label: email, href: `mailto:${email}` }] },
    { icon: MapPin, links: [{ label: address }] },
  ];

  return (
    <section id="contact-info" className="relative overflow-hidden pt-20 sm:pt-28">
      <GlowOrb className="top-10 -end-16 h-72 w-72" />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((card, i) => (
            <Reveal key={i} delay={i * 90}>
              <GlassCard hover className="flex h-full flex-col items-center justify-center gap-2 p-6 text-center">
                <IconTile icon={card.icon} size="sm" className="mb-1" />
                {card.links.map((link, j) =>
                  link.href ? (
                    <a
                      key={j}
                      href={link.href}
                      target={link.href.startsWith("https://wa.me/") ? "_blank" : undefined}
                      rel={link.href.startsWith("https://wa.me/") ? "noopener noreferrer" : undefined}
                      dir="ltr"
                      className="text-sm font-bold text-ink-900 transition-colors hover:text-brand-600"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <p key={j} className="text-sm font-bold text-ink-900">
                      {link.label}
                    </p>
                  )
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
              {socials.map((social) => (
                <a
                  key={social.id}
                  href={social.url || "#"}
                  aria-label={social.platform}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-line bg-glass-strong text-brand-600 shadow-glass-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-400 hover:text-brand-700"
                >
                  <SocialIcon platform={social.icon} imageUrl={social.icon_url} />
                </a>
              ))}
            </div>
          </GlassCard>
        </Reveal>
      </div>
    </section>
  );
}
