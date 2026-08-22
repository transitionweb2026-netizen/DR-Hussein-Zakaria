"use client";

import { useEffect, useRef, useState } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { IconTile } from "@/components/ui/icon-tile";
import { getIcon } from "@/lib/icon-map";
import { cn } from "@/lib/utils";

type ResolvedTimelineItem = {
  id: string;
  year: string;
  icon: string;
  title: string;
  description: string;
};

export function CareerTimelineList({ items }: { items: ResolvedTimelineItem[] }) {
  const ref = useRef<HTMLDivElement>(null);
  // Always false on first render so server and client markup match exactly
  // (there's no way to know scroll position during SSR); the real value is
  // resolved client-side by the observer below, after hydration. Reduced-
  // motion users are handled in pure CSS (motion-reduce: below) rather than
  // JS, so no synchronous setState-in-effect or matchMedia-during-render is
  // needed here.
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -100px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="relative">
      <div className="absolute bottom-0 top-0 start-5 w-px bg-line lg:start-1/2">
        <div
          className={cn(
            "h-full w-full origin-top bg-gradient-to-b from-brand-500 to-brand-300 transition-transform duration-[1600ms] ease-out motion-reduce:!scale-y-100 motion-reduce:!transition-none",
            visible ? "scale-y-100" : "scale-y-0"
          )}
        />
      </div>

      <div className="space-y-10 lg:space-y-4">
        {items.map((item, i) => {
          const Icon = getIcon(item.icon);
          return (
            <div key={item.id} className="relative lg:grid lg:grid-cols-2 lg:gap-x-10 lg:py-6">
              <span
                className={cn(
                  "absolute top-1.5 start-5 z-10 flex h-4 w-4 -translate-x-1/2 items-center justify-center rounded-full border-2 border-white bg-brand-500 shadow-[0_0_0_4px_rgb(49_107_233_/_0.18)] transition-all duration-500 lg:start-1/2 motion-reduce:!scale-100 motion-reduce:!opacity-100 motion-reduce:!transition-none",
                  visible ? "scale-100 opacity-100" : "scale-0 opacity-0"
                )}
                style={{ transitionDelay: visible ? `${200 + i * 150}ms` : "0ms" }}
              />

              <div
                className={cn(
                  "ps-14 transition-all duration-700 ease-out lg:ps-0 motion-reduce:!translate-y-0 motion-reduce:!opacity-100 motion-reduce:!transition-none",
                  i % 2 === 0 ? "lg:col-start-1 lg:pe-12" : "lg:col-start-2 lg:row-start-1 lg:ps-12",
                  visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
                )}
                style={{ transitionDelay: visible ? `${240 + i * 150}ms` : "0ms" }}
              >
                <GlassCard hover className="w-full p-5">
                  <div className={cn("flex items-center gap-3", i % 2 === 0 && "lg:flex-row-reverse")}>
                    <IconTile icon={Icon} size="xs" />
                    <span className="text-xs font-bold uppercase tracking-wider text-brand-600">{item.year}</span>
                  </div>
                  <h3 className="mt-3 text-base font-bold text-ink-900">{item.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink-600">{item.description}</p>
                </GlassCard>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
