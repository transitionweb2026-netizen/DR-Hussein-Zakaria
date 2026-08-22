export type VideoProvider = "youtube" | "vimeo" | "mp4" | null;

/** Turns any common YouTube/Vimeo URL shape into an embeddable iframe src.
 * Returns null (rather than throwing) for a malformed URL so callers can
 * fall back to the decorative thumbnail-only presentation instead of
 * breaking the page. */
export function getEmbedUrl(url: string | null | undefined, provider: VideoProvider): string | null {
  if (!url) return null;

  if (provider === "youtube") {
    const patterns = [/youtube\.com\/watch\?v=([^&]+)/, /youtu\.be\/([^?&]+)/, /youtube\.com\/embed\/([^?&]+)/];
    for (const p of patterns) {
      const m = url.match(p);
      if (m) return `https://www.youtube-nocookie.com/embed/${m[1]}?autoplay=1&rel=0`;
    }
    return null;
  }

  if (provider === "vimeo") {
    const m = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
    return m ? `https://player.vimeo.com/video/${m[1]}?autoplay=1` : null;
  }

  return null;
}
