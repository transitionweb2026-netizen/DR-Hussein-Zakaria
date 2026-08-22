"use server";

import { createClient } from "@/lib/supabase/server";
import { bilingualFromForm, type ActionState } from "@/lib/admin/form-helpers";

const ID = "00000000-0000-0000-0000-000000000001";

export async function updateAboutSpecialtiesSection(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("about_specialties_section")
    .update({ eyebrow: bilingualFromForm(formData, "eyebrow"), heading: bilingualFromForm(formData, "heading") })
    .eq("id", ID);

  if (error) return { status: "error", message: error.message };
  return { status: "success", message: "Heading saved." };
}
