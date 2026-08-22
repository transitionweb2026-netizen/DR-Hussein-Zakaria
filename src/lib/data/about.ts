import { createClient } from "@/lib/supabase/server";
import { resolveMediaUrls } from "./resolve-media";

const ID = "00000000-0000-0000-0000-000000000001";

export async function getAboutPageContent() {
  const supabase = await createClient();
  const { data } = await supabase.from("about_page_content").select("*").eq("id", ID).maybeSingle();
  if (!data) return null;
  const urls = await resolveMediaUrls(supabase, [data.doctor_image_media_id]);
  return { ...data, doctor_image_url: data.doctor_image_media_id ? urls[data.doctor_image_media_id] ?? null : null };
}

export async function getAboutTimelineSection() {
  const supabase = await createClient();
  const { data } = await supabase.from("about_timeline_section").select("*").eq("id", ID).maybeSingle();
  return data;
}

export async function getAboutCertificatesSection() {
  const supabase = await createClient();
  const { data } = await supabase.from("about_certificates_section").select("*").eq("id", ID).maybeSingle();
  return data;
}

export async function getAboutSpecialtiesSection() {
  const supabase = await createClient();
  const { data } = await supabase.from("about_specialties_section").select("*").eq("id", ID).maybeSingle();
  return data;
}

export async function getAllAboutEducation() {
  const supabase = await createClient();
  const { data } = await supabase.from("about_education").select("*").order("sort_order", { ascending: true });
  return data ?? [];
}

export async function getPublishedAboutEducation() {
  const all = await getAllAboutEducation();
  return all.filter((e) => e.status === "published");
}
