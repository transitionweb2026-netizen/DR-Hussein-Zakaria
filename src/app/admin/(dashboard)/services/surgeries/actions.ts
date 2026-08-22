"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { uploadMedia } from "@/lib/admin/media-upload";
import { parseFaqLines } from "@/lib/admin/faq-format";
import { bilingualFromForm, stringFromForm, nullableStringFromForm, type ActionState } from "@/lib/admin/form-helpers";

const ID = "00000000-0000-0000-0000-000000000001";
const PATH = "/admin/services/surgeries";

function normalizeProvider(value: string): "youtube" | "vimeo" | "mp4" | null {
  return value === "youtube" || value === "vimeo" || value === "mp4" ? value : null;
}

function slugify(input: string) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function updateDetailedHeading(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("services_page_content")
    .update({
      detailed_heading: bilingualFromForm(formData, "detailed_heading"),
      symptoms_label: bilingualFromForm(formData, "symptoms_label"),
      treatment_label: bilingualFromForm(formData, "treatment_label"),
    })
    .eq("id", ID);

  if (error) return { status: "error", message: error.message };
  revalidatePath(PATH);
  return { status: "success", message: "Heading saved." };
}

export async function addSurgery(formData: FormData) {
  const categoryId = stringFromForm(formData, "category_id");
  const titleEn = stringFromForm(formData, "title_en");
  const supabase = await createClient();
  const { count } = await supabase.from("surgeries").select("id", { count: "exact", head: true }).eq("category_id", categoryId);

  await supabase.from("surgeries").insert({
    category_id: categoryId,
    slug: `${slugify(titleEn) || "surgery"}-${Date.now().toString(36)}`,
    title: bilingualFromForm(formData, "title"),
    short_description: bilingualFromForm(formData, "short_description"),
    full_description: { en: "", ar: "" },
    sort_order: count ?? 0,
    status: "draft",
  });
  revalidatePath(PATH);
}

export async function updateSurgery(formData: FormData) {
  const supabase = await createClient();
  await supabase
    .from("surgeries")
    .update({
      category_id: stringFromForm(formData, "category_id"),
      title: bilingualFromForm(formData, "title"),
      short_description: bilingualFromForm(formData, "short_description"),
      full_description: bilingualFromForm(formData, "full_description"),
      symptoms: bilingualFromForm(formData, "symptoms"),
      treatment_info: bilingualFromForm(formData, "treatment_info"),
      faq: parseFaqLines(stringFromForm(formData, "faq_en"), stringFromForm(formData, "faq_ar")),
      video_provider: normalizeProvider(stringFromForm(formData, "video_provider")),
      video_url: nullableStringFromForm(formData, "video_url"),
      status: formData.get("published") === "on" ? "published" : "draft",
    })
    .eq("id", stringFromForm(formData, "id"));
  revalidatePath(PATH);
}

export async function deleteSurgery(formData: FormData) {
  const supabase = await createClient();
  await supabase.from("surgeries").delete().eq("id", stringFromForm(formData, "id"));
  revalidatePath(PATH);
}

/** Reorders within the surgery's own category only -- the public page groups
 * and orders surgeries per-category, so cross-category sort_order swaps
 * would be meaningless. */
export async function moveSurgery(formData: FormData) {
  const id = stringFromForm(formData, "id");
  const direction = stringFromForm(formData, "direction");
  const supabase = await createClient();

  const { data: current } = await supabase.from("surgeries").select("id, category_id, sort_order").eq("id", id).maybeSingle();
  if (!current) return;

  const { data: items } = await supabase
    .from("surgeries")
    .select("id, sort_order")
    .eq("category_id", current.category_id)
    .order("sort_order", { ascending: true });
  if (!items) return;

  const index = items.findIndex((i) => i.id === id);
  const swapIndex = direction === "up" ? index - 1 : index + 1;
  if (index < 0 || swapIndex < 0 || swapIndex >= items.length) return;

  const swap = items[swapIndex];
  await supabase.from("surgeries").update({ sort_order: swap.sort_order }).eq("id", current.id);
  await supabase.from("surgeries").update({ sort_order: current.sort_order }).eq("id", swap.id);
  revalidatePath(PATH);
}

export async function updateSurgeryImage(formData: FormData) {
  const file = formData.get("file") as File | null;
  const id = stringFromForm(formData, "id");
  if (!file || !id) return;

  const result = await uploadMedia(file, "services/surgeries");
  if ("error" in result) return;

  const supabase = await createClient();
  await supabase.from("surgeries").update({ primary_image_media_id: result.id }).eq("id", id);
  revalidatePath(PATH);
}

export async function addGalleryImage(formData: FormData) {
  const file = formData.get("file") as File | null;
  const surgeryId = stringFromForm(formData, "surgery_id");
  if (!file || !surgeryId) return;

  const result = await uploadMedia(file, "services/surgeries/gallery");
  if ("error" in result) return;

  const supabase = await createClient();
  const { count } = await supabase.from("surgery_images").select("id", { count: "exact", head: true }).eq("surgery_id", surgeryId);
  await supabase.from("surgery_images").insert({ surgery_id: surgeryId, media_id: result.id, sort_order: count ?? 0 });
  revalidatePath(PATH);
}

export async function deleteGalleryImage(formData: FormData) {
  const supabase = await createClient();
  await supabase.from("surgery_images").delete().eq("id", stringFromForm(formData, "id"));
  revalidatePath(PATH);
}
