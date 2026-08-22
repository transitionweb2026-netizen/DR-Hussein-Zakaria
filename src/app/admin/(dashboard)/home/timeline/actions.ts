"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { bilingualFromForm, stringFromForm, type ActionState } from "@/lib/admin/form-helpers";

const ID = "00000000-0000-0000-0000-000000000001";
const PATH = "/admin/home/timeline";

export async function updateTimelineSection(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("home_timeline_section")
    .update({ eyebrow: bilingualFromForm(formData, "eyebrow"), heading: bilingualFromForm(formData, "heading") })
    .eq("id", ID);

  if (error) return { status: "error", message: error.message };
  revalidatePath(PATH);
  return { status: "success", message: "Section heading saved." };
}

export async function addTimelineItem(formData: FormData) {
  const supabase = await createClient();
  const { count } = await supabase.from("career_timeline").select("id", { count: "exact", head: true });

  await supabase.from("career_timeline").insert({
    year: stringFromForm(formData, "year"),
    title: bilingualFromForm(formData, "title"),
    description: bilingualFromForm(formData, "description"),
    icon: stringFromForm(formData, "icon") || "graduation-cap",
    sort_order: count ?? 0,
    status: "draft",
  });
  revalidatePath(PATH);
}

export async function updateTimelineItem(formData: FormData) {
  const supabase = await createClient();
  await supabase
    .from("career_timeline")
    .update({
      year: stringFromForm(formData, "year"),
      title: bilingualFromForm(formData, "title"),
      description: bilingualFromForm(formData, "description"),
      icon: stringFromForm(formData, "icon"),
      status: formData.get("published") === "on" ? "published" : "draft",
    })
    .eq("id", stringFromForm(formData, "id"));
  revalidatePath(PATH);
}

export async function deleteTimelineItem(formData: FormData) {
  const supabase = await createClient();
  await supabase.from("career_timeline").delete().eq("id", stringFromForm(formData, "id"));
  revalidatePath(PATH);
}

export async function moveTimelineItem(formData: FormData) {
  const id = stringFromForm(formData, "id");
  const direction = stringFromForm(formData, "direction");
  const supabase = await createClient();

  const { data: items } = await supabase.from("career_timeline").select("id, sort_order").order("sort_order", { ascending: true });
  if (!items) return;

  const index = items.findIndex((i) => i.id === id);
  const swapIndex = direction === "up" ? index - 1 : index + 1;
  if (index < 0 || swapIndex < 0 || swapIndex >= items.length) return;

  const current = items[index];
  const swap = items[swapIndex];
  await supabase.from("career_timeline").update({ sort_order: swap.sort_order }).eq("id", current.id);
  await supabase.from("career_timeline").update({ sort_order: current.sort_order }).eq("id", swap.id);
  revalidatePath(PATH);
}
