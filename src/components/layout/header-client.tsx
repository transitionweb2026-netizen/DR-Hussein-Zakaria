"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Brain, Calendar, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, usePathname } from "@/i18n/navigation";
import { LocaleSwitcher } from "./locale-switcher";
import { cn } from "@/lib/utils";

type NavItem = { href: string; label: string };

export function HeaderClient({
  navItems,
  logoName,
  logoTitle,
  bookAppointmentLabel,
  logoUrl,
}: {
  navItems: NavItem[];
  logoName: string;
  logoTitle: string;
  bookAppointmentLabel: string;
  logoUrl: string | null;
}) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <header
      className={cn(
        "sticky top-0 z-50 bg-gradient-to-r from-brand-400/55 to-brand-500/55 backdrop-blur-xl transition-shadow duration-300",
        scrolled ? "shadow-glow-brand" : "shadow-[0_4px_20px_-8px_rgb(49_107_233_/_0.35)]"
      )}
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8">
        <Link href="/" className="flex items-center gap-3">
          {logoUrl ? (
            <span className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full ring-1 ring-white/30">
              <Image src={logoUrl} alt="" fill sizes="44px" className="object-cover" />
            </span>
          ) : (
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/15 text-white ring-1 ring-white/30 backdrop-blur">
              <Brain className="h-5.5 w-5.5" strokeWidth={1.8} />
            </span>
          )}
          <span className="flex flex-col leading-tight">
            <span className="text-[0.95rem] font-extrabold text-white">{logoName}</span>
            <span className="text-xs font-medium text-white/70">{logoTitle}</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 rounded-pill border border-white/20 bg-white/10 p-1.5 backdrop-blur-xl lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-pill px-4 py-2 text-sm font-semibold transition-all duration-300",
                isActive(item.href)
                  ? "bg-white text-brand-700 shadow-glass-sm"
                  : "text-white/85 hover:text-white"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <LocaleSwitcher />
          <Button
            href="/contact"
            variant="ghost"
            icon={<Calendar className="h-4 w-4" />}
            className="border-transparent bg-white text-brand-700 hover:bg-white/90"
          >
            {bookAppointmentLabel}
          </Button>
        </div>

        <button
          type="button"
          onClick={() => setMobileOpen((v) => !v)}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white backdrop-blur-xl lg:hidden"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <div
        className={cn(
          "grid overflow-hidden border-t border-white/15 bg-brand-600/95 backdrop-blur-xl transition-all duration-300 lg:hidden",
          mobileOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        )}
      >
        <div className="overflow-hidden">
          <div className="flex flex-col gap-1 px-5 py-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors",
                  isActive(item.href) ? "bg-white text-brand-700" : "text-white/85"
                )}
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-2 flex items-center gap-3">
              <LocaleSwitcher className="flex-1 justify-center border-white/25 bg-white/10 text-white" />
            </div>
            <Button
              href="/contact"
              variant="ghost"
              icon={<Calendar className="h-4 w-4" />}
              className="mt-1 w-full border-transparent bg-white text-brand-700 hover:bg-white/90"
            >
              {bookAppointmentLabel}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
