import Link from "next/link";
import { Plus } from "lucide-react";
import { ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/admin/page-header";
import { AdminForm } from "@/components/admin/admin-form";
import { TranslatableInput } from "@/components/admin/translatable-input";
import { ReorderDeleteControls } from "@/components/admin/reorder-delete-controls";
import { getHomeArticlesSection, getHomeFaqSection, getAllFaqs } from "@/lib/data/home";
import { getAllArticles } from "@/lib/data/articles";
import { updateHomeArticlesSection, updateHomeFaqSection, addFaq, updateFaq, deleteFaq, moveFaq } from "./actions";

export default async function HomeArticlesFaqPage() {
  const [articlesSection, articles, faqSection, faqs] = await Promise.all([
    getHomeArticlesSection(),
    getAllArticles(),
    getHomeFaqSection(),
    getAllFaqs(),
  ]);
  const featuredArticles = articles.slice(0, 3);

  return (
    <div className="max-w-3xl space-y-10">
      <div>
        <PageHeader
          title="Home — Articles"
          description="This section's own heading, showing the first 3 articles from the shared article library (reorder them on the Articles screen to change which 3 appear here)."
        />

        <AdminForm action={updateHomeArticlesSection} saveLabel="Save articles heading">
          <TranslatableInput name="eyebrow" label="Eyebrow" defaultValue={articlesSection?.eyebrow} />
          <TranslatableInput name="heading" label="Heading" defaultValue={articlesSection?.heading} />
          <TranslatableInput name="description" label="Supporting text (optional)" defaultValue={articlesSection?.description} multiline rows={2} />
          <TranslatableInput name="view_all_label" label='"View All Articles" button label' defaultValue={articlesSection?.view_all_label} />
        </AdminForm>

        <div className="mt-4">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-admin-text">Articles shown here (first 3, shared list)</h3>
            <Link href="/admin/articles" className="flex items-center gap-1 text-xs font-semibold text-admin-accent hover:underline">
              Manage articles &amp; reorder
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="space-y-2">
            {featuredArticles.map((item, i) => (
              <div key={item.id} className="flex items-center justify-between rounded-lg border border-admin-border bg-admin-surface px-4 py-2.5 text-sm">
                <span className="font-medium text-admin-text">
                  {i + 1}. {item.title.en || item.title.ar || "(untitled)"}
                </span>
                <span className={item.status === "published" ? "text-admin-success" : "text-admin-muted"}>{item.status}</span>
              </div>
            ))}
            {featuredArticles.length === 0 && <p className="text-sm text-admin-muted">No articles yet.</p>}
          </div>
        </div>
      </div>

      <div className="border-t border-admin-border pt-8">
        <PageHeader title="Home — FAQ" description="Sits alongside Articles in the same section." />

        <AdminForm action={updateHomeFaqSection} saveLabel="Save FAQ heading">
          <TranslatableInput name="eyebrow" label="Eyebrow" defaultValue={faqSection?.eyebrow} />
          <TranslatableInput name="heading" label="Heading" defaultValue={faqSection?.heading} />
          <TranslatableInput name="description" label="Supporting text (optional)" defaultValue={faqSection?.description} multiline rows={2} />
        </AdminForm>

        <div className="mt-6">
          <h3 className="mb-3 text-sm font-semibold text-admin-text">FAQ items</h3>
          <div className="space-y-3">
            {faqs.map((item, i) => (
              <div key={item.id} className="rounded-xl border border-admin-border bg-admin-surface p-4">
                <form action={updateFaq} className="space-y-3">
                  <input type="hidden" name="id" value={item.id} />
                  <TranslatableInput name="question" label="Question" defaultValue={item.question} />
                  <TranslatableInput name="answer" label="Answer" defaultValue={item.answer} multiline rows={3} />
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
                <ReorderDeleteControls id={item.id} isFirst={i === 0} isLast={i === faqs.length - 1} moveAction={moveFaq} deleteAction={deleteFaq} />
              </div>
            ))}
            {faqs.length === 0 && <p className="text-sm text-admin-muted">No FAQ items yet.</p>}
          </div>
        </div>

        <div className="mt-4 rounded-xl border border-dashed border-admin-border p-4">
          <h3 className="mb-3 text-sm font-semibold text-admin-text">Add FAQ item</h3>
          <form action={addFaq} className="space-y-3">
            <TranslatableInput name="question" label="Question" />
            <TranslatableInput name="answer" label="Answer" multiline rows={3} />
            <button type="submit" className="flex items-center gap-1.5 rounded-lg bg-admin-accent px-3 py-1.5 text-xs font-semibold text-white hover:bg-admin-accent-hover">
              <Plus className="h-3.5 w-3.5" />
              Add FAQ item
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
