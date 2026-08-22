import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { ArrowRight } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { Reveal } from "@/components/ui/reveal";

type ArticleCardItem = {
  id: string;
  title: string;
  excerpt: string;
  image: string | null;
};

/** Compact horizontal cards (thumbnail + text side by side) rather than
 * the full Articles page's 3-column grid -- this column is half the page
 * width here, so a vertical stack reads better than a cramped grid. Each
 * card links out to the full Articles page. */
export function HomeArticleCards({ items }: { items: ArticleCardItem[] }) {
  if (items.length === 0) {
    return <p className="mt-8 text-sm text-ink-400">No articles published yet.</p>;
  }

  return (
    <div className="mt-8 space-y-4">
      {items.map((item, i) => (
        <Reveal key={item.id} delay={i * 90}>
          <Link href="/articles" className="group block">
            <GlassCard hover className="flex items-center gap-4 p-3">
              <div className="relative h-20 w-24 shrink-0 overflow-hidden rounded-[calc(var(--radius-card)-0.625rem)] sm:h-24 sm:w-28">
                {item.image && (
                  <Image src={item.image} alt={item.title} fill sizes="120px" className="object-cover transition-transform duration-500 group-hover:scale-105" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="truncate text-sm font-bold text-ink-900 sm:text-base">{item.title}</h3>
                <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-ink-600 sm:text-sm">{item.excerpt}</p>
              </div>
              <ArrowRight className="h-4 w-4 shrink-0 text-brand-600 transition-transform duration-300 rtl:-scale-x-100 group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
            </GlassCard>
          </Link>
        </Reveal>
      ))}
    </div>
  );
}
