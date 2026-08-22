"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { uploadMedia } from "@/lib/admin/media-upload";
import { bilingualFromForm, type ActionState } from "@/lib/admin/form-helpers";

const ID = "00000000-0000-0000-0000-000000000001";
const PATH = "/admin/home/doctor-message";

export async function updateDoctorMessage(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("home_doctor_message")
    .update({
      eyebrow: bilingualFromForm(formData, "eyebrow"),
      heading_prefix: bilingualFromForm(formData, "heading_prefix"),
      heading_highlight: bilingualFromForm(formData, "heading_highlight"),
      quote: bilingualFromForm(formData, "quote"),
      signature_name: bilingualFromForm(formData, "signature_name"),
      signature_title: bilingualFromForm(formData, "signature_title"),
    })
    .eq("id", ID);

  if (error) return { status: "error", message: error.message };
  return { status: "success", message: "Doctor message saved." };
}

export async function updateDoctorMessagePortrait(formData: FormData) {
  const file = formData.get("file") as File | null;
  if (!file) return;
  const result = await uploadMedia(file, "home");
  if ("error" in result) return;

  const supabase = await createClient();
  await supabase.from("home_doctor_message").update({ portrait_image_media_id: result.id }).eq("id", ID);
  revalidatePath(PATH);
}
