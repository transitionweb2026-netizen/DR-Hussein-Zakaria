"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { bilingualFromForm, type ActionState } from "@/lib/admin/form-helpers";

const ID = "00000000-0000-0000-0000-000000000001";
const PATH = "/admin/home/featured-videos";

export async function updateHomeVideosSection(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("home_videos_section")
    .update({
      eyebrow: bilingualFromForm(formData, "eyebrow"),
      heading: bilingualFromForm(formData, "heading"),
      description: bilingualFromForm(formData, "description"),
      view_all_label: bilingualFromForm(formData, "view_all_label"),
    })
    .eq("id", ID);

  if (error) return { status: "error", message: error.message };
  revalidatePath(PATH);
  return { status: "success", message: "Section saved." };
}
