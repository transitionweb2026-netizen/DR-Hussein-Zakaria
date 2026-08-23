import { createClient } from "@/lib/supabase/server";
import { resolveMediaUrls } from "./resolve-media";

const SETTINGS_ID = "00000000-0000-0000-0000-000000000001";

export async function getSiteSettings() {
  const supabase = await createClient();
  const { data } = await supabase.from("site_settings").select("*").eq("id", SETTINGS_ID).maybeSingle();
  if (!data) return null;

  const urls = await resolveMediaUrls(supabase, [
    data.logo_media_id,
    data.favicon_media_id,
    data.default_hero_bg_media_id,
  ]);

  return {
    ...data,
    logo_url: data.logo_media_id ? urls[data.logo_media_id] ?? null : null,
    favicon_url: data.favicon_media_id ? urls[data.favicon_media_id] ?? null : null,
    default_hero_bg_url: data.default_hero_bg_media_id ? urls[data.default_hero_bg_media_id] ?? null : null,
  };
}

export async function getActiveSocialLinks() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("social_links")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });
  return data ?? [];
}

export async function getAllSocialLinks() {
  const supabase = await createClient();
  const { data } = await supabase.from("social_links").select("*").order("sort_order", { ascending: true });
  return data ?? [];
}

export async function getActiveNavItems() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("nav_items")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });
  return data ?? [];
}

export async function getAllNavItems() {
  const supabase = await createClient();
  const { data } = await supabase.from("nav_items").select("*").order("sort_order", { ascending: true });
  return data ?? [];
}

export async function getPageSeo(pageKey: string) {
  const supabase = await createClient();
  const { data } = await supabase.from("page_seo").select("*").eq("page_key", pageKey).maybeSingle();
  if (!data) return null;

  const urls = await resolveMediaUrls(supabase, [data.og_image_media_id]);
  return {
    ...data,
    og_image_url: data.og_image_media_id ? urls[data.og_image_media_id] ?? null : null,
  };
}

export async function getAllPageSeo() {
  const supabase = await createClient();
  const { data } = await supabase.from("page_seo").select("*").order("page_key", { ascending: true });
  const rows = data ?? [];

  const urls = await resolveMediaUrls(supabase, rows.map((row) => row.og_image_media_id));
  return rows.map((row) => ({
    ...row,
    og_image_url: row.og_image_media_id ? urls[row.og_image_media_id] ?? null : null,
  }));
}

export async function getFinalCtaContent() {
  const supabase = await createClient();
  const { data } = await supabase.from("final_cta_content").select("*").eq("id", SETTINGS_ID).maybeSingle();
  return data;
}

export async function getFooterContent() {
  const supabase = await createClient();
  const { data } = await supabase.from("footer_content").select("*").eq("id", SETTINGS_ID).maybeSingle();
  return data;
}
