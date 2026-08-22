"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { stringFromForm } from "@/lib/admin/form-helpers";

const PATH = "/admin/settings/social";

export async function addSocialLink(formData: FormData) {
  const supabase = await createClient();
  const { count } = await supabase.from("social_links").select("id", { count: "exact", head: true });

  await supabase.from("social_links").insert({
    platform: stringFromForm(formData, "platform"),
    url: stringFromForm(formData, "url"),
    icon: stringFromForm(formData, "icon") || stringFromForm(formData, "platform").toLowerCase(),
    is_active: true,
    sort_order: count ?? 0,
  });
  revalidatePath(PATH);
}

export async function updateSocialLink(formData: FormData) {
  const supabase = await createClient();
  await supabase
    .from("social_links")
    .update({
      platform: stringFromForm(formData, "platform"),
      url: stringFromForm(formData, "url"),
      icon: stringFromForm(formData, "icon"),
      is_active: formData.get("is_active") === "on",
    })
    .eq("id", stringFromForm(formData, "id"));
  revalidatePath(PATH);
}

export async function deleteSocialLink(formData: FormData) {
  const supabase = await createClient();
  await supabase.from("social_links").delete().eq("id", stringFromForm(formData, "id"));
  revalidatePath(PATH);
}

export async function moveSocialLink(formData: FormData) {
  const id = stringFromForm(formData, "id");
  const direction = stringFromForm(formData, "direction");
  const supabase = await createClient();

  const { data: items } = await supabase
    .from("social_links")
    .select("id, sort_order")
    .order("sort_order", { ascending: true });
  if (!items) return;

  const index = items.findIndex((i) => i.id === id);
  const swapIndex = direction === "up" ? index - 1 : index + 1;
  if (index < 0 || swapIndex < 0 || swapIndex >= items.length) return;

  const current = items[index];
  const swap = items[swapIndex];
  await supabase.from("social_links").update({ sort_order: swap.sort_order }).eq("id", current.id);
  await supabase.from("social_links").update({ sort_order: current.sort_order }).eq("id", swap.id);
  revalidatePath(PATH);
}
