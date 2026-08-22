import { PageHeader } from "@/components/admin/page-header";
import { AdminForm } from "@/components/admin/admin-form";
import { TranslatableInput } from "@/components/admin/translatable-input";
import { Field } from "@/components/admin/field";
import { getContactPageContent, getContactSubmissions } from "@/lib/data/contact";
import { updatePageContent, updateSubmissionStatus, deleteSubmission } from "./actions";

const STATUS_STYLES: Record<string, string> = {
  new: "bg-admin-accent/10 text-admin-accent",
  read: "bg-admin-bg text-admin-muted",
  archived: "bg-admin-bg text-admin-muted line-through",
};

export default async function ContactAdminPage() {
  const [content, submissions] = await Promise.all([getContactPageContent(), getContactSubmissions()]);

  return (
    <div className="max-w-3xl space-y-10">
      <div>
        <PageHeader
          title="Contact Us"
          description="The /contact page's hero and contact form labels. Phone/WhatsApp/email/address themselves live in Global Settings → Contact Info; social links live in Global Settings → Social Media."
        />

        <AdminForm action={updatePageContent} saveLabel="Save page content">
          <TranslatableInput name="hero_eyebrow" label="Hero eyebrow" defaultValue={content?.hero_eyebrow} />
          <TranslatableInput name="hero_heading_prefix" label="Hero heading (first part)" defaultValue={content?.hero_heading_prefix} />
          <TranslatableInput name="hero_heading_highlight" label="Hero heading (highlighted part)" defaultValue={content?.hero_heading_highlight} />
          <TranslatableInput name="hero_paragraph" label="Hero paragraph" defaultValue={content?.hero_paragraph} multiline />
          <TranslatableInput name="form_eyebrow" label="Form eyebrow" defaultValue={content?.form_eyebrow} />
          <TranslatableInput name="form_heading" label="Form heading" defaultValue={content?.form_heading} />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <TranslatableInput name="form_name_label" label="Name field label" defaultValue={content?.form_name_label} />
            <TranslatableInput name="form_name_placeholder" label="Name field placeholder" defaultValue={content?.form_name_placeholder} />
            <TranslatableInput name="form_email_label" label="Email field label" defaultValue={content?.form_email_label} />
            <TranslatableInput name="form_email_placeholder" label="Email field placeholder" defaultValue={content?.form_email_placeholder} />
            <TranslatableInput name="form_phone_label" label="Phone field label" defaultValue={content?.form_phone_label} />
            <TranslatableInput name="form_phone_placeholder" label="Phone field placeholder" defaultValue={content?.form_phone_placeholder} />
          </div>
          <TranslatableInput name="form_message_label" label="Message field label" defaultValue={content?.form_message_label} />
          <TranslatableInput name="form_message_placeholder" label="Message field placeholder" defaultValue={content?.form_message_placeholder} />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <TranslatableInput name="form_submit_label" label='"Send" button label' defaultValue={content?.form_submit_label} />
            <TranslatableInput name="form_sending_label" label='"Sending..." label' defaultValue={content?.form_sending_label} />
            <TranslatableInput name="form_or_label" label='"Or reach us directly" label' defaultValue={content?.form_or_label} />
          </div>
          <TranslatableInput name="form_success_message" label="Success message" defaultValue={content?.form_success_message} multiline rows={2} />
          <TranslatableInput name="map_label" label="Map section label" defaultValue={content?.map_label} />
          <Field name="map_embed_url" label="Map embed URL (optional)" defaultValue={content?.map_embed_url ?? ""} dir="ltr" placeholder="https://www.google.com/maps/embed?..." />
        </AdminForm>
      </div>

      <div>
        <h2 className="mb-3 text-sm font-semibold text-admin-text">Submissions inbox ({submissions.length})</h2>
        <div className="space-y-2">
          {submissions.map((s) => (
            <div key={s.id} className="rounded-lg border border-admin-border bg-admin-surface p-4">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-semibold text-admin-text">{s.name}</p>
                  <p dir="ltr" className="text-xs text-admin-muted">
                    {s.email} {s.phone ? `· ${s.phone}` : ""}
                  </p>
                  <p className="mt-0.5 text-[11px] text-admin-muted">{new Date(s.created_at).toLocaleString()}</p>
                </div>
                <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${STATUS_STYLES[s.status] ?? ""}`}>{s.status}</span>
              </div>
              <p className="mt-3 whitespace-pre-wrap text-sm text-admin-text">{s.message}</p>
              <div className="mt-3 flex items-center gap-2">
                <form action={updateSubmissionStatus}>
                  <input type="hidden" name="id" value={s.id} />
                  <input type="hidden" name="status" value="read" />
                  <button type="submit" className="rounded-md border border-admin-border px-2.5 py-1 text-xs font-semibold text-admin-text hover:bg-admin-bg">
                    Mark read
                  </button>
                </form>
                <form action={updateSubmissionStatus}>
                  <input type="hidden" name="id" value={s.id} />
                  <input type="hidden" name="status" value="archived" />
                  <button type="submit" className="rounded-md border border-admin-border px-2.5 py-1 text-xs font-semibold text-admin-text hover:bg-admin-bg">
                    Archive
                  </button>
                </form>
                <form action={deleteSubmission} className="ms-auto">
                  <input type="hidden" name="id" value={s.id} />
                  <button type="submit" className="rounded-md border border-admin-border px-2.5 py-1 text-xs font-semibold text-admin-danger hover:bg-red-50">
                    Delete
                  </button>
                </form>
              </div>
            </div>
          ))}
          {submissions.length === 0 && <p className="text-sm text-admin-muted">No submissions yet.</p>}
        </div>
      </div>
    </div>
  );
}
