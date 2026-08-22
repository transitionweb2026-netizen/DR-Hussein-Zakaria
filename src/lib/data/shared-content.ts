import { createClient } from "@/lib/supabase/server";
import { resolveMediaUrls } from "./resolve-media";

/** career_timeline, certificates, and service_categories are shared
 * between the Home page and the About Doctor page -- one source of truth
 * for the doctor's career facts, edited in one place. */

export async function getAllCareerTimeline() {
  const supabase = await createClient();
  const { data } = await supabase.from("career_timeline").select("*").order("sort_order", { ascending: true });
  return data ?? [];
}

export async function getPublishedCareerTimeline() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("career_timeline")
    .select("*")
    .eq("status", "published")
    .order("sort_order", { ascending: true });
  return data ?? [];
}

export async function getAllCertificates() {
  const supabase = await createClient();
  const { data } = await supabase.from("certificates").select("*").order("sort_order", { ascending: true });
  if (!data) return [];
  const urls = await resolveMediaUrls(supabase, data.map((c) => c.image_media_id));
  return data.map((c) => ({ ...c, image_url: c.image_media_id ? urls[c.image_media_id] ?? null : null }));
}

export async function getPublishedCertificates() {
  const all = await getAllCertificates();
  return all.filter((c) => c.status === "published");
}

export async function getAllServiceCategories() {
  const supabase = await createClient();
  const { data } = await supabase.from("service_categories").select("*").order("sort_order", { ascending: true });
  if (!data) return [];
  const urls = await resolveMediaUrls(supabase, data.map((c) => c.image_media_id));
  return data.map((c) => ({ ...c, image_url: c.image_media_id ? urls[c.image_media_id] ?? null : null }));
}

export async function getPublishedServiceCategories() {
  const all = await getAllServiceCategories();
  return all.filter((c) => c.status === "published");
}
