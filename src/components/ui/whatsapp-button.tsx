"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { Button } from "./button";
import { cn } from "@/lib/utils";

/** Drop-in replacement for a plain `<Button href="https://wa.me/...">`.
 * With one real number it renders exactly as before -- a plain link, no
 * behavior change. With two, the same button opens a small menu to pick
 * which number to message, instead of every WhatsApp CTA sitewide having
 * to guess which one the visitor wants. */
export function WhatsappButton({
  numbers,
  children,
  size = "md",
  variant = "primary",
  icon,
  className,
}: {
  /** One or two WhatsApp numbers (digits only, with country code, no
   * leading +). Blank/missing entries are dropped automatically. */
  numbers: (string | null | undefined)[];
  children: ReactNode;
  size?: "md" | "lg";
  variant?: "primary" | "ghost" | "outline";
  icon?: ReactNode;
  className?: string;
}) {
  const real = numbers.map((n) => n?.trim()).filter((n): n is string => Boolean(n));
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  if (real.length <= 1) {
    return (
      <Button href={`https://wa.me/${real[0] ?? ""}`} size={size} variant={variant} icon={icon} className={className}>
        {children}
      </Button>
    );
  }

  return (
    <div ref={ref} className="relative isolate">
      <Button type="button" onClick={() => setOpen((v) => !v)} size={size} variant={variant} icon={icon} className={className}>
        {children}
      </Button>
      {open && (
        <div
          role="menu"
          className="absolute start-0 top-full z-30 mt-2 w-52 overflow-hidden rounded-xl border-2 border-line bg-glass-strong shadow-glass-lg backdrop-blur-xl"
        >
          {real.map((n) => (
            <a
              key={n}
              role="menuitem"
              href={`https://wa.me/${n}`}
              target="_blank"
              rel="noopener noreferrer"
              dir="ltr"
              onClick={() => setOpen(false)}
              className={cn(
                "block px-4 py-2.5 text-start text-sm font-semibold text-ink-900 transition-colors hover:bg-brand-50"
              )}
            >
              +{n}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
