import { createClient } from "@/lib/supabase/server";
import { resolveMediaUrls } from "./resolve-media";

const ID = "00000000-0000-0000-0000-000000000001";

export async function getServicesPageContent() {
  const supabase = await createClient();
  const { data } = await supabase.from("services_page_content").select("*").eq("id", ID).maybeSingle();
  return data;
}

export async function getAllSurgeries() {
  const supabase = await createClient();
  const { data } = await supabase.from("surgeries").select("*").order("sort_order", { ascending: true });
  if (!data) return [];
  const urls = await resolveMediaUrls(supabase, data.map((s) => s.primary_image_media_id));
  return data.map((s) => ({
    ...s,
    primary_image_url: s.primary_image_media_id ? urls[s.primary_image_media_id] ?? null : null,
  }));
}

export async function getPublishedSurgeries() {
  const all = await getAllSurgeries();
  return all.filter((s) => s.status === "published");
}

export async function getSurgeryImages(surgeryId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("surgery_images")
    .select("*")
    .eq("surgery_id", surgeryId)
    .order("sort_order", { ascending: true });
  if (!data) return [];
  const urls = await resolveMediaUrls(supabase, data.map((i) => i.media_id));
  return data.map((i) => ({ ...i, url: urls[i.media_id] ?? null }));
}

export async function getAllSurgeryImagesFor(surgeryIds: string[]) {
  const supabase = await createClient();
  if (surgeryIds.length === 0) return {} as Record<string, { id: string; url: string | null }[]>;
  const { data } = await supabase
    .from("surgery_images")
    .select("*")
    .in("surgery_id", surgeryIds)
    .order("sort_order", { ascending: true });
  if (!data) return {};
  const urls = await resolveMediaUrls(supabase, data.map((i) => i.media_id));
  const byId: Record<string, { id: string; url: string | null }[]> = {};
  for (const row of data) {
    byId[row.surgery_id] ??= [];
    byId[row.surgery_id].push({ id: row.id, url: urls[row.media_id] ?? null });
  }
  return byId;
}
