"use client";

import { useState } from "react";
import Image from "next/image";
import { Expand } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { Modal } from "@/components/ui/modal";
import { Reveal } from "@/components/ui/reveal";

type ResolvedCertificate = {
  id: string;
  title: string;
  issuer: string;
  year: string;
  imageUrl: string | null;
};

export function CertificatesGrid({ items }: { items: ResolvedCertificate[] }) {
  const [active, setActive] = useState<ResolvedCertificate | null>(null);

  return (
    <>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item, i) => (
          <Reveal key={item.id} delay={i * 90}>
            <GlassCard hover className="group h-full p-2.5">
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
                    sizes="(min-width: 1024px) 320px, 90vw"
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
          </Reveal>
        ))}
      </div>

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
