import Image from "next/image";
import { getLocale } from "next-intl/server";
import { ArrowRight, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { RatingStars } from "@/components/ui/rating-stars";
import { SectionHeading } from "@/components/ui/section-heading";
import { Carousel } from "@/components/ui/carousel";
import { Reveal } from "@/components/ui/reveal";
import { GlowOrb } from "@/components/decorative/glow-orb";
import { getAllReviews } from "@/lib/data/patient-stories";
import { pickLocale } from "@/lib/i18n-content";

export async function Reviews({
  sectionId = "reviews",
  eyebrow,
  heading,
  description,
  viewAllHref,
  viewAllLabel,
}: {
  sectionId?: string;
  eyebrow?: string;
  heading?: string;
  description?: string;
  /** When both are set, a "View All" button renders below the carousel,
   * inside this section's own padding -- used by Home's Patient Reviews
   * section; the Patient Stories page's own reviews block omits it. */
  viewAllHref?: string;
  viewAllLabel?: string;
} = {}) {
  const locale = await getLocale();
  const all = await getAllReviews();
  const items = all.filter((r) => r.status === "published");

  const slides = items.map((item) => (
    <GlassCard key={item.id} hover className="flex h-full w-[280px] flex-col p-6 sm:w-[310px]">
      <Quote className="h-7 w-7 text-brand-400" fill="currentColor" strokeWidth={0} />
      <RatingStars rating={item.rating} className="mt-4" />
      <p className="mt-4 flex-1 text-sm leading-relaxed text-ink-600">&ldquo;{pickLocale(item.quote, locale)}&rdquo;</p>
      <div className="mt-6 flex items-center gap-3 border-t border-line pt-4">
        <Image
          src={item.avatar_url || "/images/avatar-1.png"}
          alt={pickLocale(item.name, locale)}
          width={44}
          height={44}
          className="h-11 w-11 rounded-full object-cover"
        />
        <div>
          <p className="text-sm font-bold text-ink-900">{pickLocale(item.name, locale)}</p>
          <p className="text-xs text-ink-400">{pickLocale(item.role, locale)}</p>
        </div>
      </div>
    </GlassCard>
  ));

  return (
    <section id={sectionId} className="relative overflow-hidden py-20 sm:py-28">
      <GlowOrb className="top-1/3 -end-24 h-72 w-72" />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading align="center" eyebrow={eyebrow} prefix={heading} paragraph={description} className="mx-auto mb-12" />
        {slides.length > 0 ? (
          <Carousel slides={slides} showDots className="mx-auto" />
        ) : (
          <p className="text-center text-sm text-ink-400">No reviews published yet.</p>
        )}

        {viewAllHref && viewAllLabel && (
          <Reveal delay={200} className="mt-12 flex justify-center">
            <Button href={viewAllHref} size="lg" icon={<ArrowRight className="h-4.5 w-4.5" />}>
              {viewAllLabel}
            </Button>
          </Reveal>
        )}
      </div>
    </section>
  );
}
