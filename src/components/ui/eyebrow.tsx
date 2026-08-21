import { cn } from "@/lib/utils";

export function Eyebrow({
  children,
  align = "start",
  tone = "brand",
  className,
}: {
  children: React.ReactNode;
  align?: "start" | "center";
  tone?: "brand" | "onDark";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-2.5 text-xs font-bold uppercase tracking-[0.18em]",
        tone === "brand" ? "text-brand-600" : "text-brand-200",
        align === "center" && "justify-center",
        className
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", tone === "brand" ? "bg-brand-500" : "bg-brand-300")} />
      {children}
    </div>
  );
}
