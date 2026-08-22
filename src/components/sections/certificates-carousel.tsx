"use client";

import { useState } from "react";
import Image from "next/image";
import { Expand } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { Modal } from "@/components/ui/modal";
import { Carousel } from "@/components/ui/carousel";

type ResolvedCertificate = {
  id: string;
  title: string;
  issuer: string;
  year: string;
  imageUrl: string | null;
};

/** Same card markup and lightbox behavior as CertificatesGrid (still used
 * as-is by the About Doctor page), wrapped in the existing Carousel
 * primitive instead of a static grid -- arrows, touch, and smooth
 * scrolling come from Carousel itself, matching the site's other
 * carousels (Stats, Reviews) rather than a new one-off design. */
export function CertificatesCarousel({ items }: { items: ResolvedCertificate[] }) {
  const [active, setActive] = useState<ResolvedCertificate | null>(null);

  const slides = items.map((item) => (
    <GlassCard key={item.id} hover className="group h-full w-[280px] p-2.5 sm:w-[300px]">
      <button
        type="button"
        onClick={() => setActive(item)}
        className="relative block aspect-[7/5] w-full overflow-hidden rounded-[calc(var(--radius-card)-0.625rem)]"
        aria-label={item.title}
      >
        {item.imageUrl && (
          <Image
            src={item.imageUrl}
            alt={item.title}
            fill
            sizes="300px"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}
        <div className="absolute inset-0 flex items-center justify-center bg-navy-950/0 transition-colors duration-300 group-hover:bg-navy-950/20">
          <span className="flex h-10 w-10 scale-90 items-center justify-center rounded-full bg-white/90 text-brand-600 opacity-0 shadow-glass-sm transition-all duration-300 group-hover:scale-100 group-hover:opacity-100">
            <Expand className="h-4.5 w-4.5" />
          </span>
        </div>
      </button>
      <div className="px-2 pb-1 pt-3">
        <h3 className="text-sm font-bold text-ink-900">{item.title}</h3>
        <p className="mt-1 text-xs text-ink-400">
          {item.issuer} · {item.year}
        </p>
      </div>
    </GlassCard>
  ));

  return (
    <>
      {slides.length > 0 ? (
        <Carousel slides={slides} showDots className="mx-auto" />
      ) : (
        <p className="text-center text-sm text-ink-400">No certificates published yet.</p>
      )}

      <Modal open={active !== null} onClose={() => setActive(null)} className="max-w-2xl p-3">
        {active && (
          <>
            <div className="relative aspect-[7/5] w-full overflow-hidden rounded-[calc(var(--radius-card)-0.625rem)]">
              {active.imageUrl && (
                <Image src={active.imageUrl} alt={active.title} fill sizes="700px" className="object-cover" />
              )}
            </div>
            <div className="px-2 pb-1 pt-4">
              <h3 className="text-base font-bold text-ink-900">{active.title}</h3>
              <p className="mt-1 text-sm text-ink-400">
                {active.issuer} · {active.year}
              </p>
            </div>
          </>
        )}
      </Modal>
    </>
  );
}
