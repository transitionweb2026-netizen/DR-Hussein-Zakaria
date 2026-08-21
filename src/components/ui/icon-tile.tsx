import type { ComponentType, SVGProps } from "react";
import { cn } from "@/lib/utils";

type IconComponent = ComponentType<SVGProps<SVGSVGElement> & { strokeWidth?: number }>;

const sizeMap = {
  xs: {
    wrap: "h-11 w-11",
    icon: "h-5 w-5",
    halo: "-inset-1.5 blur-sm",
    strokeWidth: 1.8,
  },
  sm: {
    wrap: "h-14 w-14",
    icon: "h-6 w-6",
    halo: "-inset-2 blur-md",
    strokeWidth: 1.6,
  },
  md: {
    wrap: "h-20 w-20",
    icon: "h-9 w-9",
    halo: "-inset-3 blur-lg",
    strokeWidth: 1.5,
  },
  lg: {
    wrap: "h-24 w-24",
    icon: "h-11 w-11",
    halo: "-inset-4 blur-xl",
    strokeWidth: 1.4,
  },
};

export function IconTile({
  icon: Icon,
  size = "md",
  tone = "brand",
  className,
}: {
  icon: IconComponent;
  size?: keyof typeof sizeMap;
  tone?: "brand" | "onNavy";
  className?: string;
}) {
  const s = sizeMap[size];
  return (
    <div className={cn("relative shrink-0", s.wrap, className)}>
      <span
        aria-hidden
        className={cn(
          "absolute rounded-full animate-glow-pulse",
          s.halo,
          tone === "brand" ? "bg-brand-400/45" : "bg-white/30"
        )}
      />
      <div
        className={cn(
          "relative flex h-full w-full items-center justify-center rounded-full border-2 backdrop-blur-md",
          tone === "brand" &&
            "border-brand-300/60 bg-glass-strong shadow-[inset_0_1px_0_0_rgb(255_255_255_/_0.85),0_8px_22px_-8px_rgb(49_107_233_/_0.45)]",
          tone === "onNavy" && "border-white/25 bg-white/15 text-white"
        )}
      >
        <Icon
          className={cn(
            s.icon,
            tone === "brand" && "text-brand-600 drop-shadow-[0_0_10px_rgba(49,107,233,0.55)]",
            tone === "onNavy" && "text-white"
          )}
          strokeWidth={s.strokeWidth}
        />
      </div>
    </div>
  );
}
