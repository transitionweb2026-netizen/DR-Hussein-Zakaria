import { getLocale, getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { PageHero } from "@/components/sections/page-hero";
import { ServicesOverview } from "@/components/sections/services-overview";
import { DetailedSurgeries } from "@/components/sections/detailed-surgeries";
import { FinalCta } from "@/components/sections/final-cta";
import { WhatsappIcon } from "@/components/icons/social-icons";
import { getServicesPageContent } from "@/lib/data/services";
import { getSiteSettings, getFinalCtaContent } from "@/lib/data/global-settings";
import { pickLocale } from "@/lib/i18n-content";
import { buildPageMetadata } from "@/lib/seo";

export async function generateMetadata(
  props: PageProps<"/[locale]/services">
): Promise<Metadata> {
  const { locale } = await props.params;
  const t = await getTranslations({ locale, namespace: "servicesPage" });
  return buildPageMetadata({
    pageKey: "services",
    locale,
    fallbackTitle: t("hero.headingPrefix") + " " + t("hero.headingHighlight"),
    fallbackDescription: t("hero.paragraph"),
  });
}

export default async function ServicesPage() {
  const locale = await getLocale();
  const [content, settings, finalCta] = await Promise.all([getServicesPageContent(), getSiteSettings(), getFinalCtaContent()]);
  const whatsappHref = `https://wa.me/${settings?.whatsapp_number ?? ""}`;

  return (
    <>
      <Header />
      <main className="flex-1">
        <PageHero
          sectionId="services-hero"
          eyebrow={pickLocale(content?.hero_eyebrow, locale)}
          headingPrefix={pickLocale(content?.hero_heading_prefix, locale)}
          headingHighlight={pickLocale(content?.hero_heading_highlight, locale)}
          paragraph={pickLocale(content?.hero_paragraph, locale)}
          primaryCta={{ label: pickLocale(content?.view_procedures_label, locale), href: "/videos", icon: <ArrowRight className="h-4 w-4" /> }}
          secondaryCta={{ label: pickLocale(finalCta?.whatsapp_label, locale), href: whatsappHref, icon: <WhatsappIcon className="h-4 w-4" /> }}
          compact
        />
        <ServicesOverview />
        <DetailedSurgeries />
        <FinalCta sectionId="contact" title={pickLocale(content?.cta_title, locale)} subtitle={pickLocale(content?.cta_subtitle, locale)} />
      </main>
      <Footer />
    </>
  );
}
