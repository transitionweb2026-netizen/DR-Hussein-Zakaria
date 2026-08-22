"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { uploadMedia } from "@/lib/admin/media-upload";
import { bilingualFromForm, stringFromForm, nullableStringFromForm, type ActionState } from "@/lib/admin/form-helpers";

const ID = "00000000-0000-0000-0000-000000000001";
const PATH = "/admin/articles";

function slugify(input: string) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function updatePageContent(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("articles_page_content")
    .update({
      hero_eyebrow: bilingualFromForm(formData, "hero_eyebrow"),
      hero_heading_prefix: bilingualFromForm(formData, "hero_heading_prefix"),
      hero_heading_highlight: bilingualFromForm(formData, "hero_heading_highlight"),
      hero_paragraph: bilingualFromForm(formData, "hero_paragraph"),
      read_more_label: bilingualFromForm(formData, "read_more_label"),
    })
    .eq("id", ID);

  if (error) return { status: "error", message: error.message };
  revalidatePath(PATH);
  return { status: "success", message: "Page content saved." };
}

export async function addArticle(formData: FormData) {
  const supabase = await createClient();
  const { count } = await supabase.from("articles").select("id", { count: "exact", head: true });
  const titleEn = stringFromForm(formData, "title_en");

  await supabase.from("articles").insert({
    slug: `${slugify(titleEn) || "article"}-${Date.now().toString(36)}`,
    category: bilingualFromForm(formData, "category"),
    title: bilingualFromForm(formData, "title"),
    excerpt: bilingualFromForm(formData, "excerpt"),
    content: { en: "", ar: "" },
    is_featured: false,
    published_date: new Date().toISOString().slice(0, 10),
    sort_order: count ?? 0,
    status: "draft",
  });
  revalidatePath(PATH);
}

export async function updateArticle(formData: FormData) {
  const id = stringFromForm(formData, "id");
  const wantsFeatured = formData.get("is_featured") === "on";
  const supabase = await createClient();

  // At most one featured article: checking this one's box un-features
  // whichever article currently holds it, avoiding the partial unique
  // index's constraint violation instead of surfacing it as an error.
  if (wantsFeatured) {
    await supabase.from("articles").update({ is_featured: false }).eq("is_featured", true).neq("id", id);
  }

  await supabase
    .from("articles")
    .update({
      title: bilingualFromForm(formData, "title"),
      category: bilingualFromForm(formData, "category"),
      published_date: stringFromForm(formData, "published_date") || new Date().toISOString().slice(0, 10),
      excerpt: bilingualFromForm(formData, "excerpt"),
      content: bilingualFromForm(formData, "content"),
      author: bilingualFromForm(formData, "author"),
      reading_time: nullableStringFromForm(formData, "reading_time"),
      is_featured: wantsFeatured,
      status: formData.get("published") === "on" ? "published" : "draft",
    })
    .eq("id", id);
  revalidatePath(PATH);
}

export async function deleteArticle(formData: FormData) {
  const supabase = await createClient();
  await supabase.from("articles").delete().eq("id", stringFromForm(formData, "id"));
  revalidatePath(PATH);
}

export async function moveArticle(formData: FormData) {
  const id = stringFromForm(formData, "id");
  const direction = stringFromForm(formData, "direction");
  const supabase = await createClient();

  const { data: items } = await supabase.from("articles").select("id, sort_order").order("sort_order", { ascending: true });
  if (!items) return;

  const index = items.findIndex((i) => i.id === id);
  const swapIndex = direction === "up" ? index - 1 : index + 1;
  if (index < 0 || swapIndex < 0 || swapIndex >= items.length) return;

  const current = items[index];
  const swap = items[swapIndex];
  await supabase.from("articles").update({ sort_order: swap.sort_order }).eq("id", current.id);
  await supabase.from("articles").update({ sort_order: current.sort_order }).eq("id", swap.id);
  revalidatePath(PATH);
}

export async function updateArticleImage(formData: FormData) {
  const file = formData.get("file") as File | null;
  const id = stringFromForm(formData, "id");
  if (!file || !id) return;

  const result = await uploadMedia(file, "articles");
  if ("error" in result) return;

  const supabase = await createClient();
  await supabase.from("articles").update({ image_media_id: result.id }).eq("id", id);
  revalidatePath(PATH);
}
