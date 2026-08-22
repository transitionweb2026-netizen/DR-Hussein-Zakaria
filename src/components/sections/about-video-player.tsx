"use client";

import { useState } from "react";
import Image from "next/image";
import { Play } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { Modal } from "@/components/ui/modal";
import { VideoEmbed } from "@/components/ui/video-embed";
import type { VideoProvider } from "@/lib/video-embed";

/** Same thumbnail-click-to-play-in-modal interaction as VideoIntroPlayer,
 * with one addition: a name/title caption overlay on the thumbnail --
 * reuses the exact gradient-caption treatment the old about-intro.tsx used
 * on its doctor photo, now repurposed for the video that replaced it. */
export function AboutVideoPlayer({
  captionName,
  captionTitle,
  duration,
  thumbnail,
  videoUrl,
  videoProvider,
}: {
  captionName: string;
  captionTitle: string;
  duration: string;
  thumbnail: string | null;
  videoUrl: string | null;
  videoProvider: VideoProvider;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <GlassCard hover className="group p-2.5">
        <button
          type="button"
          onClick={() => videoUrl && setOpen(true)}
          aria-label={captionName}
          className="relative block aspect-video w-full overflow-hidden rounded-[calc(var(--radius-card)-0.625rem)]"
        >
          <Image
            src={thumbnail || "/images/video-intro.jpg"}
            alt={captionName}
            fill
            sizes="(min-width: 1024px) 620px, 100vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-navy-950/25 transition-colors duration-300 group-hover:bg-navy-950/35">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white/90 text-brand-600 shadow-glass-lg backdrop-blur-xl transition-transform duration-300 group-hover:scale-110">
              <Play className="h-6 w-6 fill-current ps-1" />
            </span>
          </div>
          {duration && (
            <span className="absolute top-4 end-4 rounded-md bg-navy-950/80 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur">
              {duration}
            </span>
          )}
          {(captionName || captionTitle) && (
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy-950/90 via-navy-950/20 to-transparent p-5 pt-14 text-start">
              {captionName && <p className="font-signature text-2xl leading-none text-white">{captionName}</p>}
              {captionTitle && (
                <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-white/70">{captionTitle}</p>
              )}
            </div>
          )}
        </button>
      </GlassCard>

      <Modal open={open} onClose={() => setOpen(false)} className="max-w-4xl p-3">
        <div className="relative aspect-video w-full overflow-hidden rounded-[calc(var(--radius-card)-0.625rem)] bg-navy-950">
          {open && <VideoEmbed url={videoUrl} provider={videoProvider} title={captionName} />}
        </div>
      </Modal>
    </>
  );
}
