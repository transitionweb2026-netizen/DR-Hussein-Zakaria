import { createClient } from "@/lib/supabase/server";
import { resolveMediaUrls } from "./resolve-media";

const ID = "00000000-0000-0000-0000-000000000001";

export async function getContactPageContent() {
  const supabase = await createClient();
  const { data } = await supabase.from("contact_page_content").select("*").eq("id", ID).maybeSingle();
  if (!data) return null;
  const urls = await resolveMediaUrls(supabase, [data.hero_background_media_id]);
  return { ...data, hero_background_url: data.hero_background_media_id ? urls[data.hero_background_media_id] ?? null : null };
}

/** Admin-only (RLS restricts SELECT on contact_submissions to admins). */
export async function getContactSubmissions() {
  const supabase = await createClient();
  const { data } = await supabase.from("contact_submissions").select("*").order("created_at", { ascending: false });
  return data ?? [];
}
