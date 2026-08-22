"use client";

import { useFormStatus } from "react-dom";
import { cn } from "@/lib/utils";

export function SaveButton({ label = "Save changes", className }: { label?: string; className?: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className={cn(
        "rounded-lg bg-admin-accent px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-admin-accent-hover disabled:opacity-60",
        className
      )}
    >
      {pending ? "Saving…" : label}
    </button>
  );
}
