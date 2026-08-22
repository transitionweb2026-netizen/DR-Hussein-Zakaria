"use server";

import { createClient } from "@/lib/supabase/server";
import { bilingualFromForm, type ActionState } from "@/lib/admin/form-helpers";

const ID = "00000000-0000-0000-0000-000000000001";

export async function updateAboutHero(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("about_page_content")
    .update({
      hero_eyebrow: bilingualFromForm(formData, "hero_eyebrow"),
      hero_heading_prefix: bilingualFromForm(formData, "hero_heading_prefix"),
      hero_heading_highlight: bilingualFromForm(formData, "hero_heading_highlight"),
      hero_paragraph: bilingualFromForm(formData, "hero_paragraph"),
      hero_cta_label: bilingualFromForm(formData, "hero_cta_label"),
    })
    .eq("id", ID);

  if (error) return { status: "error", message: error.message };
  return { status: "success", message: "Hero saved." };
}
