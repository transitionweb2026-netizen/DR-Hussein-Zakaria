"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { uploadMedia } from "@/lib/admin/media-upload";
import { bilingualFromForm, type ActionState } from "@/lib/admin/form-helpers";

const SETTINGS_ID = "00000000-0000-0000-0000-000000000001";
const PATH = "/admin/settings/branding";

export async function updateBrandingText(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("site_settings")
    .update({
      site_name: bilingualFromForm(formData, "site_name"),
      tagline: bilingualFromForm(formData, "tagline"),
    })
    .eq("id", SETTINGS_ID);

  if (error) return { status: "error", message: error.message };
  return { status: "success", message: "Branding saved." };
}

async function updateMediaField(formData: FormData, column: "logo_media_id" | "favicon_media_id") {
  const file = formData.get("file") as File | null;
  if (!file) return;

  const result = await uploadMedia(file, "global");
  if ("error" in result) return;

  const supabase = await createClient();
  const update = column === "logo_media_id" ? { logo_media_id: result.id } : { favicon_media_id: result.id };
  await supabase.from("site_settings").update(update).eq("id", SETTINGS_ID);
  revalidatePath(PATH);
}

export async function updateLogo(formData: FormData) {
  await updateMediaField(formData, "logo_media_id");
}

export async function updateFavicon(formData: FormData) {
  await updateMediaField(formData, "favicon_media_id");
}
