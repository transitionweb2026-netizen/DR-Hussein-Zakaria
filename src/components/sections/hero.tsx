import { getLocale } from "next-intl/server";
import { ArrowRight, Play } from "lucide-react";
import { PageHero } from "./page-hero";
import { getHomeHero } from "@/lib/data/home";
import { pickLocale } from "@/lib/i18n-content";

export async function Hero() {
  const locale = await getLocale();
  const hero = await getHomeHero();

  return (
    <PageHero
      sectionId="home"
      eyebrow={pickLocale(hero?.eyebrow, locale)}
      headingPrefix={pickLocale(hero?.heading_prefix, locale)}
      headingHighlight={pickLocale(hero?.heading_highlight, locale)}
      paragraph={pickLocale(hero?.paragraph, locale)}
      phoneLabel={pickLocale(hero?.phone_label, locale)}
      socialLabel={pickLocale(hero?.social_label, locale)}
      backgroundImage={hero?.background_url}
      primaryCta={{
        label: pickLocale(hero?.cta_primary_label, locale),
        href: "#contact",
        icon: <ArrowRight className="h-4.5 w-4.5" />,
      }}
      secondaryCta={{
        label: pickLocale(hero?.cta_secondary_label, locale),
        href: "/services",
        icon: <Play className="h-4 w-4 fill-current" />,
      }}
    />
  );
}
