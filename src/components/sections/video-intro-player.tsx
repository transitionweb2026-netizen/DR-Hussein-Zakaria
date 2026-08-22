"use client";

import { useState } from "react";
import Image from "next/image";
import { Play } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { Modal } from "@/components/ui/modal";
import { Reveal } from "@/components/ui/reveal";
import { VideoEmbed } from "@/components/ui/video-embed";
import type { VideoProvider } from "@/lib/video-embed";

export function VideoIntroPlayer({
  heading,
  duration,
  thumbnail,
  videoUrl,
  videoProvider,
}: {
  heading: string;
  duration: string;
  thumbnail: string | null;
  videoUrl: string | null;
  videoProvider: VideoProvider;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Reveal delay={120}>
        <GlassCard hover className="group p-2.5 sm:p-3">
          <button
            type="button"
            onClick={() => videoUrl && setOpen(true)}
            aria-label={heading}
            className="relative block aspect-video w-full overflow-hidden rounded-[calc(var(--radius-card)-0.625rem)]"
          >
            <Image
              src={thumbnail || "/images/video-intro.jpg"}
              alt={heading}
              fill
              sizes="(min-width: 1024px) 1000px, 100vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-navy-950/25 transition-colors duration-300 group-hover:bg-navy-950/35">
              <span className="flex h-18 w-18 items-center justify-center rounded-full bg-white/90 text-brand-600 shadow-glass-lg backdrop-blur-xl transition-transform duration-300 group-hover:scale-110">
                <Play className="h-7 w-7 fill-current ps-1" />
              </span>
            </div>
            {duration && (
              <span className="absolute bottom-4 end-4 rounded-md bg-navy-950/80 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur">
                {duration}
              </span>
            )}
          </button>
        </GlassCard>
      </Reveal>

      <Modal open={open} onClose={() => setOpen(false)} className="max-w-4xl p-3">
        <div className="relative aspect-video w-full overflow-hidden rounded-[calc(var(--radius-card)-0.625rem)] bg-navy-950">
          {open && <VideoEmbed url={videoUrl} provider={videoProvider} title={heading} />}
        </div>
      </Modal>
    </>
  );
}
