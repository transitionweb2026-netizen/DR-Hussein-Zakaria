"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { uploadMedia } from "@/lib/admin/media-upload";
import { bilingualFromForm, stringFromForm, type ActionState } from "@/lib/admin/form-helpers";

const ID = "00000000-0000-0000-0000-000000000001";
const PATH = "/admin/home/technologies";

export async function updateTechnologiesSection(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("home_technologies_section")
    .update({
      eyebrow: bilingualFromForm(formData, "eyebrow"),
      heading: bilingualFromForm(formData, "heading"),
      description: bilingualFromForm(formData, "description"),
    })
    .eq("id", ID);

  if (error) return { status: "error", message: error.message };
  revalidatePath(PATH);
  return { status: "success", message: "Section heading saved." };
}

export async function addTechnology(formData: FormData) {
  const supabase = await createClient();
  const { count } = await supabase.from("technologies").select("id", { count: "exact", head: true });

  await supabase.from("technologies").insert({
    name: bilingualFromForm(formData, "name"),
    description: bilingualFromForm(formData, "description"),
    icon: stringFromForm(formData, "icon") || "cpu",
    sort_order: count ?? 0,
    status: "draft",
  });
  revalidatePath(PATH);
}

export async function updateTechnology(formData: FormData) {
  const supabase = await createClient();
  await supabase
    .from("technologies")
    .update({
      name: bilingualFromForm(formData, "name"),
      description: bilingualFromForm(formData, "description"),
      icon: stringFromForm(formData, "icon"),
      status: formData.get("published") === "on" ? "published" : "draft",
    })
    .eq("id", stringFromForm(formData, "id"));
  revalidatePath(PATH);
}

export async function deleteTechnology(formData: FormData) {
  const supabase = await createClient();
  await supabase.from("technologies").delete().eq("id", stringFromForm(formData, "id"));
  revalidatePath(PATH);
}

export async function moveTechnology(formData: FormData) {
  const id = stringFromForm(formData, "id");
  const direction = stringFromForm(formData, "direction");
  const supabase = await createClient();

  const { data: items } = await supabase.from("technologies").select("id, sort_order").order("sort_order", { ascending: true });
  if (!items) return;

  const index = items.findIndex((i) => i.id === id);
  const swapIndex = direction === "up" ? index - 1 : index + 1;
  if (index < 0 || swapIndex < 0 || swapIndex >= items.length) return;

  const current = items[index];
  const swap = items[swapIndex];
  await supabase.from("technologies").update({ sort_order: swap.sort_order }).eq("id", current.id);
  await supabase.from("technologies").update({ sort_order: current.sort_order }).eq("id", swap.id);
  revalidatePath(PATH);
}

export async function updateTechnologyImage(formData: FormData) {
  const file = formData.get("file") as File | null;
  const id = stringFromForm(formData, "id");
  if (!file || !id) return;

  const result = await uploadMedia(file, "home/technologies");
  if ("error" in result) return;

  const supabase = await createClient();
  await supabase.from("technologies").update({ image_media_id: result.id }).eq("id", id);
  revalidatePath(PATH);
}
