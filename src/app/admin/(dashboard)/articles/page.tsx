import { Plus } from "lucide-react";
import { PageHeader } from "@/components/admin/page-header";
import { AdminForm } from "@/components/admin/admin-form";
import { TranslatableInput } from "@/components/admin/translatable-input";
import { Field } from "@/components/admin/field";
import { MediaUploadField } from "@/components/admin/media-upload-field";
import { ReorderDeleteControls } from "@/components/admin/reorder-delete-controls";
import { getArticlesPageContent, getAllArticles } from "@/lib/data/articles";
import { updatePageContent, addArticle, updateArticle, deleteArticle, moveArticle, updateArticleImage } from "./actions";

export default async function ArticlesAdminPage() {
  const [content, items] = await Promise.all([getArticlesPageContent(), getAllArticles()]);

  return (
    <div className="max-w-3xl space-y-8">
      <PageHeader title="Articles" description="The /articles page's hero and every article. Exactly one article can be featured at a time." />

      <AdminForm action={updatePageContent} saveLabel="Save page content">
        <TranslatableInput name="hero_eyebrow" label="Hero eyebrow" defaultValue={content?.hero_eyebrow} />
        <TranslatableInput name="hero_heading_prefix" label="Hero heading (first part)" defaultValue={content?.hero_heading_prefix} />
        <TranslatableInput name="hero_heading_highlight" label="Hero heading (highlighted part)" defaultValue={content?.hero_heading_highlight} />
        <TranslatableInput name="hero_paragraph" label="Hero paragraph" defaultValue={content?.hero_paragraph} multiline />
        <TranslatableInput name="read_more_label" label='"Read More" link label' defaultValue={content?.read_more_label} />
      </AdminForm>

      <div>
        <h2 className="mb-3 text-sm font-semibold text-admin-text">Articles</h2>
        <div className="space-y-3">
          {items.map((item, i) => (
            <div key={item.id} className="rounded-xl border border-admin-border bg-admin-surface p-4">
              <p className="mb-3 font-mono text-xs text-admin-muted">slug: {item.slug}</p>
              <MediaUploadField label="Article image" currentUrl={item.image_url} action={updateArticleImage} hiddenFields={{ id: item.id }} size={72} />
              <form action={updateArticle} className="mt-4 space-y-3">
                <input type="hidden" name="id" value={item.id} />
                <TranslatableInput name="title" label="Title" defaultValue={item.title} />
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <TranslatableInput name="category" label="Category" defaultValue={item.category} />
                  <Field name="published_date" label="Published date" type="date" defaultValue={item.published_date} dir="ltr" />
                </div>
                <TranslatableInput name="excerpt" label="Excerpt" defaultValue={item.excerpt} multiline rows={2} />
                <TranslatableInput name="content" label="Full content (blank line between paragraphs)" defaultValue={item.content} multiline rows={6} />
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <TranslatableInput name="author" label="Author (optional)" defaultValue={item.author ?? undefined} />
                  <Field name="reading_time" label="Reading time (optional)" defaultValue={item.reading_time ?? ""} placeholder="5 min read" />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 text-sm text-admin-text">
                      <input type="checkbox" name="published" defaultChecked={item.status === "published"} className="h-4 w-4 rounded" />
                      Published
                    </label>
                    <label className="flex items-center gap-2 text-sm text-admin-text">
                      <input type="checkbox" name="is_featured" defaultChecked={item.is_featured} className="h-4 w-4 rounded" />
                      Featured (only one at a time)
                    </label>
                  </div>
                  <button type="submit" className="rounded-lg bg-admin-accent px-3 py-1.5 text-xs font-semibold text-white hover:bg-admin-accent-hover">
                    Save
                  </button>
                </div>
              </form>
              <ReorderDeleteControls id={item.id} isFirst={i === 0} isLast={i === items.length - 1} moveAction={moveArticle} deleteAction={deleteArticle} />
            </div>
          ))}
          {items.length === 0 && <p className="text-sm text-admin-muted">No articles yet.</p>}
        </div>
      </div>

      <div className="rounded-xl border border-dashed border-admin-border p-4">
        <h2 className="mb-3 text-sm font-semibold text-admin-text">Add article</h2>
        <form action={addArticle} className="space-y-3">
          <TranslatableInput name="title" label="Title" />
          <TranslatableInput name="category" label="Category" />
          <TranslatableInput name="excerpt" label="Excerpt" multiline rows={2} />
          <button type="submit" className="flex items-center gap-1.5 rounded-lg bg-admin-accent px-3 py-1.5 text-xs font-semibold text-white hover:bg-admin-accent-hover">
            <Plus className="h-3.5 w-3.5" />
            Add article
          </button>
        </form>
      </div>
    </div>
  );
}
