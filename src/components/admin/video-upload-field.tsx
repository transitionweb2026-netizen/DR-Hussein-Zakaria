"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Film, Upload, X } from "lucide-react";
import { uploadVideoFromBrowser } from "@/lib/admin/client-video-upload";

// Generous for a short web clip; Supabase's own project Storage limit is
// the real ceiling (unlike images, no fixed Vercel-side number is known
// here), so an oversized file surfaces that real error rather than a
// guessed one -- this is just a sanity cap to avoid a multi-minute stuck
// upload for something wildly too large.
const MAX_VIDEO_SIZE_BYTES = 100 * 1024 * 1024;

/** Direct-to-Storage video file upload, self-contained like
 * MediaUploadField (its own action, independent of any other form on the
 * page). Sits alongside the existing "paste a YouTube/Vimeo URL" field --
 * this is the alternative for a real uploaded file, which becomes an mp4
 * video_url/video_provider on the target row. Forces a router refresh
 * after saving so the sibling manual URL field (an uncontrolled input
 * elsewhere on the page) can't go stale and clobber this on its own next
 * save -- pair with a `key` on that field tied to the row's updated_at. */
export function VideoUploadField({
  label,
  currentUrl,
  currentProvider,
  folder,
  action,
  hiddenFields,
}: {
  label: string;
  currentUrl: string | null;
  currentProvider: string | null;
  /** Media-library folder for the uploaded file -- matches the screen's
   * existing thumbnail folder (e.g. "home", "about", "videos"). */
  folder: string;
  /** Server Action persisting { video_url, video_provider } (both cleared
   * when video_url is empty) on the target row. */
  action: (formData: FormData) => Promise<void>;
  hiddenFields?: Record<string, string>;
}) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isUploadedVideo = currentProvider === "mp4" && !!currentUrl;

  async function callAction(fields: Record<string, string>) {
    const formData = new FormData();
    Object.entries({ ...hiddenFields, ...fields }).forEach(([k, v]) => formData.append(k, v));
    setUploading(true);
    try {
      await action(formData);
      router.refresh();
    } finally {
      setUploading(false);
    }
  }

  async function handleFile(file: File) {
    setError(null);
    if (file.size > MAX_VIDEO_SIZE_BYTES) {
      setError(`That video is too large (max 100MB, this one is ${(file.size / (1024 * 1024)).toFixed(0)}MB).`);
      if (inputRef.current) inputRef.current.value = "";
      return;
    }

    setUploading(true);
    const result = await uploadVideoFromBrowser(file, folder);
    if (inputRef.current) inputRef.current.value = "";
    if ("error" in result) {
      setError(result.error);
      setUploading(false);
      return;
    }
    await callAction({ video_url: result.url, video_provider: "mp4" });
  }

  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-admin-text">{label}</label>

      {isUploadedVideo && (
        <div className="mb-3 flex items-center gap-3">
          <video src={currentUrl ?? undefined} controls muted className="h-24 w-40 rounded-lg border border-admin-border bg-black object-cover" />
          <button
            type="button"
            onClick={() => callAction({ video_url: "", video_provider: "" })}
            disabled={uploading}
            className="flex items-center gap-1.5 rounded-lg border border-admin-border px-3 py-1.5 text-xs font-semibold text-admin-danger hover:bg-admin-bg disabled:opacity-60"
          >
            <X className="h-3.5 w-3.5" />
            Remove video
          </button>
        </div>
      )}

      <label className="flex w-fit cursor-pointer items-center gap-1.5 rounded-lg border border-admin-border px-3 py-1.5 text-xs font-semibold text-admin-text hover:bg-admin-bg">
        {uploading ? <Film className="h-3.5 w-3.5 animate-pulse" /> : <Upload className="h-3.5 w-3.5" />}
        {uploading ? "Uploading…" : isUploadedVideo ? "Replace video file" : "Upload video file"}
        <input
          ref={inputRef}
          type="file"
          accept="video/*"
          className="hidden"
          disabled={uploading}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
          }}
        />
      </label>
      {error && <p className="mt-1.5 max-w-xs text-xs text-admin-danger">{error}</p>}
      <p className="mt-1.5 text-xs text-admin-muted">Or paste a YouTube/Vimeo link in the Video URL field below instead.</p>
    </div>
  );
}
