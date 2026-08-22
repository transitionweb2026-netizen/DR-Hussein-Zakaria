"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { bilingualFromForm, type ActionState } from "@/lib/admin/form-helpers";

const ID = "00000000-0000-0000-0000-000000000001";
const PATH = "/admin/home/final-cta";

export async function updateFinalCta(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("final_cta_content")
    .update({
      title: bilingualFromForm(formData, "title"),
      subtitle: bilingualFromForm(formData, "subtitle"),
      whatsapp_label: bilingualFromForm(formData, "whatsapp_label"),
      call_label: bilingualFromForm(formData, "call_label"),
    })
    .eq("id", ID);

  if (error) return { status: "error", message: error.message };
  revalidatePath(PATH);
  return { status: "success", message: "Final CTA saved." };
}
