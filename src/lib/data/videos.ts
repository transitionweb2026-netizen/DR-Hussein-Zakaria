import { createClient } from "@/lib/supabase/server";
import { resolveMediaUrls } from "./resolve-media";

const ID = "00000000-0000-0000-0000-000000000001";

export async function getVideosPageContent() {
  const supabase = await createClient();
  const { data } = await supabase.from("videos_page_content").select("*").eq("id", ID).maybeSingle();
  return data;
}

export async function getAllVideos() {
  const supabase = await createClient();
  const { data } = await supabase.from("videos").select("*").order("sort_order", { ascending: true });
  if (!data) return [];
  const urls = await resolveMediaUrls(supabase, data.map((v) => v.thumbnail_media_id));
  return data.map((v) => ({
    ...v,
    thumbnail_url: v.thumbnail_media_id ? urls[v.thumbnail_media_id] ?? null : null,
  }));
}

export async function getPublishedVideos() {
  const all = await getAllVideos();
  return all.filter((v) => v.status === "published");
}
