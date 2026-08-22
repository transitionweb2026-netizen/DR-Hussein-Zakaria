import Image from "next/image";
import { getLocale } from "next-intl/server";
import { Brain, Mail, MapPin, Phone } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { GlowOrb } from "@/components/decorative/glow-orb";
import { getActiveNavItems, getActiveSocialLinks, getFooterContent, getSiteSettings } from "@/lib/data/global-settings";
import { getPublishedServiceCategories } from "@/lib/data/shared-content";
import { getSocialIcon } from "@/lib/social-icon-map";
import { pickLocale } from "@/lib/i18n-content";

export async function Footer() {
  const locale = await getLocale();
  const [navItems, socials, footer, settings, categories] = await Promise.all([
    getActiveNavItems(),
    getActiveSocialLinks(),
    getFooterContent(),
    getSiteSettings(),
    getPublishedServiceCategories(),
  ]);

  const year = new Date().getFullYear();
  const logoName = pickLocale(settings?.site_name, locale, "Dr. Hussein Zakaria");
  const logoTitle = pickLocale(settings?.tagline, locale);

  return (
    <footer className="relative overflow-hidden border-t-2 border-line bg-glass text-ink-900 backdrop-blur-xl">
      <GlowOrb className="-top-20 start-1/4 h-72 w-72" />
      <GlowOrb className="bottom-0 end-0 h-80 w-80" />

      <div className="relative mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:py-20">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-5 lg:gap-8">
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center gap-3">
              {settings?.logo_url ? (
                <span className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full">
                  <Image src={settings.logo_url} alt="" fill sizes="44px" className="object-cover" />
                </span>
              ) : (
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-brand-400 to-brand-600 text-white shadow-btn">
                  <Brain className="h-5.5 w-5.5" strokeWidth={1.8} />
                </span>
              )}
              <span className="flex flex-col leading-tight">
                <span className="text-[0.95rem] font-extrabold text-ink-900">{logoName}</span>
                <span className="text-xs font-medium text-ink-400">{logoTitle}</span>
              </span>
            </Link>
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-ink-600">{pickLocale(footer?.description, locale)}</p>
            <div className="mt-6 flex items-center gap-2.5">
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
          </div>

          <FooterColumn title={pickLocale(footer?.quick_links_title, locale)}>
            {navItems.map((item) => (
              <Link key={item.id} href={item.href} className="text-sm text-ink-600 transition-colors hover:text-brand-600">
                {pickLocale(item.label, locale)}
              </Link>
            ))}
          </FooterColumn>

          <FooterColumn title={pickLocale(footer?.services_title, locale)}>
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/services#surgeries-${category.slug}`}
                className="text-sm text-ink-600 transition-colors hover:text-brand-600"
              >
                {pickLocale(category.title, locale)}
              </Link>
            ))}
          </FooterColumn>

          <FooterColumn title={pickLocale(footer?.contact_title, locale)}>
            <a href={`tel:${settings?.phone ?? ""}`} className="flex items-start gap-2.5 text-sm text-ink-600 hover:text-brand-600">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-brand-500" />
              <span dir="ltr" className="text-start">{settings?.phone}</span>
            </a>
            <a href={`mailto:${settings?.email ?? ""}`} className="flex items-start gap-2.5 text-sm text-ink-600 hover:text-brand-600">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-brand-500" />
              <span dir="ltr" className="text-start">{settings?.email}</span>
            </a>
            <span className="flex items-start gap-2.5 text-sm text-ink-600">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-500" />
              {pickLocale(settings?.address, locale)}
            </span>
          </FooterColumn>

          <FooterColumn title={pickLocale(footer?.hours_title, locale)}>
            <div className="text-sm text-ink-600">
              <p className="font-semibold text-ink-900">{pickLocale(footer?.weekdays_label, locale)}</p>
              <p>{pickLocale(footer?.weekday_hours, locale)}</p>
            </div>
            <div className="text-sm text-ink-600">
              <p className="font-semibold text-ink-900">{pickLocale(footer?.weekend_label, locale)}</p>
              <p>{pickLocale(footer?.weekend_status, locale)}</p>
            </div>
          </FooterColumn>
        </div>

        <div className="mt-14 border-t border-line pt-7 text-center text-sm text-ink-400">
          {pickLocale(footer?.copyright, locale).replace("{year}", String(year))}
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-sm font-bold uppercase tracking-wide text-ink-900">{title}</h3>
      <div className="mt-5 flex flex-col items-start gap-3">{children}</div>
    </div>
  );
}
