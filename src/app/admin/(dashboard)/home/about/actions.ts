"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { uploadMedia } from "@/lib/admin/media-upload";
import { bilingualFromForm, stringFromForm, nullableStringFromForm, type ActionState } from "@/lib/admin/form-helpers";

const ID = "00000000-0000-0000-0000-000000000001";
const PATH = "/admin/home/about";

export async function updateHomeAbout(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("home_about")
    .update({
      eyebrow: bilingualFromForm(formData, "eyebrow"),
      heading_prefix: bilingualFromForm(formData, "heading_prefix"),
      heading_highlight: bilingualFromForm(formData, "heading_highlight"),
      paragraph_1: bilingualFromForm(formData, "paragraph_1"),
      paragraph_2: bilingualFromForm(formData, "paragraph_2"),
      cta_label: bilingualFromForm(formData, "cta_label"),
    })
    .eq("id", ID);

  if (error) return { status: "error", message: error.message };
  revalidatePath(PATH);
  return { status: "success", message: "Text saved." };
}

function normalizeProvider(value: string): "youtube" | "vimeo" | "mp4" | null {
  return value === "youtube" || value === "vimeo" || value === "mp4" ? value : null;
}

export async function updateHomeVideo(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const supabase = await createClient();

  const { error: videoError } = await supabase
    .from("home_video_intro")
    .update({
      duration: stringFromForm(formData, "duration"),
      video_provider: normalizeProvider(stringFromForm(formData, "video_provider")),
      video_url: nullableStringFromForm(formData, "video_url"),
    })
    .eq("id", ID);
  if (videoError) return { status: "error", message: videoError.message };

  const { error: captionError } = await supabase
    .from("home_about")
    .update({
      doctor_name: bilingualFromForm(formData, "doctor_name"),
      doctor_title: bilingualFromForm(formData, "doctor_title"),
    })
    .eq("id", ID);
  if (captionError) return { status: "error", message: captionError.message };

  revalidatePath(PATH);
  return { status: "success", message: "Video saved." };
}

export async function updateVideoThumbnail(formData: FormData) {
  const file = formData.get("file") as File | null;
  if (!file) return;
  const result = await uploadMedia(file, "home");
  if ("error" in result) return;

  const supabase = await createClient();
  await supabase.from("home_video_intro").update({ thumbnail_media_id: result.id }).eq("id", ID);
  revalidatePath(PATH);
}
