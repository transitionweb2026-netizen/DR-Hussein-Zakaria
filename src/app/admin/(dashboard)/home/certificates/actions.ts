"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { uploadMedia } from "@/lib/admin/media-upload";
import { bilingualFromForm, stringFromForm, type ActionState } from "@/lib/admin/form-helpers";

const ID = "00000000-0000-0000-0000-000000000001";
const PATH = "/admin/home/certificates";

export async function updateCertificatesSection(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("home_certificates_section")
    .update({ eyebrow: bilingualFromForm(formData, "eyebrow"), heading: bilingualFromForm(formData, "heading") })
    .eq("id", ID);

  if (error) return { status: "error", message: error.message };
  revalidatePath(PATH);
  return { status: "success", message: "Section heading saved." };
}

export async function addCertificate(formData: FormData) {
  const supabase = await createClient();
  const { count } = await supabase.from("certificates").select("id", { count: "exact", head: true });

  await supabase.from("certificates").insert({
    title: bilingualFromForm(formData, "title"),
    issuer: bilingualFromForm(formData, "issuer"),
    year: stringFromForm(formData, "year"),
    sort_order: count ?? 0,
    status: "draft",
  });
  revalidatePath(PATH);
}

export async function updateCertificate(formData: FormData) {
  const supabase = await createClient();
  await supabase
    .from("certificates")
    .update({
      title: bilingualFromForm(formData, "title"),
      issuer: bilingualFromForm(formData, "issuer"),
      year: stringFromForm(formData, "year"),
      status: formData.get("published") === "on" ? "published" : "draft",
    })
    .eq("id", stringFromForm(formData, "id"));
  revalidatePath(PATH);
}

export async function deleteCertificate(formData: FormData) {
  const supabase = await createClient();
  await supabase.from("certificates").delete().eq("id", stringFromForm(formData, "id"));
  revalidatePath(PATH);
}

export async function moveCertificate(formData: FormData) {
  const id = stringFromForm(formData, "id");
  const direction = stringFromForm(formData, "direction");
  const supabase = await createClient();

  const { data: items } = await supabase.from("certificates").select("id, sort_order").order("sort_order", { ascending: true });
  if (!items) return;

  const index = items.findIndex((i) => i.id === id);
  const swapIndex = direction === "up" ? index - 1 : index + 1;
  if (index < 0 || swapIndex < 0 || swapIndex >= items.length) return;

  const current = items[index];
  const swap = items[swapIndex];
  await supabase.from("certificates").update({ sort_order: swap.sort_order }).eq("id", current.id);
  await supabase.from("certificates").update({ sort_order: current.sort_order }).eq("id", swap.id);
  revalidatePath(PATH);
}

export async function updateCertificateImage(formData: FormData) {
  const file = formData.get("file") as File | null;
  const id = stringFromForm(formData, "id");
  if (!file || !id) return;

  const result = await uploadMedia(file, "home/certificates");
  if ("error" in result) return;

  const supabase = await createClient();
  await supabase.from("certificates").update({ image_media_id: result.id }).eq("id", id);
  revalidatePath(PATH);
}
