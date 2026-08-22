import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/admin/page-header";
import { AdminForm } from "@/components/admin/admin-form";
import { TranslatableInput } from "@/components/admin/translatable-input";
import { getAboutSpecialtiesSection } from "@/lib/data/about";
import { getAllServiceCategories } from "@/lib/data/shared-content";
import { updateAboutSpecialtiesSection } from "./actions";

export default async function AboutSpecialtiesPage() {
  const [section, items] = await Promise.all([getAboutSpecialtiesSection(), getAllServiceCategories()]);

  return (
    <div className="max-w-3xl space-y-8">
      <PageHeader
        title="About Doctor — Main Specialties"
        description="This page's own section heading. Specialty categories are shared with the Home page and Services page and managed in one place."
      />

      <AdminForm action={updateAboutSpecialtiesSection} saveLabel="Save heading">
        <TranslatableInput name="eyebrow" label="Eyebrow" defaultValue={section?.eyebrow} />
        <TranslatableInput name="heading" label="Heading" defaultValue={section?.heading} />
        <TranslatableInput name="description" label="Supporting text (optional)" defaultValue={section?.description} multiline rows={2} />
        <TranslatableInput name="view_all_label" label='"View All Services" button label' defaultValue={section?.view_all_label} />
      </AdminForm>

      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-admin-text">Specialty categories (shared)</h2>
          <Link href="/admin/home/specialties" className="flex items-center gap-1 text-xs font-semibold text-admin-accent hover:underline">
            Manage categories in Home → Main Services
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
        <div className="space-y-2">
          {items.map((item) => (
            <div key={item.id} className="flex items-center justify-between rounded-lg border border-admin-border bg-admin-surface px-4 py-2.5 text-sm">
              <span className="font-medium text-admin-text">{item.title.en || item.title.ar || "(untitled)"}</span>
              <span className={item.status === "published" ? "text-admin-success" : "text-admin-muted"}>{item.status}</span>
            </div>
          ))}
          {items.length === 0 && <p className="text-sm text-admin-muted">No specialties yet.</p>}
        </div>
      </div>
    </div>
  );
}
