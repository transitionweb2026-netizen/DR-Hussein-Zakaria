import { getLocale, getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { MessageCircle } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { PageHero } from "@/components/sections/page-hero";
import { ContactInfo } from "@/components/sections/contact-info";
import { ContactForm } from "@/components/sections/contact-form";
import { LocationPanel } from "@/components/sections/location-panel";
import { getContactPageContent } from "@/lib/data/contact";
import { getSiteSettings, getFinalCtaContent, getPageSeo } from "@/lib/data/global-settings";
import { pickLocale } from "@/lib/i18n-content";

export async function generateMetadata(
  props: PageProps<"/[locale]/contact">
): Promise<Metadata> {
  const { locale } = await props.params;
  const seo = await getPageSeo("contact");
  const seoTitle = pickLocale(seo?.seo_title, locale);
  if (seoTitle) return { title: seoTitle, description: pickLocale(seo?.meta_description, locale) || undefined };

  const t = await getTranslations({ locale, namespace: "contactPage" });
  return { title: t("hero.headingPrefix") + " " + t("hero.headingHighlight") };
}

export default async function ContactPage() {
  const locale = await getLocale();
  const [content, settings, finalCta] = await Promise.all([
    getContactPageContent(),
    getSiteSettings(),
    getFinalCtaContent(),
  ]);

  const whatsappHref = `https://wa.me/${settings?.whatsapp_number ?? ""}`;
  const phoneHref = `tel:${settings?.phone ?? ""}`;

  return (
    <>
      <Header />
      <main className="flex-1">
        <PageHero
          sectionId="contact-hero"
          eyebrow={pickLocale(content?.hero_eyebrow, locale)}
          headingPrefix={pickLocale(content?.hero_heading_prefix, locale)}
          headingHighlight={pickLocale(content?.hero_heading_highlight, locale)}
          paragraph={pickLocale(content?.hero_paragraph, locale)}
          primaryCta={{ label: pickLocale(content?.form_heading, locale), href: "#contact-form", icon: <MessageCircle className="h-4 w-4" /> }}
          showPhoneCard={false}
          compact
        />
        <ContactInfo />
        <ContactForm
          locale={locale}
          eyebrow={pickLocale(content?.form_eyebrow, locale)}
          heading={pickLocale(content?.form_heading, locale)}
          nameLabel={pickLocale(content?.form_name_label, locale)}
          namePlaceholder={pickLocale(content?.form_name_placeholder, locale)}
          emailLabel={pickLocale(content?.form_email_label, locale)}
          emailPlaceholder={pickLocale(content?.form_email_placeholder, locale)}
          phoneLabel={pickLocale(content?.form_phone_label, locale)}
          phonePlaceholder={pickLocale(content?.form_phone_placeholder, locale)}
          messageLabel={pickLocale(content?.form_message_label, locale)}
          messagePlaceholder={pickLocale(content?.form_message_placeholder, locale)}
          submitLabel={pickLocale(content?.form_submit_label, locale)}
          sendingLabel={pickLocale(content?.form_sending_label, locale)}
          successMessage={pickLocale(content?.form_success_message, locale)}
          orLabel={pickLocale(content?.form_or_label, locale)}
          whatsappLabel={pickLocale(finalCta?.whatsapp_label, locale)}
          callLabel={pickLocale(finalCta?.call_label, locale)}
          whatsappHref={whatsappHref}
          phoneHref={phoneHref}
        />
        <LocationPanel />
      </main>
      <Footer />
    </>
  );
}
