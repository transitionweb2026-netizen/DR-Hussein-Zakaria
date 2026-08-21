"use client";

import { useEffect, type ReactNode } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export function Modal({
  open,
  onClose,
  children,
  className,
  labelledBy,
}: {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string;
  labelledBy?: string;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={labelledBy}
      className="motion-safe:animate-backdrop-in fixed inset-0 z-100 flex items-center justify-center bg-navy-950/70 p-4 backdrop-blur-sm sm:p-6"
      onClick={onClose}
    >
      <div
        className={cn(
          "motion-safe:animate-modal-in relative max-h-[88vh] w-full overflow-y-auto rounded-card border-2 border-white/40 bg-glass-strong shadow-glass-lg backdrop-blur-xl",
          className
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute end-4 top-4 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-ink-900 shadow-glass-sm transition-transform duration-300 hover:scale-110"
        >
          <X className="h-4.5 w-4.5" />
        </button>
        {children}
      </div>
    </div>
  );
}
