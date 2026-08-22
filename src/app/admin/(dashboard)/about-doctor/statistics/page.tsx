import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/admin/page-header";
import { AdminForm } from "@/components/admin/admin-form";
import { TranslatableInput } from "@/components/admin/translatable-input";
import { getAboutStatsSection } from "@/lib/data/about";
import { getAllHomeStats } from "@/lib/data/home";
import { updateAboutStatsSection } from "./actions";

export default async function AboutStatisticsPage() {
  const [section, stats] = await Promise.all([getAboutStatsSection(), getAllHomeStats()]);

  return (
    <div className="max-w-3xl space-y-8">
      <PageHeader
        title="About Doctor — Statistics"
        description="This page's own section heading. The statistics themselves are the same shared numbers shown on the Home page and managed in one place."
      />

      <AdminForm action={updateAboutStatsSection}>
        <TranslatableInput name="eyebrow" label="Eyebrow" defaultValue={section?.eyebrow} />
        <TranslatableInput name="heading" label="Heading" defaultValue={section?.heading} />
        <TranslatableInput name="description" label="Supporting text (optional)" defaultValue={section?.description} multiline rows={2} />
      </AdminForm>

      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-admin-text">Statistics (shared)</h2>
          <Link href="/admin/home/statistics" className="flex items-center gap-1 text-xs font-semibold text-admin-accent hover:underline">
            Manage statistics in Home → Statistics
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
        <div className="space-y-2">
          {stats.map((stat) => (
            <div key={stat.id} className="flex items-center justify-between rounded-lg border border-admin-border bg-admin-surface px-4 py-2.5 text-sm">
              <span className="font-medium text-admin-text">
                {stat.value}
                {stat.suffix} — {stat.label.en || stat.label.ar || "(untitled)"}
              </span>
              <span className={stat.status === "published" ? "text-admin-success" : "text-admin-muted"}>{stat.status}</span>
            </div>
          ))}
          {stats.length === 0 && <p className="text-sm text-admin-muted">No statistics yet.</p>}
        </div>
      </div>
    </div>
  );
}
