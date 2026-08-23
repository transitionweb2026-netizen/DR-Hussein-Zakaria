"use client";

import { useState } from "react";
import Image from "next/image";
import { Play } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { Modal } from "@/components/ui/modal";
import { Reveal } from "@/components/ui/reveal";
import { VideoEmbed } from "@/components/ui/video-embed";
import type { VideoProvider } from "@/lib/video-embed";

type VideoItem = {
  id: string;
  title: string;
  description: string;
  duration: string;
  thumbnail: string | null;
  videoUrl: string | null;
  videoProvider: VideoProvider;
};

export function FeaturedVideosList({ items }: { items: VideoItem[] }) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const active = items.find((i) => i.id === activeId) ?? null;

  return (
    <>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item, i) => (
          <Reveal key={item.id} delay={i * 90}>
            <GlassCard hover className="group h-full p-2.5">
              <button type="button" onClick={() => setActiveId(item.id)} className="block w-full text-start">
                <div className="relative aspect-[3/4] w-full overflow-hidden rounded-[calc(var(--radius-card)-0.625rem)] bg-navy-950">
                  {item.thumbnail && (
                    <Image
                      src={item.thumbnail}
                      alt={item.title}
                      fill
                      sizes="(min-width: 1024px) 320px, 90vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  )}
                  <div className="absolute inset-0 flex items-center justify-center bg-navy-950/20 transition-colors duration-300 group-hover:bg-navy-950/35">
                    <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-brand-600 shadow-glass-sm transition-transform duration-300 group-hover:scale-110">
                      <Play className="h-5 w-5 fill-current ps-0.5" />
                    </span>
                  </div>
                  {item.duration && (
                    <span className="absolute bottom-2.5 end-2.5 rounded-md bg-navy-950/80 px-2 py-0.5 text-xs font-semibold text-white backdrop-blur">
                      {item.duration}
                    </span>
                  )}
                </div>
                <div className="px-1.5 pb-1 pt-4">
                  <h3 className="text-sm font-bold text-ink-900">{item.title}</h3>
                  <p className="mt-1 text-xs text-ink-400">{item.description}</p>
                </div>
              </button>
            </GlassCard>
          </Reveal>
        ))}
        {items.length === 0 && <p className="text-sm text-ink-400">No videos published yet.</p>}
      </div>

      <Modal open={active !== null} onClose={() => setActiveId(null)} className="max-w-3xl p-3">
        {active && (
          <>
            <div className="relative aspect-video w-full overflow-hidden rounded-[calc(var(--radius-card)-0.625rem)] bg-navy-950">
              {active.videoUrl ? (
                <VideoEmbed url={active.videoUrl} provider={active.videoProvider} title={active.title} />
              ) : (
                <>
                  {active.thumbnail && <Image src={active.thumbnail} alt={active.title} fill sizes="820px" className="object-cover" />}
                  <div className="absolute inset-0 flex items-center justify-center bg-navy-950/25">
                    <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white/90 text-brand-600 shadow-glass-lg">
                      <Play className="h-6 w-6 fill-current ps-1" />
                    </span>
                  </div>
                  {active.duration && (
                    <span className="absolute bottom-4 end-4 rounded-md bg-navy-950/80 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur">
                      {active.duration}
                    </span>
                  )}
                </>
              )}
            </div>
            <div className="p-5 sm:p-6">
              <h3 className="text-lg font-extrabold text-ink-900 sm:text-xl">{active.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-600">{active.description}</p>
            </div>
          </>
        )}
      </Modal>
    </>
  );
}
