"use client";

import { createClient } from "@/lib/supabase/client";

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
 * Uploads a video File straight from the browser to the "media" Storage
 * bucket, bypassing Next.js Server Actions entirely for the file bytes.
 * Server Actions cap request bodies well below typical video sizes --
 * Vercel's own serverless function limit is a hard 4.5MB that no app
 * config can raise -- so the upload has to go browser -> Supabase Storage
 * directly. Only the resulting URL (a short string) is later sent through
 * a Server Action to update the target row. Mirrors uploadMedia in
 * src/lib/admin/media-upload.ts, but with the browser client (RLS is what
 * actually gates this, not which client -- same is_admin() policies on
 * the "media" bucket already used for images).
 */
export async function uploadVideoFromBrowser(
  file: File,
  folder: string
): Promise<{ id: string; url: string } | { error: string }> {
  if (file.size === 0) return { error: "No file selected." };

  const supabase = createClient();
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
      alt_text: { en: "", ar: "" },
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
