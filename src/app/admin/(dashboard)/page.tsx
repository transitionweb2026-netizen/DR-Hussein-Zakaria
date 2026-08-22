import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/admin/page-header";
import { NAV_GROUPS } from "@/components/admin/nav-config";

export default function AdminDashboardPage() {
  const sections = NAV_GROUPS.filter((g) => g.label !== "Dashboard");

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Every piece of content on the live site is managed from here, organized page by page."
      />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sections.map((section) => {
          const Icon = section.icon;
          const href = section.href ?? section.items?.[0]?.href ?? "/admin";
          return (
            <Link
              key={section.label}
              href={href}
              className="group flex items-center justify-between rounded-xl border border-admin-border bg-admin-surface p-5 transition-colors hover:border-admin-accent"
            >
              <span className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-admin-accent/10 text-admin-accent">
                  <Icon className="h-5 w-5" />
                </span>
                <span className="text-sm font-semibold text-admin-text">{section.label}</span>
              </span>
              <ArrowRight className="h-4 w-4 text-admin-muted transition-transform group-hover:translate-x-0.5" />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
