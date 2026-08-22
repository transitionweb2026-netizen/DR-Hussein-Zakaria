"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { useFormStatus } from "react-dom";
import { ImageOff, Upload } from "lucide-react";

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
        <form
          ref={formRef}
          action={action}
          onChange={() => {
            const file = formRef.current?.querySelector<HTMLInputElement>("input[type=file]")?.files?.[0];
            if (file) setPreview(URL.createObjectURL(file));
            formRef.current?.requestSubmit();
          }}
        >
          {Object.entries(hiddenFields ?? {}).map(([k, v]) => (
            <input key={k} type="hidden" name={k} value={v} />
          ))}
          <UploadButton />
        </form>
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
