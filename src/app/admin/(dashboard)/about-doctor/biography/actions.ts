"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { uploadMedia } from "@/lib/admin/media-upload";
import { bilingualFromForm, type ActionState } from "@/lib/admin/form-helpers";

const ID = "00000000-0000-0000-0000-000000000001";
const PATH = "/admin/about-doctor/biography";

export async function updateBiography(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("about_page_content")
    .update({
      biography_eyebrow: bilingualFromForm(formData, "biography_eyebrow"),
      biography_heading: bilingualFromForm(formData, "biography_heading"),
      biography: bilingualFromForm(formData, "biography"),
    })
    .eq("id", ID);

  if (error) return { status: "error", message: error.message };
  return { status: "success", message: "Biography saved." };
}

export async function updateDoctorImage(formData: FormData) {
  const file = formData.get("file") as File | null;
  if (!file) return;

  const result = await uploadMedia(file, "about");
  if ("error" in result) return;

  const supabase = await createClient();
  await supabase.from("about_page_content").update({ doctor_image_media_id: result.id }).eq("id", ID);
  revalidatePath(PATH);
}
