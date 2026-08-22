import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/admin/page-header";
import { AdminForm } from "@/components/admin/admin-form";
import { TranslatableInput } from "@/components/admin/translatable-input";
import { getHomeVideosSection } from "@/lib/data/home";
import { getAllVideos } from "@/lib/data/videos";
import { updateHomeVideosSection } from "./actions";

export default async function HomeFeaturedVideosPage() {
  const [section, items] = await Promise.all([getHomeVideosSection(), getAllVideos()]);
  const featured = items.slice(0, 3);

  return (
    <div className="max-w-3xl space-y-8">
      <PageHeader
        title="Home — Featured Videos"
        description="This section's own heading, showing the first 3 videos from the shared video library (reorder them on the Videos screen to change which 3 appear here)."
      />

      <AdminForm action={updateHomeVideosSection}>
        <TranslatableInput name="eyebrow" label="Eyebrow" defaultValue={section?.eyebrow} />
        <TranslatableInput name="heading" label="Heading" defaultValue={section?.heading} />
        <TranslatableInput name="description" label="Supporting text (optional)" defaultValue={section?.description} multiline rows={2} />
        <TranslatableInput name="view_all_label" label='"View All Videos" button label' defaultValue={section?.view_all_label} />
      </AdminForm>

      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-admin-text">Videos shown here (first 3, shared list)</h2>
          <Link href="/admin/videos" className="flex items-center gap-1 text-xs font-semibold text-admin-accent hover:underline">
            Manage videos &amp; reorder
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
        <div className="space-y-2">
          {featured.map((item, i) => (
            <div key={item.id} className="flex items-center justify-between rounded-lg border border-admin-border bg-admin-surface px-4 py-2.5 text-sm">
              <span className="font-medium text-admin-text">
                {i + 1}. {item.title.en || item.title.ar || "(untitled)"}
              </span>
              <span className={item.status === "published" ? "text-admin-success" : "text-admin-muted"}>{item.status}</span>
            </div>
          ))}
          {featured.length === 0 && <p className="text-sm text-admin-muted">No videos yet.</p>}
        </div>
      </div>
    </div>
  );
}
