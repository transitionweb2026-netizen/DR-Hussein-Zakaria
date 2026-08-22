import { Plus } from "lucide-react";
import { PageHeader } from "@/components/admin/page-header";
import { TranslatableInput } from "@/components/admin/translatable-input";
import { Field } from "@/components/admin/field";
import { MediaUploadField } from "@/components/admin/media-upload-field";
import { ReorderDeleteControls } from "@/components/admin/reorder-delete-controls";
import { getAllReviews } from "@/lib/data/patient-stories";
import { addReview, updateReview, deleteReview, moveReview, updateReviewAvatar } from "./actions";

export default async function ReviewsAdminPage() {
  const items = await getAllReviews();

  return (
    <div className="max-w-3xl space-y-8">
      <PageHeader title="Reviews" description="Patient reviews shown on the /patient-stories page's review carousel, each with a real per-reviewer avatar." />

      <div className="space-y-3">
        {items.map((item, i) => (
          <div key={item.id} className="rounded-xl border border-admin-border bg-admin-surface p-4">
            <MediaUploadField label="Avatar" currentUrl={item.avatar_url} action={updateReviewAvatar} hiddenFields={{ id: item.id }} size={56} />
            <form action={updateReview} className="mt-4 space-y-3">
              <input type="hidden" name="id" value={item.id} />
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <TranslatableInput name="name" label="Name" defaultValue={item.name} />
                <TranslatableInput name="role" label="Role / procedure" defaultValue={item.role} />
              </div>
              <TranslatableInput name="quote" label="Quote" defaultValue={item.quote} multiline rows={2} />
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-admin-text">Rating (1-5)</label>
                  <select
                    name="rating"
                    defaultValue={item.rating}
                    className="w-full rounded-lg border border-admin-border px-3 py-2 text-sm outline-none focus:border-admin-accent focus:ring-1 focus:ring-admin-accent"
                  >
                    {[1, 2, 3, 4, 5].map((n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                  </select>
                </div>
                <Field name="review_date" label="Date (optional)" type="date" defaultValue={item.review_date ?? ""} dir="ltr" />
                <Field name="source" label="Source (optional)" defaultValue={item.source ?? ""} placeholder="Google, WhatsApp, ..." />
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
            <ReorderDeleteControls id={item.id} isFirst={i === 0} isLast={i === items.length - 1} moveAction={moveReview} deleteAction={deleteReview} />
          </div>
        ))}
        {items.length === 0 && <p className="text-sm text-admin-muted">No reviews yet.</p>}
      </div>

      <div className="rounded-xl border border-dashed border-admin-border p-4">
        <h2 className="mb-3 text-sm font-semibold text-admin-text">Add review</h2>
        <form action={addReview} className="space-y-3">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <TranslatableInput name="name" label="Name" />
            <TranslatableInput name="role" label="Role / procedure" />
          </div>
          <TranslatableInput name="quote" label="Quote" multiline rows={2} />
          <button type="submit" className="flex items-center gap-1.5 rounded-lg bg-admin-accent px-3 py-1.5 text-xs font-semibold text-white hover:bg-admin-accent-hover">
            <Plus className="h-3.5 w-3.5" />
            Add review
          </button>
        </form>
      </div>
    </div>
  );
}
