"use client";

import { Upload, DetailedError } from "tus-js-client";
import { createClient } from "@/lib/supabase/client";

// Supabase's resumable-upload endpoint requires every chunk except the
// last to be exactly this size.
const CHUNK_SIZE = 6 * 1024 * 1024;

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

function friendlyError(err: Error | DetailedError): string {
  const status = err instanceof DetailedError ? err.originalResponse?.getStatus() : undefined;
  if (status === 413) {
    return "This video is larger than the project's Storage upload limit. Raise it in Supabase → Project Settings → Storage (\"Upload file size limit\"), or paste a YouTube/Vimeo link in the Video URL field instead.";
  }
  if (status === 401 || status === 403) {
    return "Your session expired or you're not signed in as an admin. Reload the page and try again.";
  }
  return err.message || "Upload failed. Check your connection and try again.";
}

/**
 * Uploads a video File straight from the browser to the "media" Storage
 * bucket, bypassing Next.js Server Actions entirely for the file bytes.
 * Uses Supabase's resumable (TUS) protocol: the file goes up in 6MB
 * chunks that survive a flaky connection and report real progress, where
 * the plain .upload() method (meant for files up to ~6MB) would send one
 * huge request that just fails. RLS is unchanged -- the same is_admin()
 * policies on the "media" bucket that already govern image uploads apply
 * here too, evaluated against the admin's own access token. Only the
 * resulting URL (a short string) is later sent through a Server Action to
 * update the target row.
 */
export async function uploadVideoFromBrowser(
  file: File,
  folder: string,
  onProgress?: (pct: number) => void
): Promise<{ id: string; url: string } | { error: string }> {
  if (file.size === 0) return { error: "No file selected." };

  const supabase = createClient();
  const [{ data: sessionData }, { data: userData }] = await Promise.all([
    supabase.auth.getSession(),
    supabase.auth.getUser(),
  ]);
  const accessToken = sessionData.session?.access_token;
  if (!accessToken) {
    return { error: "Your session expired. Reload the page and sign in again." };
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  const path = `${folder}/${crypto.randomUUID()}-${slugifyFilename(file.name)}`;

  const uploadError = await new Promise<string | null>((resolve) => {
    const upload = new Upload(file, {
      endpoint: `${supabaseUrl}/storage/v1/upload/resumable`,
      retryDelays: [0, 3000, 5000, 10000, 20000],
      headers: {
        authorization: `Bearer ${accessToken}`,
        apikey: anonKey,
        "x-upsert": "false",
      },
      uploadDataDuringCreation: true,
      removeFingerprintOnSuccess: true,
      chunkSize: CHUNK_SIZE,
      metadata: {
        bucketName: "media",
        objectName: path,
        contentType: file.type || "video/mp4",
        cacheControl: "3600",
      },
      onError: (err) => resolve(friendlyError(err)),
      onProgress: (sent, total) => onProgress?.(total > 0 ? Math.round((sent / total) * 100) : 0),
      onSuccess: () => resolve(null),
    });

    upload.findPreviousUploads().then((previous) => {
      if (previous.length) upload.resumeFromPreviousUpload(previous[0]);
      upload.start();
    });
  });

  if (uploadError) return { error: uploadError };

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
      uploaded_by: userData.user?.id ?? null,
    })
    .select("id")
    .single();

  if (insertError || !row) {
    await supabase.storage.from("media").remove([path]);
    return { error: insertError?.message ?? "Could not save media record." };
  }

  return { id: row.id, url: `${supabaseUrl}/storage/v1/object/public/media/${path}` };
}
