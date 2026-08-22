"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { bilingualFromForm, stringFromForm, nullableStringFromForm } from "@/lib/admin/form-helpers";

export async function updatePageSeo(formData: FormData) {
  const supabase = await createClient();
  const pageKey = stringFromForm(formData, "page_key");

  await supabase
    .from("page_seo")
    .update({
      seo_title: bilingualFromForm(formData, "seo_title"),
      meta_description: bilingualFromForm(formData, "meta_description"),
      canonical_url: nullableStringFromForm(formData, "canonical_url"),
      robots: stringFromForm(formData, "robots") || "index,follow",
    })
    .eq("page_key", pageKey);

  revalidatePath("/admin/settings/seo");
}
