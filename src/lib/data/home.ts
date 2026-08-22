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

export async function getHomeTechnologiesSection() {
  const supabase = await createClient();
  const { data } = await supabase.from("home_technologies_section").select("*").eq("id", ID).maybeSingle();
  return data;
}

export async function getAllTechnologies() {
  const supabase = await createClient();
  const { data } = await supabase.from("technologies").select("*").order("sort_order", { ascending: true });
  if (!data) return [];
  const urls = await resolveMediaUrls(supabase, data.map((t) => t.image_media_id));
  return data.map((t) => ({ ...t, image_url: t.image_media_id ? urls[t.image_media_id] ?? null : null }));
}

export async function getPublishedTechnologies() {
  const all = await getAllTechnologies();
  return all.filter((t) => t.status === "published");
}

export async function getHomeWhyChooseSection() {
  const supabase = await createClient();
  const { data } = await supabase.from("home_why_choose_section").select("*").eq("id", ID).maybeSingle();
  if (!data) return null;
  const urls = await resolveMediaUrls(supabase, [data.image_media_id]);
  return { ...data, image_url: data.image_media_id ? urls[data.image_media_id] ?? null : null };
}

export async function getAllWhyChooseReasons() {
  const supabase = await createClient();
  const { data } = await supabase.from("why_choose_reasons").select("*").order("sort_order", { ascending: true });
  return data ?? [];
}

export async function getPublishedWhyChooseReasons() {
  const all = await getAllWhyChooseReasons();
  return all.filter((r) => r.status === "published");
}

export async function getHomeReviewsSection() {
  const supabase = await createClient();
  const { data } = await supabase.from("home_reviews_section").select("*").eq("id", ID).maybeSingle();
  return data;
}

export async function getHomeVideosSection() {
  const supabase = await createClient();
  const { data } = await supabase.from("home_videos_section").select("*").eq("id", ID).maybeSingle();
  return data;
}

export async function getHomeArticlesSection() {
  const supabase = await createClient();
  const { data } = await supabase.from("home_articles_section").select("*").eq("id", ID).maybeSingle();
  return data;
}

export async function getHomeFaqSection() {
  const supabase = await createClient();
  const { data } = await supabase.from("home_faq_section").select("*").eq("id", ID).maybeSingle();
  return data;
}

export async function getAllFaqs() {
  const supabase = await createClient();
  const { data } = await supabase.from("faqs").select("*").order("sort_order", { ascending: true });
  return data ?? [];
}

export async function getPublishedFaqs() {
  const all = await getAllFaqs();
  return all.filter((f) => f.status === "published");
}
