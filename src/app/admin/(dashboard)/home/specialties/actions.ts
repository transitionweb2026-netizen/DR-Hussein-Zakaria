"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { uploadMedia } from "@/lib/admin/media-upload";
import { bilingualFromForm, stringFromForm, type ActionState } from "@/lib/admin/form-helpers";

const ID = "00000000-0000-0000-0000-000000000001";
const PATH = "/admin/home/specialties";

export async function updateSpecialtiesSection(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("home_specialties_section")
    .update({
      eyebrow: bilingualFromForm(formData, "eyebrow"),
      heading: bilingualFromForm(formData, "heading"),
      view_all_label: bilingualFromForm(formData, "view_all_label"),
    })
    .eq("id", ID);

  if (error) return { status: "error", message: error.message };
  return { status: "success", message: "Section heading saved." };
}

function slugify(input: string) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function addServiceCategory(formData: FormData) {
  const supabase = await createClient();
  const { count } = await supabase.from("service_categories").select("id", { count: "exact", head: true });
  const titleEn = stringFromForm(formData, "title_en");

  await supabase.from("service_categories").insert({
    slug: slugify(titleEn) || `category-${Date.now()}`,
    title: bilingualFromForm(formData, "title"),
    description: bilingualFromForm(formData, "description"),
    icon: stringFromForm(formData, "icon") || "brain",
    sort_order: count ?? 0,
    status: "draft",
  });
  revalidatePath(PATH);
}

export async function updateServiceCategory(formData: FormData) {
  const supabase = await createClient();
  await supabase
    .from("service_categories")
    .update({
      title: bilingualFromForm(formData, "title"),
      description: bilingualFromForm(formData, "description"),
      icon: stringFromForm(formData, "icon"),
      status: formData.get("published") === "on" ? "published" : "draft",
    })
    .eq("id", stringFromForm(formData, "id"));
  revalidatePath(PATH);
}

export async function deleteServiceCategory(formData: FormData) {
  const supabase = await createClient();
  await supabase.from("service_categories").delete().eq("id", stringFromForm(formData, "id"));
  revalidatePath(PATH);
}

export async function moveServiceCategory(formData: FormData) {
  const id = stringFromForm(formData, "id");
  const direction = stringFromForm(formData, "direction");
  const supabase = await createClient();

  const { data: items } = await supabase.from("service_categories").select("id, sort_order").order("sort_order", { ascending: true });
  if (!items) return;

  const index = items.findIndex((i) => i.id === id);
  const swapIndex = direction === "up" ? index - 1 : index + 1;
  if (index < 0 || swapIndex < 0 || swapIndex >= items.length) return;

  const current = items[index];
  const swap = items[swapIndex];
  await supabase.from("service_categories").update({ sort_order: swap.sort_order }).eq("id", current.id);
  await supabase.from("service_categories").update({ sort_order: current.sort_order }).eq("id", swap.id);
  revalidatePath(PATH);
}

export async function updateServiceCategoryImage(formData: FormData) {
  const file = formData.get("file") as File | null;
  const id = stringFromForm(formData, "id");
  if (!file || !id) return;

  const result = await uploadMedia(file, "services/categories");
  if ("error" in result) return;

  const supabase = await createClient();
  await supabase.from("service_categories").update({ image_media_id: result.id }).eq("id", id);
  revalidatePath(PATH);
}
