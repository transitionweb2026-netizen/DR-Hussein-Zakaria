import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { PageHero } from "@/components/sections/page-hero";
import { ServicesOverview } from "@/components/sections/services-overview";
import { DetailedSurgeries } from "@/components/sections/detailed-surgeries";
import { FinalCta } from "@/components/sections/final-cta";
import { WhatsappIcon } from "@/components/icons/social-icons";
import { WHATSAPP_HREF } from "@/lib/contact";

export async function generateMetadata(
  props: PageProps<"/[locale]/services">
): Promise<Metadata> {
  const { locale } = await props.params;
  const t = await getTranslations({ locale, namespace: "servicesPage" });
  return { title: t("hero.headingPrefix") + " " + t("hero.headingHighlight") };
}

export default async function ServicesPage() {
  const t = await getTranslations("servicesPage");
  const tf = await getTranslations("finalCta");

  return (
    <>
      <Header />
      <main className="flex-1">
        <PageHero
          sectionId="services-hero"
          eyebrow={t("hero.eyebrow")}
          headingPrefix={t("hero.headingPrefix")}
          headingHighlight={t("hero.headingHighlight")}
          paragraph={t("hero.paragraph")}
          primaryCta={{ label: t("viewProcedures"), href: "#services-overview", icon: <ArrowRight className="h-4 w-4" /> }}
          secondaryCta={{ label: tf("whatsapp"), href: WHATSAPP_HREF, icon: <WhatsappIcon className="h-4 w-4" /> }}
          compact
        />
        <ServicesOverview />
        <DetailedSurgeries />
        <FinalCta sectionId="contact" title={t("cta.title")} subtitle={t("cta.subtitle")} />
      </main>
      <Footer />
    </>
  );
}
