import Image from "next/image";
import type { ReactNode } from "react";
import { Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/eyebrow";
import { GlassCard } from "@/components/ui/glass-card";
import { IconTile } from "@/components/ui/icon-tile";
import { CursorGlow } from "@/components/decorative/cursor-glow";
import { getSiteSettings, getActiveSocialLinks } from "@/lib/data/global-settings";
import { getSocialIcon } from "@/lib/social-icon-map";

type CtaConfig = {
  label: string;
  href: string;
  icon?: ReactNode;
};

export async function PageHero({
  sectionId,
  eyebrow,
  headingPrefix,
  headingHighlight,
  paragraph,
  primaryCta,
  secondaryCta,
  showPhoneCard = true,
  // Defaults cover the pages whose own hero content isn't wired to Supabase
  // yet (Services/Videos/Patient Stories/Articles/Contact -- later phases);
  // Home passes its real CMS-sourced values explicitly.
  phoneLabel = "Call Us Anytime",
  socialLabel = "Follow us",
  backgroundImage,
  compact = false,
  showOverlay = true,
}: {
  sectionId?: string;
  eyebrow: string;
  headingPrefix: string;
  headingHighlight?: string;
  paragraph: string;
  primaryCta: CtaConfig;
  secondaryCta?: CtaConfig;
  showPhoneCard?: boolean;
  phoneLabel?: string;
  socialLabel?: string;
  /** Falls back to Global Settings → Branding's sitewide default, then to
   * the static placeholder if nothing has been uploaded yet. */
  backgroundImage?: string | null;
  compact?: boolean;
  /** Darkening gradient tint over the background image. Defaults on
   * everywhere (unchanged look on every other page) -- About's hero opts
   * out to show its background image untinted. */
  showOverlay?: boolean;
}) {
  const [settings, socials] = await Promise.all([getSiteSettings(), getActiveSocialLinks()]);
  const resolvedBackground = backgroundImage || settings?.default_hero_bg_url || "/images/hero-bg.jpg";

  return (
    <section
      id={sectionId}
      className={
        "relative isolate overflow-hidden pt-14 sm:pt-20 " +
        (compact ? "pb-20 sm:pb-24" : "pb-28 sm:pb-36")
      }
    >
      <div className="absolute inset-0 -z-10">
        <Image src={resolvedBackground} alt="" fill priority sizes="100vw" className="object-cover" />
        {showOverlay && (
          <div className="absolute inset-0 bg-gradient-to-b from-navy-950/75 via-navy-950/45 to-navy-950/80" />
        )}
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-bg-100 to-transparent" />
      </div>
      <CursorGlow />

      <div className="absolute inset-y-0 start-3 z-10 hidden flex-col items-center justify-center gap-3 sm:flex lg:start-8">
        <span className="sr-only">{socialLabel}</span>
        {socials.map((social, i) => {
          const Icon = getSocialIcon(social.icon);
          return (
            <a
              key={social.id}
              href={social.url || "#"}
              aria-label={social.platform}
              target="_blank"
              rel="noopener noreferrer"
              style={{ animationDelay: `${300 + i * 90}ms` }}
              className="motion-safe:animate-fade-up flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-300/60 hover:bg-white/20"
            >
              <Icon className="h-4.5 w-4.5" />
            </a>
          );
        })}
      </div>

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-14 px-5 sm:px-8 sm:ps-20 lg:gap-10 lg:ps-24">
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
            {socials.map((social) => {
              const Icon = getSocialIcon(social.icon);
              return (
                <a
                  key={social.id}
                  href={social.url || "#"}
                  aria-label={social.platform}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-xl"
                >
                  <Icon className="h-4 w-4" />
                </a>
              );
            })}
          </div>
        </div>

      </div>

      {showPhoneCard && (
        <div
          className="mt-8 flex justify-end px-5 motion-safe:animate-fade-up sm:px-8 sm:ps-20 lg:absolute lg:bottom-10 lg:end-8 lg:mt-0 lg:px-0 lg:ps-0"
          style={{ animationDelay: "340ms" }}
        >
          <GlassCard className="w-fit p-3.5" hover sheen>
            <div className="flex items-center gap-2.5">
              <IconTile icon={Phone} size="xs" />
              <div>
                <p className="whitespace-nowrap text-[0.7rem] font-semibold text-ink-400">{phoneLabel}</p>
                <p dir="ltr" className="mt-0.5 whitespace-nowrap text-base font-extrabold text-ink-900">
                  {settings?.phone || ""}
                </p>
              </div>
            </div>
          </GlassCard>
        </div>
      )}
    </section>
  );
}
