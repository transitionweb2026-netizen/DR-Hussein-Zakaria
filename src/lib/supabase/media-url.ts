/** Builds a public Storage URL directly (no client/network round-trip
 * needed since the `media` bucket is public-read) from a media row's
 * bucket+path. Returns null when there's no media row at all, so callers
 * can fall back to a placeholder image. */
export function mediaPublicUrl(media: { bucket: string; path: string } | null | undefined): string | null {
  if (!media) return null;
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!base) return null;
  return `${base}/storage/v1/object/public/${media.bucket}/${media.path}`;
}
