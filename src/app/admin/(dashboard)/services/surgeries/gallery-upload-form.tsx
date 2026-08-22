"use client";

import { useRef } from "react";
import { Plus } from "lucide-react";

/** Auto-submits on file selection, same self-contained pattern as
 * MediaUploadField -- kept local to this page since it posts an extra
 * hidden `surgery_id` field and renders as a small square "add" tile
 * rather than a labeled upload button. */
export function GalleryUploadForm({
  surgeryId,
  action,
}: {
  surgeryId: string;
  action: (formData: FormData) => Promise<void>;
}) {
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form ref={formRef} action={action} onChange={() => formRef.current?.requestSubmit()} className="flex items-center">
      <input type="hidden" name="surgery_id" value={surgeryId} />
      <label className="flex h-16 w-16 cursor-pointer items-center justify-center rounded-md border border-dashed border-admin-border text-admin-muted hover:bg-admin-bg">
        <Plus className="h-4 w-4" />
        <input type="file" name="file" accept="image/*" className="hidden" />
      </label>
    </form>
  );
}
