import Image from "next/image";
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";
import { Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/eyebrow";
import { GlassCard } from "@/components/ui/glass-card";
import { IconTile } from "@/components/ui/icon-tile";
import { CursorGlow } from "@/components/decorative/cursor-glow";
import { FacebookIcon, InstagramIcon, TiktokIcon, YoutubeIcon } from "@/components/icons/social-icons";

const socials = [
  { icon: FacebookIcon, label: "Facebook" },
  { icon: InstagramIcon, label: "Instagram" },
  { icon: TiktokIcon, label: "TikTok" },
  { icon: YoutubeIcon, label: "YouTube" },
];

type CtaConfig = {
  label: string;
  href: string;
  icon?: ReactNode;
};

export function PageHero({
  sectionId,
  eyebrow,
  headingPrefix,
  headingHighlight,
  paragraph,
  primaryCta,
  secondaryCta,
  showPhoneCard = true,
  backgroundImage = "/images/hero-bg.jpg",
  compact = false,
}: {
  sectionId?: string;
  eyebrow: string;
  headingPrefix: string;
  headingHighlight?: string;
  paragraph: string;
  primaryCta: CtaConfig;
  secondaryCta?: CtaConfig;
  showPhoneCard?: boolean;
  backgroundImage?: string;
  compact?: boolean;
}) {
  const t = useTranslations("hero");
  const tf = useTranslations("footer");

  return (
    <section
      id={sectionId}
      className={
        "relative isolate overflow-hidden pt-14 sm:pt-20 " +
        (compact ? "pb-20 sm:pb-24" : "pb-28 sm:pb-36")
      }
    >
      <div className="absolute inset-0 -z-10">
        <Image src={backgroundImage} alt="" fill priority sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-navy-950/75 via-navy-950/45 to-navy-950/80" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-bg-100 to-transparent" />
      </div>
      <CursorGlow />

      <div className="absolute inset-y-0 start-3 z-10 hidden flex-col items-center justify-center gap-3 sm:flex lg:start-8">
        <span className="sr-only">{t("socialLabel")}</span>
        {socials.map(({ icon: Icon, label }, i) => (
          <a
            key={label}
            href="#"
            aria-label={label}
            style={{ animationDelay: `${300 + i * 90}ms` }}
            className="motion-safe:animate-fade-up flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-300/60 hover:bg-white/20"
          >
            <Icon className="h-4.5 w-4.5" />
          </a>
        ))}
      </div>

      <div
        className={
          "relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-14 px-5 sm:px-8 sm:ps-20 lg:gap-10 lg:ps-24 " +
          (showPhoneCard ? "lg:grid-cols-[1.2fr_0.8fr]" : "")
        }
      >
        <div>
          <Eyebrow tone="onDark" className="mb-5 motion-safe:animate-fade-up">
            {eyebrow}
          </Eyebrow>
          <h1
            className="text-balance text-4xl font-extrabold leading-[1.1] tracking-tight text-white motion-safe:animate-fade-up sm:text-5xl lg:text-[3.4rem]"
            style={{ animationDelay: "80ms" }}
          >
            {headingPrefix}{" "}
            {headingHighlight && (
              <span className="bg-gradient-to-r from-brand-200 to-brand-400 bg-clip-text text-transparent">
                {headingHighlight}
              </span>
            )}
          </h1>
          <p
            className="mt-6 max-w-lg text-[1.05rem] leading-relaxed text-white/75 motion-safe:animate-fade-up"
            style={{ animationDelay: "160ms" }}
          >
            {paragraph}
          </p>

          <div
            className="mt-9 flex flex-wrap items-center gap-4 motion-safe:animate-fade-up"
            style={{ animationDelay: "240ms" }}
          >
            <Button href={primaryCta.href} size="lg" icon={primaryCta.icon}>
              {primaryCta.label}
            </Button>
            {secondaryCta && (
              <Button href={secondaryCta.href} size="lg" variant="outline" icon={secondaryCta.icon}>
                {secondaryCta.label}
              </Button>
            )}
          </div>

          <div
            className="mt-8 flex items-center gap-3 sm:hidden motion-safe:animate-fade-up"
            style={{ animationDelay: "300ms" }}
          >
            {socials.map(({ icon: Icon, label }) => (
              <a
                key={label}
                href="#"
                aria-label={label}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-xl"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        {showPhoneCard && (
          <div
            className="flex justify-center motion-safe:animate-fade-up lg:justify-end"
            style={{ animationDelay: "340ms" }}
          >
            <GlassCard className="w-full max-w-xs p-5" hover sheen>
              <div className="flex items-center gap-3.5">
                <IconTile icon={Phone} size="sm" />
                <div>
                  <p className="text-xs font-semibold text-ink-400">{t("phoneLabel")}</p>
                  <p dir="ltr" className="mt-0.5 text-lg font-extrabold text-ink-900">
                    {tf("phone")}
                  </p>
                </div>
              </div>
            </GlassCard>
          </div>
        )}
      </div>
    </section>
  );
}
