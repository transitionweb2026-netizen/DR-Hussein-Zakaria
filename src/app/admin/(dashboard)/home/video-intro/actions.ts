"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { uploadMedia } from "@/lib/admin/media-upload";
import { bilingualFromForm, stringFromForm, nullableStringFromForm, type ActionState } from "@/lib/admin/form-helpers";

const ID = "00000000-0000-0000-0000-000000000001";
const PATH = "/admin/home/video-intro";

export async function updateHomeVideoIntro(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("home_video_intro")
    .update({
      eyebrow: bilingualFromForm(formData, "eyebrow"),
      heading: bilingualFromForm(formData, "heading"),
      description: bilingualFromForm(formData, "description"),
      duration: stringFromForm(formData, "duration"),
      video_url: nullableStringFromForm(formData, "video_url"),
    })
    .eq("id", ID);

  if (error) return { status: "error", message: error.message };
  return { status: "success", message: "Video intro saved." };
}

export async function updateVideoIntroThumbnail(formData: FormData) {
  const file = formData.get("file") as File | null;
  if (!file) return;
  const result = await uploadMedia(file, "home");
  if ("error" in result) return;

  const supabase = await createClient();
  await supabase.from("home_video_intro").update({ thumbnail_media_id: result.id }).eq("id", ID);
  revalidatePath(PATH);
}
