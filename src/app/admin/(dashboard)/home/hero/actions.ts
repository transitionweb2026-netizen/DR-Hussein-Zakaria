"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { uploadMedia } from "@/lib/admin/media-upload";
import { bilingualFromForm, type ActionState } from "@/lib/admin/form-helpers";

const ID = "00000000-0000-0000-0000-000000000001";
const PATH = "/admin/home/hero";

export async function updateHomeHero(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("home_hero")
    .update({
      eyebrow: bilingualFromForm(formData, "eyebrow"),
      heading_prefix: bilingualFromForm(formData, "heading_prefix"),
      heading_highlight: bilingualFromForm(formData, "heading_highlight"),
      paragraph: bilingualFromForm(formData, "paragraph"),
      cta_primary_label: bilingualFromForm(formData, "cta_primary_label"),
      cta_secondary_label: bilingualFromForm(formData, "cta_secondary_label"),
      phone_label: bilingualFromForm(formData, "phone_label"),
      social_label: bilingualFromForm(formData, "social_label"),
    })
    .eq("id", ID);

  if (error) return { status: "error", message: error.message };
  revalidatePath(PATH);
  return { status: "success", message: "Hero saved." };
}

export async function updateHeroBackground(formData: FormData) {
  const file = formData.get("file") as File | null;
  if (!file) return;
  const result = await uploadMedia(file, "home");
  if ("error" in result) return;

  const supabase = await createClient();
  await supabase.from("home_hero").update({ background_media_id: result.id }).eq("id", ID);
  revalidatePath(PATH);
}
