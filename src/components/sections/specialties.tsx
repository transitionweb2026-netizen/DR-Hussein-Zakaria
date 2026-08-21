import Image from "next/image";
import { useTranslations } from "next-intl";
import { GlassCard } from "@/components/ui/glass-card";
import { SectionHeading } from "@/components/ui/section-heading";
import { Carousel } from "@/components/ui/carousel";
import { GlowOrb } from "@/components/decorative/glow-orb";

type SpecialtyItem = {
  id: string;
  title: string;
};

export function Specialties() {
  const t = useTranslations("specialties");
  const items = t.raw("items") as SpecialtyItem[];

  const slides = items.map((item, i) => (
    <GlassCard key={item.id} hover className="w-[168px] p-2.5 sm:w-[190px]">
      <div className="relative aspect-square w-full overflow-hidden rounded-[calc(var(--radius-card)-0.625rem)]">
        <Image
          src={`/images/specialty-${(i % 6) + 1}.jpg`}
          alt={item.title}
          fill
          sizes="190px"
          className="object-cover"
        />
      </div>
      <div className="px-1 pt-3 pb-1 text-center">
        <span className="text-sm font-bold text-ink-900">{item.title}</span>
      </div>
    </GlassCard>
  ));

  return (
    <section id="conditions" className="relative overflow-hidden py-20 sm:py-28">
      <GlowOrb className="-top-10 -start-20 h-80 w-80" />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          align="center"
          eyebrow={t("eyebrow")}
          prefix={t("heading")}
          className="mx-auto mb-12"
        />
        <Carousel slides={slides} className="mx-auto" />
      </div>
    </section>
  );
}
