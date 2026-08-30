"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { useFormStatus } from "react-dom";
import { ImageOff, Upload } from "lucide-react";

// Matches the server's own cap (next.config.ts, experimental.serverActions.
// bodySizeLimit) minus headroom for multipart encoding overhead -- checked
// here so an oversized file never leaves the browser and never has a
// chance to surface as a raw server crash instead of a real message.
const MAX_FILE_SIZE_BYTES = 4 * 1024 * 1024;

/** Self-contained image field: selecting a file immediately uploads it and
 * updates the target column via its own Server Action (passed in as
 * `action`), independent of whatever other form this is rendered inside.
 * Each call site defines a small dedicated action -- see e.g.
 * settings/branding/actions.ts -- rather than threading upload state
 * through a shared multi-field form. */
export function MediaUploadField({
  label,
  currentUrl,
  action,
  hiddenFields,
  size = 80,
}: {
  label: string;
  currentUrl: string | null;
  action: (formData: FormData) => Promise<void>;
  /** Extra fields the action needs beyond the file itself -- e.g. which
   * row's image this is, for per-item uploads (certificates, surgeries,
   * videos, ...). */
  hiddenFields?: Record<string, string>;
  size?: number;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const [preview, setPreview] = useState<string | null>(currentUrl);
  const [error, setError] = useState<string | null>(null);

  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-admin-text">{label}</label>
      <div className="flex items-center gap-4">
        <div
          className="flex shrink-0 items-center justify-center overflow-hidden rounded-lg border border-admin-border bg-admin-bg"
          style={{ width: size, height: size }}
        >
          {preview ? (
            <Image src={preview} alt="" width={size} height={size} className="h-full w-full object-cover" />
          ) : (
            <ImageOff className="h-6 w-6 text-admin-muted" />
          )}
        </div>
        <div>
          <form
            ref={formRef}
            action={action}
            onChange={() => {
              const input = formRef.current?.querySelector<HTMLInputElement>("input[type=file]");
              const file = input?.files?.[0];
              if (!file) return;

              if (file.size > MAX_FILE_SIZE_BYTES) {
                setError(`That image is too large (max 4MB, this one is ${(file.size / (1024 * 1024)).toFixed(1)}MB). Try a smaller or more compressed file.`);
                if (input) input.value = "";
                return;
              }

              setError(null);
              setPreview(URL.createObjectURL(file));
              formRef.current?.requestSubmit();
            }}
          >
            {Object.entries(hiddenFields ?? {}).map(([k, v]) => (
              <input key={k} type="hidden" name={k} value={v} />
            ))}
            <UploadButton />
          </form>
          {error && <p className="mt-1.5 max-w-xs text-xs text-admin-danger">{error}</p>}
        </div>
      </div>
    </div>
  );
}

function UploadButton() {
  const { pending } = useFormStatus();
  return (
    <label className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-admin-border px-3 py-1.5 text-xs font-semibold text-admin-text hover:bg-admin-bg">
      <Upload className="h-3.5 w-3.5" />
      {pending ? "Uploading…" : "Upload image"}
      <input type="file" name="file" accept="image/*" className="hidden" disabled={pending} />
    </label>
  );
}
