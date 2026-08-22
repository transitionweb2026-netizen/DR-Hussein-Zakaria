import { Plus } from "lucide-react";
import { PageHeader } from "@/components/admin/page-header";
import { AdminForm } from "@/components/admin/admin-form";
import { TranslatableInput } from "@/components/admin/translatable-input";
import { Field } from "@/components/admin/field";
import { MediaUploadField } from "@/components/admin/media-upload-field";
import { ReorderDeleteControls } from "@/components/admin/reorder-delete-controls";
import { getHomeCertificatesSection } from "@/lib/data/home";
import { getAllCertificates } from "@/lib/data/shared-content";
import {
  updateCertificatesSection,
  addCertificate,
  updateCertificate,
  deleteCertificate,
  moveCertificate,
  updateCertificateImage,
} from "./actions";

export default async function HomeCertificatesPage() {
  const [section, items] = await Promise.all([getHomeCertificatesSection(), getAllCertificates()]);

  return (
    <div className="max-w-3xl space-y-8">
      <PageHeader
        title="Home — Certificates"
        description="Shared with the About Doctor page's Certificates section -- edited once here, reflected in both places."
      />

      <AdminForm action={updateCertificatesSection} saveLabel="Save heading">
        <TranslatableInput name="eyebrow" label="Eyebrow" defaultValue={section?.eyebrow} />
        <TranslatableInput name="heading" label="Heading" defaultValue={section?.heading} />
        <TranslatableInput name="description" label="Supporting text (optional)" defaultValue={section?.description} multiline rows={2} />
      </AdminForm>

      <div>
        <h2 className="mb-3 text-sm font-semibold text-admin-text">Certificates</h2>
        <div className="space-y-3">
          {items.map((item, i) => (
            <div key={item.id} className="rounded-xl border border-admin-border bg-admin-surface p-4">
              <MediaUploadField
                label="Certificate image"
                currentUrl={item.image_url}
                action={updateCertificateImage}
                hiddenFields={{ id: item.id }}
                size={64}
              />
              <form action={updateCertificate} className="mt-4 space-y-3">
                <input type="hidden" name="id" value={item.id} />
                <TranslatableInput name="title" label="Title" defaultValue={item.title} />
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_120px]">
                  <TranslatableInput name="issuer" label="Issuer" defaultValue={item.issuer} />
                  <Field name="year" label="Year" defaultValue={item.year} />
                </div>
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 text-sm text-admin-text">
                    <input type="checkbox" name="published" defaultChecked={item.status === "published"} className="h-4 w-4 rounded" />
                    Published
                  </label>
                  <button type="submit" className="rounded-lg bg-admin-accent px-3 py-1.5 text-xs font-semibold text-white hover:bg-admin-accent-hover">
                    Save
                  </button>
                </div>
              </form>
              <ReorderDeleteControls id={item.id} isFirst={i === 0} isLast={i === items.length - 1} moveAction={moveCertificate} deleteAction={deleteCertificate} />
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-dashed border-admin-border p-4">
        <h2 className="mb-3 text-sm font-semibold text-admin-text">Add certificate</h2>
        <form action={addCertificate} className="space-y-3">
          <TranslatableInput name="title" label="Title" />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_120px]">
            <TranslatableInput name="issuer" label="Issuer" />
            <Field name="year" label="Year" placeholder="2018" />
          </div>
          <button type="submit" className="flex items-center gap-1.5 rounded-lg bg-admin-accent px-3 py-1.5 text-xs font-semibold text-white hover:bg-admin-accent-hover">
            <Plus className="h-3.5 w-3.5" />
            Add certificate
          </button>
        </form>
      </div>
    </div>
  );
}
