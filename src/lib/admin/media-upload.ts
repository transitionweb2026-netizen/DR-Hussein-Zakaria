import "server-only";
import { createClient } from "@/lib/supabase/server";

function slugifyFilename(name: string) {
  const dot = name.lastIndexOf(".");
  const base = dot > 0 ? name.slice(0, dot) : name;
  const ext = dot > 0 ? name.slice(dot) : "";
  const slug = base
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 60);
  return `${slug || "file"}${ext.toLowerCase()}`;
}

/**
 * Uploads a File to the `media` Storage bucket under the given folder and
 * records it in the `media` table. Used by every image/video field's
 * Server Action -- the caller is responsible for pointing its own
 * `*_media_id` column at the returned id afterward.
 */
export async function uploadMedia(
  file: File,
  folder: string,
  altText?: { en: string; ar: string }
): Promise<{ id: string; url: string } | { error: string }> {
  if (file.size === 0) return { error: "No file selected." };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = `${folder}/${crypto.randomUUID()}-${slugifyFilename(file.name)}`;

  const { error: uploadError } = await supabase.storage.from("media").upload(path, file, {
    contentType: file.type,
    upsert: false,
  });
  if (uploadError) return { error: uploadError.message };

  const { data: row, error: insertError } = await supabase
    .from("media")
    .insert({
      bucket: "media",
      path,
      folder,
      filename: file.name,
      mime_type: file.type,
      size_bytes: file.size,
      width: null,
      height: null,
      alt_text: altText ?? { en: "", ar: "" },
      uploaded_by: user?.id ?? null,
    })
    .select("id")
    .single();

  if (insertError || !row) {
    await supabase.storage.from("media").remove([path]);
    return { error: insertError?.message ?? "Could not save media record." };
  }

  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  return { id: row.id, url: `${base}/storage/v1/object/public/media/${path}` };
}
