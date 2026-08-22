"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { stringFromForm } from "@/lib/admin/form-helpers";

const PATH = "/admin/media";

/** Deleting a file still referenced by a *_media_id column is safe at the
 * database level (every such FK is ON DELETE SET NULL, and every frontend
 * image field already renders a fallback/placeholder for a null URL) -- it
 * just leaves that field blank on the public site until re-uploaded, which
 * is why this screen doesn't attempt reference-counting before allowing
 * delete. */
export async function deleteMedia(formData: FormData) {
  const id = stringFromForm(formData, "id");
  const bucket = stringFromForm(formData, "bucket");
  const path = stringFromForm(formData, "path");
  if (!id) return;

  const supabase = await createClient();
  await supabase.storage.from(bucket || "media").remove([path]);
  await supabase.from("media").delete().eq("id", id);
  revalidatePath(PATH);
}
