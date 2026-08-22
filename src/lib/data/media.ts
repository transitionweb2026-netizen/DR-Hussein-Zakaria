import { createClient } from "@/lib/supabase/server";
import { mediaPublicUrl } from "@/lib/supabase/media-url";

export async function getAllMedia() {
  const supabase = await createClient();
  const { data } = await supabase.from("media").select("*").order("created_at", { ascending: false });
  if (!data) return [];
  return data.map((m) => ({ ...m, url: mediaPublicUrl(m) }));
}
