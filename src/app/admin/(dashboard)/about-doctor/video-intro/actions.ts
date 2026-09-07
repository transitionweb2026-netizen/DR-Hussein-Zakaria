"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { uploadMedia } from "@/lib/admin/media-upload";
import { bilingualFromForm, stringFromForm, nullableStringFromForm, type ActionState } from "@/lib/admin/form-helpers";

const ID = "00000000-0000-0000-0000-000000000001";
const PATH = "/admin/about-doctor/video-intro";

function normalizeProvider(value: string): "youtube" | "vimeo" | "mp4" | null {
  return value === "youtube" || value === "vimeo" || value === "mp4" ? value : null;
}

export async function updateAboutVideoIntro(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("about_video_intro")
    .update({
      eyebrow: bilingualFromForm(formData, "eyebrow"),
      heading: bilingualFromForm(formData, "heading"),
      description: bilingualFromForm(formData, "description"),
      duration: stringFromForm(formData, "duration"),
      video_provider: normalizeProvider(stringFromForm(formData, "video_provider")),
      video_url: nullableStringFromForm(formData, "video_url"),
    })
    .eq("id", ID);

  if (error) return { status: "error", message: error.message };
  revalidatePath(PATH);
  return { status: "success", message: "Intro video saved." };
}

/** Companion to updateAboutVideoIntro, but scoped to just video_url/
 * video_provider -- called by VideoUploadField's own self-contained
 * upload flow, so it can't be clobbered by whatever the sibling manual
 * URL field happens to be showing in the main form. */
export async function updateAboutVideoFile(formData: FormData) {
  const supabase = await createClient();
  const videoUrl = nullableStringFromForm(formData, "video_url");
  await supabase
    .from("about_video_intro")
    .update({ video_url: videoUrl, video_provider: videoUrl ? "mp4" : null })
    .eq("id", ID);
  revalidatePath(PATH);
}

export async function updateAboutVideoThumbnail(formData: FormData) {
  const file = formData.get("file") as File | null;
  if (!file) return;
  const result = await uploadMedia(file, "about");
  if ("error" in result) return;

  const supabase = await createClient();
  await supabase.from("about_video_intro").update({ thumbnail_media_id: result.id }).eq("id", ID);
  revalidatePath(PATH);
}
