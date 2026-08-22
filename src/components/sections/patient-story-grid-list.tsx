"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { Modal } from "@/components/ui/modal";
import { Reveal } from "@/components/ui/reveal";

type Story = {
  id: string;
  name: string;
  title: string;
  image: string | null;
  condition: string;
  journey: string;
  outcome: string;
};

export function PatientStoryGridList({
  items,
  readStoryLabel,
  labelCondition,
  labelJourney,
  labelOutcome,
}: {
  items: Story[];
  readStoryLabel: string;
  labelCondition: string;
  labelJourney: string;
  labelOutcome: string;
}) {
  const [active, setActive] = useState<Story | null>(null);

  return (
    <>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((story, i) => (
          <Reveal key={story.id} delay={i * 90}>
            <GlassCard hover className="group h-full overflow-hidden p-2.5">
              <button type="button" onClick={() => setActive(story)} className="block w-full text-start">
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[calc(var(--radius-card)-0.625rem)]">
                  <Image
                    src={story.image || "/images/patient-story-1.jpg"}
                    alt={story.name}
                    fill
                    sizes="(min-width: 1024px) 400px, 90vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="px-1.5 pb-1 pt-4">
                  <h3 className="text-sm font-bold text-ink-900">{story.title}</h3>
                  <p className="mt-1 text-xs text-ink-400">{story.name}</p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600">
                    {readStoryLabel}
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 rtl:-scale-x-100 group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
                  </span>
                </div>
              </button>
            </GlassCard>
          </Reveal>
        ))}
        {items.length === 0 && <p className="text-sm text-ink-400">No stories published yet.</p>}
      </div>

      <Modal open={active !== null} onClose={() => setActive(null)} className="max-w-2xl">
        {active && (
          <>
            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-t-card">
              <Image src={active.image || "/images/patient-story-1.jpg"} alt={active.name} fill sizes="700px" className="object-cover" />
            </div>
            <div className="p-6 sm:p-8">
              <h3 className="text-xl font-extrabold text-ink-900 sm:text-2xl">{active.title}</h3>
              <p className="mt-1 text-sm font-semibold text-brand-600">{active.name}</p>

              <div className="mt-6 space-y-5">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-ink-400">{labelCondition}</p>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink-600">{active.condition}</p>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-ink-400">{labelJourney}</p>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink-600">{active.journey}</p>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-ink-400">{labelOutcome}</p>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink-600">{active.outcome}</p>
                </div>
              </div>
            </div>
          </>
        )}
      </Modal>
    </>
  );
}
