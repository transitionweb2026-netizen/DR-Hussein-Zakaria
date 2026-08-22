"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Brain } from "lucide-react";
import { NAV_GROUPS } from "./nav-config";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-64 shrink-0 flex-col border-e border-admin-border bg-admin-surface">
      <div className="flex h-16 shrink-0 items-center gap-2.5 border-b border-admin-border px-5">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-admin-accent text-white">
          <Brain className="h-4.5 w-4.5" />
        </span>
        <div className="leading-tight">
          <p className="text-sm font-semibold text-admin-text">Dr. Hussein Zakaria</p>
          <p className="text-xs text-admin-muted">Admin Dashboard</p>
        </div>
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {NAV_GROUPS.map((group) => (
          <NavEntry key={group.label} group={group} pathname={pathname} />
        ))}
      </nav>
    </aside>
  );
}

function NavEntry({ group, pathname }: { group: (typeof NAV_GROUPS)[number]; pathname: string }) {
  const Icon = group.icon;
  const items = group.items ?? [];
  const groupActive = items.some((item) => pathname.startsWith(item.href));
  const [open, setOpen] = useState(groupActive);

  if (group.href && !group.items) {
    const active = group.href === "/admin" ? pathname === "/admin" : pathname.startsWith(group.href);
    return (
      <Link
        href={group.href}
        className={cn(
          "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
          active ? "bg-admin-accent/10 text-admin-accent" : "text-admin-text hover:bg-admin-bg"
        )}
      >
        <Icon className="h-4 w-4 shrink-0" />
        {group.label}
      </Link>
    );
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
          groupActive ? "text-admin-accent" : "text-admin-text hover:bg-admin-bg"
        )}
      >
        <Icon className="h-4 w-4 shrink-0" />
        <span className="flex-1 text-start">{group.label}</span>
        <ChevronDown className={cn("h-3.5 w-3.5 shrink-0 transition-transform", open && "rotate-180")} />
      </button>
      {open && (
        <div className="ms-4 mt-1 space-y-0.5 border-s border-admin-border ps-3">
          {items.map((item) => {
            const active = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "block rounded-lg px-3 py-1.5 text-sm transition-colors",
                  active
                    ? "bg-admin-accent/10 font-medium text-admin-accent"
                    : "text-admin-muted hover:bg-admin-bg hover:text-admin-text"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
