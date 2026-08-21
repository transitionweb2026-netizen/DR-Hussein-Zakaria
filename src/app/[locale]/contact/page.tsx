import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { MessageCircle } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { PageHero } from "@/components/sections/page-hero";
import { ContactInfo } from "@/components/sections/contact-info";
import { ContactForm } from "@/components/sections/contact-form";
import { LocationPanel } from "@/components/sections/location-panel";

export async function generateMetadata(
  props: PageProps<"/[locale]/contact">
): Promise<Metadata> {
  const { locale } = await props.params;
  const t = await getTranslations({ locale, namespace: "contactPage" });
  return { title: t("hero.headingPrefix") + " " + t("hero.headingHighlight") };
}

export default async function ContactPage() {
  const t = await getTranslations("contactPage");

  return (
    <>
      <Header />
      <main className="flex-1">
        <PageHero
          sectionId="contact-hero"
          eyebrow={t("hero.eyebrow")}
          headingPrefix={t("hero.headingPrefix")}
          headingHighlight={t("hero.headingHighlight")}
          paragraph={t("hero.paragraph")}
          primaryCta={{ label: t("form.heading"), href: "#contact-form", icon: <MessageCircle className="h-4 w-4" /> }}
          showPhoneCard={false}
          compact
        />
        <ContactInfo />
        <ContactForm />
        <LocationPanel />
      </main>
      <Footer />
    </>
  );
}
