"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { bilingualFromForm, stringFromForm, type ActionState } from "@/lib/admin/form-helpers";

const ID = "00000000-0000-0000-0000-000000000001";
const PATH = "/admin/about-doctor/education";

export async function updateEducationHeading(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("about_page_content")
    .update({ education_heading: bilingualFromForm(formData, "education_heading") })
    .eq("id", ID);

  if (error) return { status: "error", message: error.message };
  revalidatePath(PATH);
  return { status: "success", message: "Heading saved." };
}

export async function addEducation(formData: FormData) {
  const supabase = await createClient();
  const { count } = await supabase.from("about_education").select("id", { count: "exact", head: true });

  await supabase.from("about_education").insert({
    degree: bilingualFromForm(formData, "degree"),
    institution: bilingualFromForm(formData, "institution"),
    year: stringFromForm(formData, "year"),
    sort_order: count ?? 0,
    status: "draft",
  });
  revalidatePath(PATH);
}

export async function updateEducation(formData: FormData) {
  const supabase = await createClient();
  await supabase
    .from("about_education")
    .update({
      degree: bilingualFromForm(formData, "degree"),
      institution: bilingualFromForm(formData, "institution"),
      year: stringFromForm(formData, "year"),
      status: formData.get("published") === "on" ? "published" : "draft",
    })
    .eq("id", stringFromForm(formData, "id"));
  revalidatePath(PATH);
}

export async function deleteEducation(formData: FormData) {
  const supabase = await createClient();
  await supabase.from("about_education").delete().eq("id", stringFromForm(formData, "id"));
  revalidatePath(PATH);
}

export async function moveEducation(formData: FormData) {
  const id = stringFromForm(formData, "id");
  const direction = stringFromForm(formData, "direction");
  const supabase = await createClient();

  const { data: items } = await supabase.from("about_education").select("id, sort_order").order("sort_order", { ascending: true });
  if (!items) return;

  const index = items.findIndex((i) => i.id === id);
  const swapIndex = direction === "up" ? index - 1 : index + 1;
  if (index < 0 || swapIndex < 0 || swapIndex >= items.length) return;

  const current = items[index];
  const swap = items[swapIndex];
  await supabase.from("about_education").update({ sort_order: swap.sort_order }).eq("id", current.id);
  await supabase.from("about_education").update({ sort_order: current.sort_order }).eq("id", swap.id);
  revalidatePath(PATH);
}
