import Image from "next/image";
import { useTranslations } from "next-intl";
import { ArrowRight, Play } from "lucide-react";
import { Eyebrow } from "@/components/ui/eyebrow";
import { GlassCard } from "@/components/ui/glass-card";
import { Carousel } from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { GlowOrb } from "@/components/decorative/glow-orb";

type VideoItem = {
  title: string;
  description: string;
  duration: string;
};

export function Videos() {
  const t = useTranslations("videos");
  const items = t.raw("items") as VideoItem[];

  const slides = items.map((item, i) => (
    <GlassCard key={item.title} hover className="w-[260px] p-2.5 sm:w-[290px]">
      <div className="group relative aspect-video w-full overflow-hidden rounded-[calc(var(--radius-card)-0.625rem)]">
        <Image
          src={`/images/video-${(i % 4) + 1}.jpg`}
          alt={item.title}
          fill
          sizes="290px"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-navy-950/20 transition-colors duration-300 group-hover:bg-navy-950/35">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-brand-600 shadow-glass-sm transition-transform duration-300 group-hover:scale-110">
            <Play className="h-5 w-5 fill-current ps-0.5" />
          </span>
        </div>
        <span className="absolute bottom-2.5 end-2.5 rounded-md bg-navy-950/80 px-2 py-0.5 text-xs font-semibold text-white backdrop-blur">
          {item.duration}
        </span>
      </div>
      <h3 className="mt-4 px-1 text-sm font-bold text-ink-900">{item.title}</h3>
      <p className="mt-1 px-1 pb-1 text-xs text-ink-400">{item.description}</p>
    </GlassCard>
  ));

  return (
    <section id="videos" className="relative overflow-hidden py-20 sm:py-28">
      <GlowOrb className="-bottom-16 -start-16 h-72 w-72" />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-4">
          <div>
            <Eyebrow className="mb-4">{t("eyebrow")}</Eyebrow>
            <h2 className="text-3xl font-extrabold tracking-tight text-ink-900 sm:text-4xl">
              {t("heading")}
            </h2>
          </div>
          <Button href="#videos" variant="ghost" icon={<ArrowRight className="h-4 w-4" />}>
            {t("viewAll")}
          </Button>
        </div>
        <Carousel slides={slides} />
      </div>
    </section>
  );
}
