import { useTranslations } from "next-intl";
import { ArrowRight, Play } from "lucide-react";
import { PageHero } from "./page-hero";

export function Hero() {
  const t = useTranslations("hero");

  return (
    <PageHero
      sectionId="home"
      eyebrow={t("eyebrow")}
      headingPrefix={t("headingPrefix")}
      headingHighlight={t("headingHighlight")}
      paragraph={t("paragraph")}
      primaryCta={{ label: t("ctaPrimary"), href: "#contact", icon: <ArrowRight className="h-4.5 w-4.5" /> }}
      secondaryCta={{
        label: t("ctaSecondary"),
        href: "#video",
        icon: <Play className="h-4 w-4 fill-current" />,
      }}
    />
  );
}
