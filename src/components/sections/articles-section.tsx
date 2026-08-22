import { getLocale } from "next-intl/server";
import { getArticlesPageContent, getPublishedArticles } from "@/lib/data/articles";
import { pickLocale } from "@/lib/i18n-content";
import { ArticlesSectionList } from "./articles-section-list";

export async function ArticlesSection() {
  const locale = await getLocale();
  const [content, articles] = await Promise.all([getArticlesPageContent(), getPublishedArticles()]);

  const featured = articles.find((a) => a.is_featured) ?? null;
  const rest = articles.filter((a) => a.id !== featured?.id);

  const toItem = (a: (typeof articles)[number]) => ({
    id: a.id,
    category: pickLocale(a.category, locale),
    date: a.published_date,
    title: pickLocale(a.title, locale),
    excerpt: pickLocale(a.excerpt, locale),
    image: a.image_url,
    content: pickLocale(a.content, locale),
  });

  return (
    <ArticlesSectionList
      featured={featured ? toItem(featured) : null}
      items={rest.map(toItem)}
      readMoreLabel={pickLocale(content?.read_more_label, locale)}
      locale={locale}
    />
  );
}
