import { Eyebrow } from "./eyebrow";
import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  prefix,
  highlight,
  suffix,
  paragraph,
  align = "start",
  tone = "brand",
  className,
}: {
  eyebrow?: string;
  prefix?: string;
  highlight?: string;
  suffix?: string;
  paragraph?: string;
  align?: "start" | "center";
  tone?: "brand" | "onNavy";
  className?: string;
}) {
  return (
    <div className={cn(align === "center" ? "text-center" : "text-start", className)}>
      {eyebrow && (
        <Eyebrow align={align} className="mb-4">
          {eyebrow}
        </Eyebrow>
      )}
      <h2
        className={cn(
          "text-balance font-extrabold leading-[1.12] tracking-tight text-3xl sm:text-4xl lg:text-[2.75rem]",
          tone === "onNavy" ? "text-white" : "text-ink-900"
        )}
      >
        {prefix} {highlight && <span className="text-brand-500">{highlight}</span>} {suffix}
      </h2>
      {paragraph && (
        <p
          className={cn(
            "mt-4 max-w-xl text-[0.98rem] leading-relaxed",
            align === "center" && "mx-auto",
            tone === "onNavy" ? "text-white/70" : "text-ink-600"
          )}
        >
          {paragraph}
        </p>
      )}
    </div>
  );
}
