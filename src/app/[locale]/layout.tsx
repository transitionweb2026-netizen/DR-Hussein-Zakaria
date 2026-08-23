import type { Metadata } from "next";
import { Cairo, Caveat, Plus_Jakarta_Sans } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { getPageSeo } from "@/lib/data/global-settings";
import { pickLocale } from "@/lib/i18n-content";
import { SITE_URL } from "@/lib/seo";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
  weight: ["600", "700"],
});

export async function generateMetadata(
  props: LayoutProps<"/[locale]">
): Promise<Metadata> {
  const { locale } = await props.params;
  const t = await getTranslations({ locale, namespace: "meta" });
  const seo = await getPageSeo("default");

  // Sitewide fallback only -- every actual page below sets its own full
  // metadata (title, description, canonical, hreflang, robots, OG) via
  // buildPageMetadata in src/lib/seo.ts, which fully replaces these
  // fields per Next's metadata merging rules. This just covers metadataBase
  // (needed for the whole tree) and a sane default if a segment ever omits
  // its own generateMetadata.
  return {
    metadataBase: new URL(SITE_URL),
    title: pickLocale(seo?.seo_title, locale) || t("title"),
    description: pickLocale(seo?.meta_description, locale) || t("description"),
    robots: seo?.robots || undefined,
  };
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout(props: LayoutProps<"/[locale]">) {
  const { locale } = await props.params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const messages = await getMessages();
  const dir = locale === "ar" ? "rtl" : "ltr";

  return (
    <html
      lang={locale}
      dir={dir}
      className={`${jakarta.variable} ${cairo.variable} ${caveat.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col overflow-x-hidden">
        <NextIntlClientProvider messages={messages}>
          {props.children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
