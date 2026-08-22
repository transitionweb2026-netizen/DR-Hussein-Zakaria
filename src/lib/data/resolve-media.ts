import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/database.types";
import { mediaPublicUrl } from "@/lib/supabase/media-url";

/**
 * Resolves a batch of media_id foreign keys to public URLs in one query.
 * Deliberately avoids PostgREST's `column:media!constraint_name(...)`
 * embed syntax -- that requires knowing Postgres's auto-generated FK
 * constraint names exactly, which can't be verified without a live
 * database connection. A plain `select ... in (...)` is slightly more
 * verbose per call site but has no such fragile dependency.
 */
export async function resolveMediaUrls(
  supabase: SupabaseClient<Database>,
  mediaIds: (string | null | undefined)[]
): Promise<Record<string, string | null>> {
  const ids = [...new Set(mediaIds.filter((id): id is string => Boolean(id)))];
  if (ids.length === 0) return {};

  const { data } = await supabase.from("media").select("id, bucket, path").in("id", ids);
  const map: Record<string, string | null> = {};
  for (const row of data ?? []) {
    map[row.id] = mediaPublicUrl(row);
  }
  return map;
}
