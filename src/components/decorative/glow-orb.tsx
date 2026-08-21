import { cn } from "@/lib/utils";

export function GlowOrb({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute rounded-full bg-brand-300/30 blur-[90px]", className)}
    />
  );
}
