"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { uploadMedia } from "@/lib/admin/media-upload";
import { bilingualFromForm, stringFromForm, type ActionState } from "@/lib/admin/form-helpers";

const ID = "00000000-0000-0000-0000-000000000001";
const PATH = "/admin/home/why-choose";

export async function updateWhyChooseSection(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("home_why_choose_section")
    .update({
      eyebrow: bilingualFromForm(formData, "eyebrow"),
      heading_prefix: bilingualFromForm(formData, "heading_prefix"),
      heading_highlight: bilingualFromForm(formData, "heading_highlight"),
      description: bilingualFromForm(formData, "description"),
    })
    .eq("id", ID);

  if (error) return { status: "error", message: error.message };
  revalidatePath(PATH);
  return { status: "success", message: "Section saved." };
}

export async function updateWhyChooseImage(formData: FormData) {
  const file = formData.get("file") as File | null;
  if (!file) return;
  const result = await uploadMedia(file, "home");
  if ("error" in result) return;

  const supabase = await createClient();
  await supabase.from("home_why_choose_section").update({ image_media_id: result.id }).eq("id", ID);
  revalidatePath(PATH);
}

export async function addReason(formData: FormData) {
  const supabase = await createClient();
  const { count } = await supabase.from("why_choose_reasons").select("id", { count: "exact", head: true });

  await supabase.from("why_choose_reasons").insert({
    title: bilingualFromForm(formData, "title"),
    description: bilingualFromForm(formData, "description"),
    icon: stringFromForm(formData, "icon") || "cpu",
    sort_order: count ?? 0,
    status: "draft",
  });
  revalidatePath(PATH);
}

export async function updateReason(formData: FormData) {
  const supabase = await createClient();
  await supabase
    .from("why_choose_reasons")
    .update({
      title: bilingualFromForm(formData, "title"),
      description: bilingualFromForm(formData, "description"),
      icon: stringFromForm(formData, "icon"),
      status: formData.get("published") === "on" ? "published" : "draft",
    })
    .eq("id", stringFromForm(formData, "id"));
  revalidatePath(PATH);
}

export async function deleteReason(formData: FormData) {
  const supabase = await createClient();
  await supabase.from("why_choose_reasons").delete().eq("id", stringFromForm(formData, "id"));
  revalidatePath(PATH);
}

export async function moveReason(formData: FormData) {
  const id = stringFromForm(formData, "id");
  const direction = stringFromForm(formData, "direction");
  const supabase = await createClient();

  const { data: items } = await supabase.from("why_choose_reasons").select("id, sort_order").order("sort_order", { ascending: true });
  if (!items) return;

  const index = items.findIndex((i) => i.id === id);
  const swapIndex = direction === "up" ? index - 1 : index + 1;
  if (index < 0 || swapIndex < 0 || swapIndex >= items.length) return;

  const current = items[index];
  const swap = items[swapIndex];
  await supabase.from("why_choose_reasons").update({ sort_order: swap.sort_order }).eq("id", current.id);
  await supabase.from("why_choose_reasons").update({ sort_order: current.sort_order }).eq("id", swap.id);
  revalidatePath(PATH);
}
