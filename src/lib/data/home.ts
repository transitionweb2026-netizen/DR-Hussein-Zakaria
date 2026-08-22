import { createClient } from "@/lib/supabase/server";
import { resolveMediaUrls } from "./resolve-media";

const ID = "00000000-0000-0000-0000-000000000001";

export async function getHomeHero() {
  const supabase = await createClient();
  const { data } = await supabase.from("home_hero").select("*").eq("id", ID).maybeSingle();
  if (!data) return null;
  const urls = await resolveMediaUrls(supabase, [data.background_media_id]);
  return { ...data, background_url: data.background_media_id ? urls[data.background_media_id] ?? null : null };
}

export async function getHomeAbout() {
  const supabase = await createClient();
  const { data } = await supabase.from("home_about").select("*").eq("id", ID).maybeSingle();
  if (!data) return null;
  const urls = await resolveMediaUrls(supabase, [data.doctor_image_media_id]);
  return { ...data, doctor_image_url: data.doctor_image_media_id ? urls[data.doctor_image_media_id] ?? null : null };
}

export async function getHomeVideoIntro() {
  const supabase = await createClient();
  const { data } = await supabase.from("home_video_intro").select("*").eq("id", ID).maybeSingle();
  if (!data) return null;
  const urls = await resolveMediaUrls(supabase, [data.thumbnail_media_id]);
  return { ...data, thumbnail_url: data.thumbnail_media_id ? urls[data.thumbnail_media_id] ?? null : null };
}

export async function getHomeStatsSection() {
  const supabase = await createClient();
  const { data } = await supabase.from("home_stats_section").select("*").eq("id", ID).maybeSingle();
  return data;
}

export async function getAllHomeStats() {
  const supabase = await createClient();
  const { data } = await supabase.from("home_stats").select("*").order("sort_order", { ascending: true });
  return data ?? [];
}

export async function getPublishedHomeStats() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("home_stats")
    .select("*")
    .eq("status", "published")
    .order("sort_order", { ascending: true });
  return data ?? [];
}

export async function getHomeTimelineSection() {
  const supabase = await createClient();
  const { data } = await supabase.from("home_timeline_section").select("*").eq("id", ID).maybeSingle();
  return data;
}

export async function getHomeCertificatesSection() {
  const supabase = await createClient();
  const { data } = await supabase.from("home_certificates_section").select("*").eq("id", ID).maybeSingle();
  return data;
}

export async function getHomeSpecialtiesSection() {
  const supabase = await createClient();
  const { data } = await supabase.from("home_specialties_section").select("*").eq("id", ID).maybeSingle();
  return data;
}

export async function getHomeDoctorMessage() {
  const supabase = await createClient();
  const { data } = await supabase.from("home_doctor_message").select("*").eq("id", ID).maybeSingle();
  if (!data) return null;
  const urls = await resolveMediaUrls(supabase, [data.portrait_image_media_id]);
  return {
    ...data,
    portrait_image_url: data.portrait_image_media_id ? urls[data.portrait_image_media_id] ?? null : null,
  };
}

// Shared "doctor facts" tables (career_timeline, certificates,
// service_categories) live in src/lib/data/shared-content.ts -- Home and
// the About page both read from there.
