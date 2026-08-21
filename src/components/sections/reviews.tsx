import Image from "next/image";
import { useTranslations } from "next-intl";
import { Quote } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { RatingStars } from "@/components/ui/rating-stars";
import { SectionHeading } from "@/components/ui/section-heading";
import { Carousel } from "@/components/ui/carousel";
import { GlowOrb } from "@/components/decorative/glow-orb";

type ReviewItem = {
  name: string;
  role: string;
  quote: string;
  rating: number;
};

export function Reviews({
  sectionId = "reviews",
  eyebrow,
  heading,
}: {
  sectionId?: string;
  eyebrow?: string;
  heading?: string;
} = {}) {
  const t = useTranslations("reviews");
  const items = t.raw("items") as ReviewItem[];

  const slides = items.map((item, i) => (
    <GlassCard key={item.name} hover className="flex h-full w-[280px] flex-col p-6 sm:w-[310px]">
      <Quote className="h-7 w-7 text-brand-400" fill="currentColor" strokeWidth={0} />
      <RatingStars rating={item.rating} className="mt-4" />
      <p className="mt-4 flex-1 text-sm leading-relaxed text-ink-600">&ldquo;{item.quote}&rdquo;</p>
      <div className="mt-6 flex items-center gap-3 border-t border-line pt-4">
        <Image
          src={`/images/avatar-${(i % 4) + 1}.png`}
          alt={item.name}
          width={44}
          height={44}
          className="h-11 w-11 rounded-full"
        />
        <div>
          <p className="text-sm font-bold text-ink-900">{item.name}</p>
          <p className="text-xs text-ink-400">{item.role}</p>
        </div>
      </div>
    </GlassCard>
  ));

  return (
    <section id={sectionId} className="relative overflow-hidden py-20 sm:py-28">
      <GlowOrb className="top-1/3 -end-24 h-72 w-72" />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          align="center"
          eyebrow={eyebrow ?? t("eyebrow")}
          prefix={heading ?? t("heading")}
          className="mx-auto mb-12"
        />
        <Carousel slides={slides} showDots className="mx-auto" />
      </div>
    </section>
  );
}
