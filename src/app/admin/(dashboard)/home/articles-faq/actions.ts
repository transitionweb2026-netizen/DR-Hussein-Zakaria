"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { bilingualFromForm, stringFromForm, type ActionState } from "@/lib/admin/form-helpers";

const ID = "00000000-0000-0000-0000-000000000001";
const PATH = "/admin/home/articles-faq";

export async function updateHomeArticlesSection(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("home_articles_section")
    .update({
      eyebrow: bilingualFromForm(formData, "eyebrow"),
      heading: bilingualFromForm(formData, "heading"),
      description: bilingualFromForm(formData, "description"),
      view_all_label: bilingualFromForm(formData, "view_all_label"),
    })
    .eq("id", ID);

  if (error) return { status: "error", message: error.message };
  revalidatePath(PATH);
  return { status: "success", message: "Articles heading saved." };
}

export async function updateHomeFaqSection(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("home_faq_section")
    .update({
      eyebrow: bilingualFromForm(formData, "eyebrow"),
      heading: bilingualFromForm(formData, "heading"),
      description: bilingualFromForm(formData, "description"),
    })
    .eq("id", ID);

  if (error) return { status: "error", message: error.message };
  revalidatePath(PATH);
  return { status: "success", message: "FAQ heading saved." };
}

export async function addFaq(formData: FormData) {
  const supabase = await createClient();
  const { count } = await supabase.from("faqs").select("id", { count: "exact", head: true });

  await supabase.from("faqs").insert({
    question: bilingualFromForm(formData, "question"),
    answer: bilingualFromForm(formData, "answer"),
    sort_order: count ?? 0,
    status: "draft",
  });
  revalidatePath(PATH);
}

export async function updateFaq(formData: FormData) {
  const supabase = await createClient();
  await supabase
    .from("faqs")
    .update({
      question: bilingualFromForm(formData, "question"),
      answer: bilingualFromForm(formData, "answer"),
      status: formData.get("published") === "on" ? "published" : "draft",
    })
    .eq("id", stringFromForm(formData, "id"));
  revalidatePath(PATH);
}

export async function deleteFaq(formData: FormData) {
  const supabase = await createClient();
  await supabase.from("faqs").delete().eq("id", stringFromForm(formData, "id"));
  revalidatePath(PATH);
}

export async function moveFaq(formData: FormData) {
  const id = stringFromForm(formData, "id");
  const direction = stringFromForm(formData, "direction");
  const supabase = await createClient();

  const { data: items } = await supabase.from("faqs").select("id, sort_order").order("sort_order", { ascending: true });
  if (!items) return;

  const index = items.findIndex((i) => i.id === id);
  const swapIndex = direction === "up" ? index - 1 : index + 1;
  if (index < 0 || swapIndex < 0 || swapIndex >= items.length) return;

  const current = items[index];
  const swap = items[swapIndex];
  await supabase.from("faqs").update({ sort_order: swap.sort_order }).eq("id", current.id);
  await supabase.from("faqs").update({ sort_order: current.sort_order }).eq("id", swap.id);
  revalidatePath(PATH);
}
