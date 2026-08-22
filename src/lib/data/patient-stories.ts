import { createClient } from "@/lib/supabase/server";
import { resolveMediaUrls } from "./resolve-media";

const ID = "00000000-0000-0000-0000-000000000001";

export async function getPatientStoriesPageContent() {
  const supabase = await createClient();
  const { data } = await supabase.from("patient_stories_page_content").select("*").eq("id", ID).maybeSingle();
  return data;
}

export async function getAllPatientStories() {
  const supabase = await createClient();
  const { data } = await supabase.from("patient_stories").select("*").order("sort_order", { ascending: true });
  if (!data) return [];
  const urls = await resolveMediaUrls(supabase, data.map((s) => s.image_media_id));
  return data.map((s) => ({ ...s, image_url: s.image_media_id ? urls[s.image_media_id] ?? null : null }));
}

export async function getPublishedPatientStories() {
  const all = await getAllPatientStories();
  return all.filter((s) => s.status === "published");
}

export async function getAllReviews() {
  const supabase = await createClient();
  const { data } = await supabase.from("reviews").select("*").order("sort_order", { ascending: true });
  if (!data) return [];
  const urls = await resolveMediaUrls(supabase, data.map((r) => r.avatar_media_id));
  return data.map((r) => ({ ...r, avatar_url: r.avatar_media_id ? urls[r.avatar_media_id] ?? null : null }));
}

export async function getPublishedReviews() {
  const all = await getAllReviews();
  return all.filter((r) => r.status === "published");
}
