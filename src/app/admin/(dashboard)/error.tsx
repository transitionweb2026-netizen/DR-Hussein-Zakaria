"use client";

import { useEffect } from "react";
import { AlertTriangle, RotateCw } from "lucide-react";

export default function DashboardError({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-admin-danger/10 text-admin-danger">
        <AlertTriangle className="h-7 w-7" />
      </span>
      <div>
        <h2 className="text-lg font-bold text-admin-text">Something went wrong</h2>
        <p className="mx-auto mt-1.5 max-w-md text-sm text-admin-muted">
          This screen hit an unexpected error. If it happened while uploading a file, try a smaller one (images
          are capped at 4MB). Otherwise, try again -- your other changes are unaffected.
        </p>
      </div>
      <button
        type="button"
        onClick={() => retry()}
        className="flex items-center gap-1.5 rounded-lg bg-admin-accent px-4 py-2 text-sm font-semibold text-white hover:bg-admin-accent-hover"
      >
        <RotateCw className="h-3.5 w-3.5" />
        Try again
      </button>
    </div>
  );
}
