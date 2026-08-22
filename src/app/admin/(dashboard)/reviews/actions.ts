"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { uploadMedia } from "@/lib/admin/media-upload";
import { bilingualFromForm, stringFromForm, nullableStringFromForm } from "@/lib/admin/form-helpers";

const PATH = "/admin/reviews";

function clampRating(value: string): number {
  const n = Number(value);
  if (!Number.isFinite(n)) return 5;
  return Math.min(5, Math.max(1, Math.round(n)));
}

export async function addReview(formData: FormData) {
  const supabase = await createClient();
  const { count } = await supabase.from("reviews").select("id", { count: "exact", head: true });

  await supabase.from("reviews").insert({
    name: bilingualFromForm(formData, "name"),
    role: bilingualFromForm(formData, "role"),
    quote: bilingualFromForm(formData, "quote"),
    rating: 5,
    sort_order: count ?? 0,
    status: "draft",
  });
  revalidatePath(PATH);
}

export async function updateReview(formData: FormData) {
  const supabase = await createClient();
  await supabase
    .from("reviews")
    .update({
      name: bilingualFromForm(formData, "name"),
      role: bilingualFromForm(formData, "role"),
      quote: bilingualFromForm(formData, "quote"),
      rating: clampRating(stringFromForm(formData, "rating")),
      review_date: nullableStringFromForm(formData, "review_date"),
      source: nullableStringFromForm(formData, "source"),
      status: formData.get("published") === "on" ? "published" : "draft",
    })
    .eq("id", stringFromForm(formData, "id"));
  revalidatePath(PATH);
}

export async function deleteReview(formData: FormData) {
  const supabase = await createClient();
  await supabase.from("reviews").delete().eq("id", stringFromForm(formData, "id"));
  revalidatePath(PATH);
}

export async function moveReview(formData: FormData) {
  const id = stringFromForm(formData, "id");
  const direction = stringFromForm(formData, "direction");
  const supabase = await createClient();

  const { data: items } = await supabase.from("reviews").select("id, sort_order").order("sort_order", { ascending: true });
  if (!items) return;

  const index = items.findIndex((i) => i.id === id);
  const swapIndex = direction === "up" ? index - 1 : index + 1;
  if (index < 0 || swapIndex < 0 || swapIndex >= items.length) return;

  const current = items[index];
  const swap = items[swapIndex];
  await supabase.from("reviews").update({ sort_order: swap.sort_order }).eq("id", current.id);
  await supabase.from("reviews").update({ sort_order: current.sort_order }).eq("id", swap.id);
  revalidatePath(PATH);
}

export async function updateReviewAvatar(formData: FormData) {
  const file = formData.get("file") as File | null;
  const id = stringFromForm(formData, "id");
  if (!file || !id) return;

  const result = await uploadMedia(file, "reviews");
  if ("error" in result) return;

  const supabase = await createClient();
  await supabase.from("reviews").update({ avatar_media_id: result.id }).eq("id", id);
  revalidatePath(PATH);
}
