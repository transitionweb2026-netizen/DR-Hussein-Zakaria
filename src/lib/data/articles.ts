import { createClient } from "@/lib/supabase/server";
import { resolveMediaUrls } from "./resolve-media";

const ID = "00000000-0000-0000-0000-000000000001";

export async function getArticlesPageContent() {
  const supabase = await createClient();
  const { data } = await supabase.from("articles_page_content").select("*").eq("id", ID).maybeSingle();
  return data;
}

export async function getAllArticles() {
  const supabase = await createClient();
  const { data } = await supabase.from("articles").select("*").order("sort_order", { ascending: true });
  if (!data) return [];
  const urls = await resolveMediaUrls(supabase, data.map((a) => a.image_media_id));
  return data.map((a) => ({ ...a, image_url: a.image_media_id ? urls[a.image_media_id] ?? null : null }));
}

export async function getPublishedArticles() {
  const all = await getAllArticles();
  return all.filter((a) => a.status === "published");
}

/** The single is_featured=true row (enforced by a partial unique index),
 * if it's also published; otherwise null so the frontend can fall back
 * gracefully instead of assuming one always exists. */
export async function getFeaturedArticle() {
  const published = await getPublishedArticles();
  return published.find((a) => a.is_featured) ?? null;
}

export async function getNonFeaturedPublishedArticles() {
  const published = await getPublishedArticles();
  return published.filter((a) => !a.is_featured);
}
