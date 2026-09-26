"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { uploadMedia } from "@/lib/admin/media-upload";
import { bilingualFromForm, type ActionState } from "@/lib/admin/form-helpers";

const ID = "00000000-0000-0000-0000-000000000001";
const PATH = "/admin/services/hero";

export async function updateServicesHeroBackground(formData: FormData) {
  const file = formData.get("file") as File | null;
  if (!file) return;
  const result = await uploadMedia(file, "services");
  if ("error" in result) return;

  const supabase = await createClient();
  await supabase.from("services_page_content").update({ hero_background_media_id: result.id }).eq("id", ID);
  revalidatePath(PATH);
}

export async function updateServicesHero(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("services_page_content")
    .update({
      hero_eyebrow: bilingualFromForm(formData, "hero_eyebrow"),
      hero_heading_prefix: bilingualFromForm(formData, "hero_heading_prefix"),
      hero_heading_highlight: bilingualFromForm(formData, "hero_heading_highlight"),
      hero_paragraph: bilingualFromForm(formData, "hero_paragraph"),
    })
    .eq("id", ID);

  if (error) return { status: "error", message: error.message };
  revalidatePath(PATH);
  return { status: "success", message: "Hero saved." };
}
