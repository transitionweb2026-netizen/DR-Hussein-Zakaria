"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { uploadMedia } from "@/lib/admin/media-upload";
import { bilingualFromForm, stringFromForm, nullableStringFromForm, type ActionState } from "@/lib/admin/form-helpers";

const ID = "00000000-0000-0000-0000-000000000001";
const PATH = "/admin/videos";

export async function updatePageContent(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("videos_page_content")
    .update({
      hero_eyebrow: bilingualFromForm(formData, "hero_eyebrow"),
      hero_heading_prefix: bilingualFromForm(formData, "hero_heading_prefix"),
      hero_heading_highlight: bilingualFromForm(formData, "hero_heading_highlight"),
      hero_paragraph: bilingualFromForm(formData, "hero_paragraph"),
      intro_eyebrow: bilingualFromForm(formData, "intro_eyebrow"),
      intro_heading: bilingualFromForm(formData, "intro_heading"),
      intro_description: bilingualFromForm(formData, "intro_description"),
    })
    .eq("id", ID);

  if (error) return { status: "error", message: error.message };
  return { status: "success", message: "Page content saved." };
}

function normalizeProvider(value: string): "youtube" | "vimeo" | "mp4" | null {
  return value === "youtube" || value === "vimeo" || value === "mp4" ? value : null;
}

export async function addVideo(formData: FormData) {
  const supabase = await createClient();
  const { count } = await supabase.from("videos").select("id", { count: "exact", head: true });

  await supabase.from("videos").insert({
    title: bilingualFromForm(formData, "title"),
    description: bilingualFromForm(formData, "description"),
    duration: stringFromForm(formData, "duration"),
    sort_order: count ?? 0,
    status: "draft",
  });
  revalidatePath(PATH);
}

export async function updateVideo(formData: FormData) {
  const supabase = await createClient();
  await supabase
    .from("videos")
    .update({
      title: bilingualFromForm(formData, "title"),
      description: bilingualFromForm(formData, "description"),
      duration: stringFromForm(formData, "duration"),
      video_provider: normalizeProvider(stringFromForm(formData, "video_provider")),
      video_url: nullableStringFromForm(formData, "video_url"),
      status: formData.get("published") === "on" ? "published" : "draft",
    })
    .eq("id", stringFromForm(formData, "id"));
  revalidatePath(PATH);
}

export async function deleteVideo(formData: FormData) {
  const supabase = await createClient();
  await supabase.from("videos").delete().eq("id", stringFromForm(formData, "id"));
  revalidatePath(PATH);
}

export async function moveVideo(formData: FormData) {
  const id = stringFromForm(formData, "id");
  const direction = stringFromForm(formData, "direction");
  const supabase = await createClient();

  const { data: items } = await supabase.from("videos").select("id, sort_order").order("sort_order", { ascending: true });
  if (!items) return;

  const index = items.findIndex((i) => i.id === id);
  const swapIndex = direction === "up" ? index - 1 : index + 1;
  if (index < 0 || swapIndex < 0 || swapIndex >= items.length) return;

  const current = items[index];
  const swap = items[swapIndex];
  await supabase.from("videos").update({ sort_order: swap.sort_order }).eq("id", current.id);
  await supabase.from("videos").update({ sort_order: current.sort_order }).eq("id", swap.id);
  revalidatePath(PATH);
}

export async function updateVideoThumbnail(formData: FormData) {
  const file = formData.get("file") as File | null;
  const id = stringFromForm(formData, "id");
  if (!file || !id) return;

  const result = await uploadMedia(file, "videos");
  if ("error" in result) return;

  const supabase = await createClient();
  await supabase.from("videos").update({ thumbnail_media_id: result.id }).eq("id", id);
  revalidatePath(PATH);
}
