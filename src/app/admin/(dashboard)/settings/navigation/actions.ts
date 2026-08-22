"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { bilingualFromForm, stringFromForm, type ActionState } from "@/lib/admin/form-helpers";

const PATH = "/admin/settings/navigation";
const SETTINGS_ID = "00000000-0000-0000-0000-000000000001";

export async function updateBookAppointmentLabel(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("site_settings")
    .update({ book_appointment_label: bilingualFromForm(formData, "book_appointment_label") })
    .eq("id", SETTINGS_ID);

  if (error) return { status: "error", message: error.message };
  revalidatePath(PATH);
  return { status: "success", message: "Saved." };
}

export async function addNavItem(formData: FormData) {
  const supabase = await createClient();
  const { count } = await supabase.from("nav_items").select("id", { count: "exact", head: true });

  await supabase.from("nav_items").insert({
    label: bilingualFromForm(formData, "label"),
    href: stringFromForm(formData, "href"),
    is_active: true,
    sort_order: count ?? 0,
  });
  revalidatePath(PATH);
}

export async function updateNavItem(formData: FormData) {
  const supabase = await createClient();
  const id = stringFromForm(formData, "id");

  await supabase
    .from("nav_items")
    .update({
      label: bilingualFromForm(formData, "label"),
      href: stringFromForm(formData, "href"),
      is_active: formData.get("is_active") === "on",
    })
    .eq("id", id);
  revalidatePath(PATH);
}

export async function deleteNavItem(formData: FormData) {
  const supabase = await createClient();
  await supabase.from("nav_items").delete().eq("id", stringFromForm(formData, "id"));
  revalidatePath(PATH);
}

export async function moveNavItem(formData: FormData) {
  const id = stringFromForm(formData, "id");
  const direction = stringFromForm(formData, "direction");
  const supabase = await createClient();

  const { data: items } = await supabase.from("nav_items").select("id, sort_order").order("sort_order", { ascending: true });
  if (!items) return;

  const index = items.findIndex((i) => i.id === id);
  const swapIndex = direction === "up" ? index - 1 : index + 1;
  if (index < 0 || swapIndex < 0 || swapIndex >= items.length) return;

  const current = items[index];
  const swap = items[swapIndex];

  await supabase.from("nav_items").update({ sort_order: swap.sort_order }).eq("id", current.id);
  await supabase.from("nav_items").update({ sort_order: current.sort_order }).eq("id", swap.id);
  revalidatePath(PATH);
}
