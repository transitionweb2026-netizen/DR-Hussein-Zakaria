"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLocale } from "next-intl";
import { cn } from "@/lib/utils";

export function Carousel({
  slides,
  slideClassName,
  loop = false,
  showDots = false,
  className,
}: {
  slides: ReactNode[];
  slideClassName?: string;
  loop?: boolean;
  showDots?: boolean;
  className?: string;
}) {
  const locale = useLocale();
  const direction = locale === "ar" ? "rtl" : "ltr";
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop,
    align: "start",
    direction,
    containScroll: "trimSnaps",
  });

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  const scrollTo = useCallback((i: number) => emblaApi?.scrollTo(i), [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
      setCanPrev(emblaApi.canScrollPrev());
      setCanNext(emblaApi.canScrollNext());
    };
    const onReinit = () => {
      setScrollSnaps(emblaApi.scrollSnapList());
      onSelect();
    };
    onReinit();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onReinit);
  }, [emblaApi]);

  return (
    <div className={cn("relative", className)}>
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="-ms-4 flex">
          {slides.map((slide, i) => (
            <div key={i} className={cn("min-w-0 shrink-0 grow-0 ps-4", slideClassName)}>
              {slide}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 flex items-center justify-center gap-5">
        <ArrowButton direction="prev" onClick={scrollPrev} disabled={!canPrev} />
        {showDots && (
          <div className="flex items-center gap-2">
            {scrollSnaps.map((_, i) => (
              <button
                key={i}
                aria-label={`Go to slide ${i + 1}`}
                onClick={() => scrollTo(i)}
                className={cn(
                  "h-2 rounded-full transition-all duration-300",
                  i === selectedIndex ? "w-6 bg-brand-500" : "w-2 bg-brand-200"
                )}
              />
            ))}
          </div>
        )}
        <ArrowButton direction="next" onClick={scrollNext} disabled={!canNext} />
      </div>
    </div>
  );
}

function ArrowButton({
  direction,
  onClick,
  disabled,
}: {
  direction: "prev" | "next";
  onClick: () => void;
  disabled: boolean;
}) {
  const Icon = direction === "prev" ? ChevronLeft : ChevronRight;
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={direction}
      className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-line bg-glass-strong text-brand-600 shadow-glass-sm backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-400 disabled:pointer-events-none disabled:opacity-30"
    >
      <Icon className="h-5 w-5 rtl:-scale-x-100" strokeWidth={2} />
    </button>
  );
}
