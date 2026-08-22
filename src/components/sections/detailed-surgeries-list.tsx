"use client";

import { useState } from "react";
import Image from "next/image";
import { GlassCard } from "@/components/ui/glass-card";
import { Modal } from "@/components/ui/modal";
import { Reveal } from "@/components/ui/reveal";
import { VideoEmbed } from "@/components/ui/video-embed";
import type { VideoProvider } from "@/lib/video-embed";

type Surgery = {
  id: string;
  title: string;
  short: string;
  fullDescription: string;
  symptoms: string;
  treatmentInfo: string;
  faq: { question: string; answer: string }[];
  videoUrl: string | null;
  videoProvider: VideoProvider;
  image: string | null;
};

type CategoryGroup = { id: string; slug: string; title: string; surgeries: Surgery[] };

export function DetailedSurgeriesList({ groups }: { groups: CategoryGroup[] }) {
  const [active, setActive] = useState<Surgery | null>(null);

  return (
    <>
      <div className="space-y-20">
        {groups.map((category) => (
          <div key={category.id} id={`surgeries-${category.slug}`} className="scroll-mt-28">
            <Reveal>
              <h3 className="text-balance text-2xl font-extrabold tracking-tight text-ink-900 sm:text-3xl">{category.title}</h3>
            </Reveal>
            <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {category.surgeries.map((surgery, i) => (
                <Reveal key={surgery.id} delay={i * 90}>
                  <GlassCard hover className="group h-full overflow-hidden p-2.5">
                    <button type="button" onClick={() => setActive(surgery)} className="block w-full text-start">
                      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[calc(var(--radius-card)-0.625rem)]">
                        <Image
                          src={surgery.image || "/images/surgery-1.jpg"}
                          alt={surgery.title}
                          fill
                          sizes="(min-width: 1024px) 320px, 90vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                      <div className="px-2 pb-1 pt-4">
                        <h4 className="text-sm font-bold text-ink-900">{surgery.title}</h4>
                        <p className="mt-1.5 text-xs leading-relaxed text-ink-600">{surgery.short}</p>
                      </div>
                    </button>
                  </GlassCard>
                </Reveal>
              ))}
              {category.surgeries.length === 0 && <p className="text-sm text-ink-400">No procedures published yet.</p>}
            </div>
          </div>
        ))}
      </div>

      <Modal open={active !== null} onClose={() => setActive(null)} className="max-w-2xl">
        {active && (
          <>
            <div className="relative aspect-video w-full overflow-hidden rounded-t-card bg-navy-950">
              {active.videoUrl ? (
                <VideoEmbed url={active.videoUrl} provider={active.videoProvider} title={active.title} />
              ) : (
                <Image src={active.image || "/images/surgery-1.jpg"} alt={active.title} fill sizes="700px" className="object-cover" />
              )}
            </div>
            <div className="max-h-[60vh] overflow-y-auto p-6 sm:p-8">
              <h3 className="text-xl font-extrabold text-ink-900 sm:text-2xl">{active.title}</h3>
              <p className="mt-4 text-[0.98rem] leading-relaxed text-ink-600">{active.fullDescription}</p>

              {active.symptoms && (
                <div className="mt-5">
                  <p className="text-xs font-bold uppercase tracking-wide text-ink-400">Symptoms</p>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink-600">{active.symptoms}</p>
                </div>
              )}

              {active.treatmentInfo && (
                <div className="mt-5">
                  <p className="text-xs font-bold uppercase tracking-wide text-ink-400">Treatment</p>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink-600">{active.treatmentInfo}</p>
                </div>
              )}

              {active.faq.length > 0 && (
                <div className="mt-6 space-y-3 border-t border-line pt-5">
                  {active.faq.map((f, i) => (
                    <div key={i}>
                      <p className="text-sm font-bold text-ink-900">{f.question}</p>
                      <p className="mt-1 text-sm leading-relaxed text-ink-600">{f.answer}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </Modal>
    </>
  );
}
