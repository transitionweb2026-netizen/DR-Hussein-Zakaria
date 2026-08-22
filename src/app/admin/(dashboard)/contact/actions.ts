"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { bilingualFromForm, stringFromForm, nullableStringFromForm, type ActionState } from "@/lib/admin/form-helpers";

const ID = "00000000-0000-0000-0000-000000000001";
const PATH = "/admin/contact";

export async function updatePageContent(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("contact_page_content")
    .update({
      hero_eyebrow: bilingualFromForm(formData, "hero_eyebrow"),
      hero_heading_prefix: bilingualFromForm(formData, "hero_heading_prefix"),
      hero_heading_highlight: bilingualFromForm(formData, "hero_heading_highlight"),
      hero_paragraph: bilingualFromForm(formData, "hero_paragraph"),
      form_eyebrow: bilingualFromForm(formData, "form_eyebrow"),
      form_heading: bilingualFromForm(formData, "form_heading"),
      form_name_label: bilingualFromForm(formData, "form_name_label"),
      form_name_placeholder: bilingualFromForm(formData, "form_name_placeholder"),
      form_email_label: bilingualFromForm(formData, "form_email_label"),
      form_email_placeholder: bilingualFromForm(formData, "form_email_placeholder"),
      form_phone_label: bilingualFromForm(formData, "form_phone_label"),
      form_phone_placeholder: bilingualFromForm(formData, "form_phone_placeholder"),
      form_message_label: bilingualFromForm(formData, "form_message_label"),
      form_message_placeholder: bilingualFromForm(formData, "form_message_placeholder"),
      form_submit_label: bilingualFromForm(formData, "form_submit_label"),
      form_sending_label: bilingualFromForm(formData, "form_sending_label"),
      form_success_message: bilingualFromForm(formData, "form_success_message"),
      form_or_label: bilingualFromForm(formData, "form_or_label"),
      map_label: bilingualFromForm(formData, "map_label"),
      map_embed_url: nullableStringFromForm(formData, "map_embed_url"),
    })
    .eq("id", ID);

  if (error) return { status: "error", message: error.message };
  return { status: "success", message: "Page content saved." };
}

export async function updateSubmissionStatus(formData: FormData) {
  const supabase = await createClient();
  const status = stringFromForm(formData, "status");
  if (status !== "read" && status !== "archived" && status !== "new") return;
  await supabase.from("contact_submissions").update({ status }).eq("id", stringFromForm(formData, "id"));
  revalidatePath(PATH);
}

export async function deleteSubmission(formData: FormData) {
  const supabase = await createClient();
  await supabase.from("contact_submissions").delete().eq("id", stringFromForm(formData, "id"));
  revalidatePath(PATH);
}
