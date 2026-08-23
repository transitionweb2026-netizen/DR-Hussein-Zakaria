"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { bilingualFromForm, stringFromForm, nullableStringFromForm } from "@/lib/admin/form-helpers";
import { uploadMedia } from "@/lib/admin/media-upload";

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

/** Feeds the existing og_image_media_id column (already in the schema,
 * previously unused by any admin screen) via the same self-contained
 * upload pattern used elsewhere. Used as the page's og:image/twitter:image
 * when set; falls back to the site's default hero background if blank --
 * see buildPageMetadata in src/lib/seo.ts. */
export async function updatePageSeoImage(formData: FormData) {
  const pageKey = stringFromForm(formData, "page_key");
  const file = formData.get("file") as File | null;
  if (!file) return;

  const result = await uploadMedia(file, "seo");
  if ("error" in result) return;

  const supabase = await createClient();
  await supabase.from("page_seo").update({ og_image_media_id: result.id }).eq("page_key", pageKey);
  revalidatePath("/admin/settings/seo");
}
