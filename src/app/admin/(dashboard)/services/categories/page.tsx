import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/admin/page-header";
import { AdminForm } from "@/components/admin/admin-form";
import { TranslatableInput } from "@/components/admin/translatable-input";
import { getServicesPageContent } from "@/lib/data/services";
import { getAllServiceCategories } from "@/lib/data/shared-content";
import { updateServicesIntro } from "./actions";

export default async function ServicesCategoriesPage() {
  const [content, items] = await Promise.all([getServicesPageContent(), getAllServiceCategories()]);

  return (
    <div className="max-w-3xl space-y-8">
      <PageHeader
        title="Services — General Services"
        description="This section's intro copy. The category cards themselves (title, description, icon, image) are the same shared list used on the Home page and managed in one place."
      />

      <AdminForm action={updateServicesIntro} saveLabel="Save intro">
        <TranslatableInput name="intro_eyebrow" label="Eyebrow" defaultValue={content?.intro_eyebrow} />
        <TranslatableInput name="intro_heading" label="Heading" defaultValue={content?.intro_heading} />
        <TranslatableInput name="intro_paragraph" label="Paragraph" defaultValue={content?.intro_paragraph} multiline rows={2} />
        <TranslatableInput name="view_procedures_label" label='"View Procedures" link label' defaultValue={content?.view_procedures_label} />
      </AdminForm>

      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-admin-text">Service categories (shared)</h2>
          <Link href="/admin/home/specialties" className="flex items-center gap-1 text-xs font-semibold text-admin-accent hover:underline">
            Manage categories in Home → Specialties
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
        <div className="space-y-2">
          {items.map((item) => (
            <div key={item.id} className="flex items-center justify-between rounded-lg border border-admin-border bg-admin-surface px-4 py-2.5 text-sm">
              <span className="font-medium text-admin-text">
                {item.title.en || item.title.ar || "(untitled)"} <span className="font-mono text-xs text-admin-muted">({item.slug})</span>
              </span>
              <span className={item.status === "published" ? "text-admin-success" : "text-admin-muted"}>{item.status}</span>
            </div>
          ))}
          {items.length === 0 && <p className="text-sm text-admin-muted">No categories yet.</p>}
        </div>
      </div>
    </div>
  );
}
