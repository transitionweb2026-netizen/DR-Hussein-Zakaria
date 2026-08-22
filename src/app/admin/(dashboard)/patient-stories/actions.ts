"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { uploadMedia } from "@/lib/admin/media-upload";
import { bilingualFromForm, stringFromForm, type ActionState } from "@/lib/admin/form-helpers";

const ID = "00000000-0000-0000-0000-000000000001";
const PATH = "/admin/patient-stories";

export async function updatePageContent(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("patient_stories_page_content")
    .update({
      hero_eyebrow: bilingualFromForm(formData, "hero_eyebrow"),
      hero_heading_prefix: bilingualFromForm(formData, "hero_heading_prefix"),
      hero_heading_highlight: bilingualFromForm(formData, "hero_heading_highlight"),
      hero_paragraph: bilingualFromForm(formData, "hero_paragraph"),
      intro_eyebrow: bilingualFromForm(formData, "intro_eyebrow"),
      intro_heading: bilingualFromForm(formData, "intro_heading"),
      reviews_intro_eyebrow: bilingualFromForm(formData, "reviews_intro_eyebrow"),
      reviews_intro_heading: bilingualFromForm(formData, "reviews_intro_heading"),
      read_story_label: bilingualFromForm(formData, "read_story_label"),
      label_condition: bilingualFromForm(formData, "label_condition"),
      label_journey: bilingualFromForm(formData, "label_journey"),
      label_outcome: bilingualFromForm(formData, "label_outcome"),
    })
    .eq("id", ID);

  if (error) return { status: "error", message: error.message };
  return { status: "success", message: "Page content saved." };
}

export async function addStory(formData: FormData) {
  const supabase = await createClient();
  const { count } = await supabase.from("patient_stories").select("id", { count: "exact", head: true });

  await supabase.from("patient_stories").insert({
    name: bilingualFromForm(formData, "name"),
    title: bilingualFromForm(formData, "title"),
    condition: { en: "", ar: "" },
    journey: { en: "", ar: "" },
    outcome: { en: "", ar: "" },
    sort_order: count ?? 0,
    status: "draft",
  });
  revalidatePath(PATH);
}

export async function updateStory(formData: FormData) {
  const supabase = await createClient();
  await supabase
    .from("patient_stories")
    .update({
      name: bilingualFromForm(formData, "name"),
      title: bilingualFromForm(formData, "title"),
      condition: bilingualFromForm(formData, "condition"),
      journey: bilingualFromForm(formData, "journey"),
      outcome: bilingualFromForm(formData, "outcome"),
      status: formData.get("published") === "on" ? "published" : "draft",
    })
    .eq("id", stringFromForm(formData, "id"));
  revalidatePath(PATH);
}

export async function deleteStory(formData: FormData) {
  const supabase = await createClient();
  await supabase.from("patient_stories").delete().eq("id", stringFromForm(formData, "id"));
  revalidatePath(PATH);
}

export async function moveStory(formData: FormData) {
  const id = stringFromForm(formData, "id");
  const direction = stringFromForm(formData, "direction");
  const supabase = await createClient();

  const { data: items } = await supabase.from("patient_stories").select("id, sort_order").order("sort_order", { ascending: true });
  if (!items) return;

  const index = items.findIndex((i) => i.id === id);
  const swapIndex = direction === "up" ? index - 1 : index + 1;
  if (index < 0 || swapIndex < 0 || swapIndex >= items.length) return;

  const current = items[index];
  const swap = items[swapIndex];
  await supabase.from("patient_stories").update({ sort_order: swap.sort_order }).eq("id", current.id);
  await supabase.from("patient_stories").update({ sort_order: current.sort_order }).eq("id", swap.id);
  revalidatePath(PATH);
}

export async function updateStoryImage(formData: FormData) {
  const file = formData.get("file") as File | null;
  const id = stringFromForm(formData, "id");
  if (!file || !id) return;

  const result = await uploadMedia(file, "patient-stories");
  if ("error" in result) return;

  const supabase = await createClient();
  await supabase.from("patient_stories").update({ image_media_id: result.id }).eq("id", id);
  revalidatePath(PATH);
}
