"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { bilingualFromForm, type ActionState } from "@/lib/admin/form-helpers";

const SETTINGS_ID = "00000000-0000-0000-0000-000000000001";
const PATH = "/admin/settings/footer";

export async function updateFooterContent(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("footer_content")
    .update({
      description: bilingualFromForm(formData, "description"),
      quick_links_title: bilingualFromForm(formData, "quick_links_title"),
      services_title: bilingualFromForm(formData, "services_title"),
      contact_title: bilingualFromForm(formData, "contact_title"),
      hours_title: bilingualFromForm(formData, "hours_title"),
      weekdays_label: bilingualFromForm(formData, "weekdays_label"),
      weekday_hours: bilingualFromForm(formData, "weekday_hours"),
      weekend_label: bilingualFromForm(formData, "weekend_label"),
      weekend_status: bilingualFromForm(formData, "weekend_status"),
      copyright: bilingualFromForm(formData, "copyright"),
    })
    .eq("id", SETTINGS_ID);

  if (error) return { status: "error", message: error.message };
  revalidatePath(PATH);
  return { status: "success", message: "Footer saved." };
}
