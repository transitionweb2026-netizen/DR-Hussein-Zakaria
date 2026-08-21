"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

const LOCALES = [
  { code: "en", label: "EN" },
  { code: "ar", label: "AR" },
] as const;

export function LocaleSwitcher({ className }: { className?: string }) {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div
      role="group"
      aria-label="Switch language"
      className={cn(
        "inline-flex h-10 items-center gap-0.5 rounded-pill border border-white/25 bg-white/10 p-1 backdrop-blur-xl",
        className
      )}
    >
      {LOCALES.map(({ code, label }) => {
        const active = locale === code;
        return (
          <button
            key={code}
            type="button"
            onClick={() => !active && router.replace(pathname, { locale: code })}
            aria-current={active ? "true" : undefined}
            className={cn(
              "flex h-full min-w-9 items-center justify-center rounded-pill px-2.5 text-xs font-bold tracking-wide transition-all duration-300",
              active ? "bg-white text-brand-700 shadow-glass-sm" : "text-white/70 hover:text-white"
            )}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
