import { getLocale } from "next-intl/server";
import { getActiveNavItems, getSiteSettings } from "@/lib/data/global-settings";
import { pickLocale } from "@/lib/i18n-content";
import { HeaderClient } from "./header-client";

export async function Header() {
  const locale = await getLocale();
  const [navItems, settings] = await Promise.all([getActiveNavItems(), getSiteSettings()]);

  const resolvedNavItems = navItems.map((item) => ({
    href: item.href,
    label: pickLocale(item.label, locale, item.href),
  }));

  return (
    <HeaderClient
      navItems={resolvedNavItems}
      logoName={pickLocale(settings?.site_name, locale, "Dr. Hussein Zakaria")}
      logoTitle={pickLocale(settings?.tagline, locale)}
      bookAppointmentLabel={pickLocale(settings?.book_appointment_label, locale, "Book Appointment")}
      logoUrl={settings?.logo_url ?? null}
    />
  );
}
