"use client";

import { getEmbedUrl, type VideoProvider } from "@/lib/video-embed";

/** Pure playback rendering -- an iframe for youtube/vimeo, a native
 * <video> for a direct mp4, or nothing if there's no usable URL (the
 * caller is responsible for the thumbnail/decorative fallback in that
 * case, e.g. when a video item hasn't been given a real video yet). */
export function VideoEmbed({
  url,
  provider,
  title,
}: {
  url: string | null | undefined;
  provider: VideoProvider;
  title: string;
}) {
  if (!url) return null;

  if (provider === "mp4") {
    return <video src={url} controls autoPlay className="h-full w-full" aria-label={title} />;
  }

  const embedUrl = getEmbedUrl(url, provider);
  if (!embedUrl) return null;

  return (
    <iframe
      src={embedUrl}
      title={title}
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
      className="h-full w-full"
    />
  );
}
