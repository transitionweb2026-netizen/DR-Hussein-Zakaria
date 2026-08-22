"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { bilingualFromForm, type ActionState } from "@/lib/admin/form-helpers";

const ID = "00000000-0000-0000-0000-000000000001";
const PATH = "/admin/services/categories";

export async function updateServicesIntro(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("services_page_content")
    .update({
      intro_eyebrow: bilingualFromForm(formData, "intro_eyebrow"),
      intro_heading: bilingualFromForm(formData, "intro_heading"),
      intro_paragraph: bilingualFromForm(formData, "intro_paragraph"),
      view_procedures_label: bilingualFromForm(formData, "view_procedures_label"),
    })
    .eq("id", ID);

  if (error) return { status: "error", message: error.message };
  revalidatePath(PATH);
  return { status: "success", message: "Intro saved." };
}
