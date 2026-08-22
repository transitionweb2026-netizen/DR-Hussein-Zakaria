"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { bilingualFromForm, stringFromForm, type ActionState } from "@/lib/admin/form-helpers";

const ID = "00000000-0000-0000-0000-000000000001";
const PATH = "/admin/home/statistics";

export async function updateStatsSection(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("home_stats_section")
    .update({ eyebrow: bilingualFromForm(formData, "eyebrow"), heading: bilingualFromForm(formData, "heading") })
    .eq("id", ID);

  if (error) return { status: "error", message: error.message };
  return { status: "success", message: "Section heading saved." };
}

export async function addStat(formData: FormData) {
  const supabase = await createClient();
  const { count } = await supabase.from("home_stats").select("id", { count: "exact", head: true });

  await supabase.from("home_stats").insert({
    label: bilingualFromForm(formData, "label"),
    value: Number(stringFromForm(formData, "value")) || 0,
    suffix: stringFromForm(formData, "suffix"),
    icon: stringFromForm(formData, "icon") || "users",
    sort_order: count ?? 0,
    status: "draft",
  });
  revalidatePath(PATH);
}

export async function updateStat(formData: FormData) {
  const supabase = await createClient();
  await supabase
    .from("home_stats")
    .update({
      label: bilingualFromForm(formData, "label"),
      value: Number(stringFromForm(formData, "value")) || 0,
      suffix: stringFromForm(formData, "suffix"),
      icon: stringFromForm(formData, "icon"),
      status: formData.get("published") === "on" ? "published" : "draft",
    })
    .eq("id", stringFromForm(formData, "id"));
  revalidatePath(PATH);
}

export async function deleteStat(formData: FormData) {
  const supabase = await createClient();
  await supabase.from("home_stats").delete().eq("id", stringFromForm(formData, "id"));
  revalidatePath(PATH);
}

export async function moveStat(formData: FormData) {
  const id = stringFromForm(formData, "id");
  const direction = stringFromForm(formData, "direction");
  const supabase = await createClient();

  const { data: items } = await supabase.from("home_stats").select("id, sort_order").order("sort_order", { ascending: true });
  if (!items) return;

  const index = items.findIndex((i) => i.id === id);
  const swapIndex = direction === "up" ? index - 1 : index + 1;
  if (index < 0 || swapIndex < 0 || swapIndex >= items.length) return;

  const current = items[index];
  const swap = items[swapIndex];
  await supabase.from("home_stats").update({ sort_order: swap.sort_order }).eq("id", current.id);
  await supabase.from("home_stats").update({ sort_order: current.sort_order }).eq("id", swap.id);
  revalidatePath(PATH);
}
