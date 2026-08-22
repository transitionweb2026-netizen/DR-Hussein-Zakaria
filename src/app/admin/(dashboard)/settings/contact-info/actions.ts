"use server";

import { createClient } from "@/lib/supabase/server";
import { bilingualFromForm, stringFromForm, type ActionState } from "@/lib/admin/form-helpers";

const SETTINGS_ID = "00000000-0000-0000-0000-000000000001";

export async function updateContactInfo(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const supabase = await createClient();

  const { error } = await supabase
    .from("site_settings")
    .update({
      phone: stringFromForm(formData, "phone"),
      whatsapp_number: stringFromForm(formData, "whatsapp_number"),
      email: stringFromForm(formData, "email"),
      address: bilingualFromForm(formData, "address"),
    })
    .eq("id", SETTINGS_ID);

  if (error) return { status: "error", message: error.message };
  return { status: "success", message: "Contact information saved." };
}
