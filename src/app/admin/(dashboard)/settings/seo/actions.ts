"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import {
  bilingualFromForm,
  stringFromForm,
  nullableStringFromForm,
  numberFromForm,
  boolFromForm,
  type ActionState,
} from "@/lib/admin/form-helpers";
import { uploadMedia } from "@/lib/admin/media-upload";

const SETTINGS_ID = "00000000-0000-0000-0000-000000000001";

const VALID_CHANGE_FREQUENCIES = ["always", "hourly", "daily", "weekly", "monthly", "yearly", "never"];

export async function updatePageSeo(formData: FormData) {
  const supabase = await createClient();
  const pageKey = stringFromForm(formData, "page_key");

  const changeFrequency = stringFromForm(formData, "sitemap_change_frequency");

  await supabase
    .from("page_seo")
    .update({
      seo_title: bilingualFromForm(formData, "seo_title"),
      meta_description: bilingualFromForm(formData, "meta_description"),
      canonical_url: nullableStringFromForm(formData, "canonical_url"),
      robots: stringFromForm(formData, "robots") || "index,follow",
      sitemap_priority: Math.min(1, Math.max(0, numberFromForm(formData, "sitemap_priority", 0.7))),
      sitemap_change_frequency: VALID_CHANGE_FREQUENCIES.includes(changeFrequency) ? changeFrequency : "monthly",
    })
    .eq("page_key", pageKey);

  revalidatePath("/admin/settings/seo");
  revalidatePath("/sitemap.xml");
}

/** Site-wide SEO controls that aren't per-page -- backs the Physician
 * JSON-LD's medicalSpecialty and the sitewide "block all indexing"
 * kill-switch (see src/lib/seo.ts, src/app/robots.ts, src/app/sitemap.ts).
 * Reuses the existing site_settings singleton row, same as every other
 * sitewide settings screen (contact info, branding, ...). */
export async function updateSiteSeoSettings(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const supabase = await createClient();

  const { error } = await supabase
    .from("site_settings")
    .update({
      medical_specialty: bilingualFromForm(formData, "medical_specialty"),
      block_all_indexing: boolFromForm(formData, "block_all_indexing"),
    })
    .eq("id", SETTINGS_ID);

  if (error) return { status: "error", message: error.message };

  revalidatePath("/admin/settings/seo");
  revalidatePath("/robots.txt");
  revalidatePath("/sitemap.xml");
  return { status: "success", message: "Site-wide SEO settings saved." };
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
