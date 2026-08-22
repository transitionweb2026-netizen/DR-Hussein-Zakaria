import Image from "next/image";
import { getLocale } from "next-intl/server";
import { Quote } from "lucide-react";
import { Eyebrow } from "@/components/ui/eyebrow";
import { GlassCard } from "@/components/ui/glass-card";
import { Reveal } from "@/components/ui/reveal";
import { GlowOrb } from "@/components/decorative/glow-orb";
import { getHomeDoctorMessage } from "@/lib/data/home";
import { pickLocale } from "@/lib/i18n-content";

export async function DoctorMessage() {
  const locale = await getLocale();
  const message = await getHomeDoctorMessage();
  const signatureName = pickLocale(message?.signature_name, locale);

  return (
    <section className="relative overflow-hidden py-20 sm:py-28">
      <GlowOrb className="bottom-0 -start-24 h-80 w-80" />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          <Reveal>
            <Eyebrow className="mb-4">{pickLocale(message?.eyebrow, locale)}</Eyebrow>
            <h2 className="text-balance text-3xl font-extrabold leading-[1.15] tracking-tight text-ink-900 sm:text-4xl">
              {pickLocale(message?.heading_prefix, locale)}{" "}
              <span className="text-brand-500">{pickLocale(message?.heading_highlight, locale)}</span>
            </h2>

            <div className="relative mt-7">
              <Quote className="h-9 w-9 text-brand-300" fill="currentColor" strokeWidth={0} />
              <p className="mt-3 max-w-xl text-[1.05rem] italic leading-relaxed text-ink-700">
                &ldquo;{pickLocale(message?.quote, locale)}&rdquo;
              </p>
            </div>

            <div className="mt-7">
              <p className="font-signature text-3xl leading-none text-brand-600">{signatureName}</p>
              <p className="mt-1.5 text-xs font-semibold uppercase tracking-wider text-ink-400">
                {pickLocale(message?.signature_title, locale)}
              </p>
            </div>
          </Reveal>

          <Reveal delay={120} className="order-first lg:order-last">
            <GlassCard hover className="mx-auto max-w-sm p-2.5">
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[calc(var(--radius-card)-0.625rem)]">
                <Image
                  src={message?.portrait_image_url || "/images/doctor-portrait-secondary.jpg"}
                  alt={signatureName}
                  fill
                  sizes="(min-width: 1024px) 400px, 90vw"
                  className="object-cover"
                />
              </div>
            </GlassCard>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
