import { getLocale } from "next-intl/server";
import { ArrowRight } from "lucide-react";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { GlowOrb } from "@/components/decorative/glow-orb";
import { getHomeVideosSection } from "@/lib/data/home";
import { getPublishedVideos } from "@/lib/data/videos";
import { pickLocale } from "@/lib/i18n-content";
import { FeaturedVideosList } from "./featured-videos-list";

/** Reuses the existing FeaturedVideosList (thumbnail/play/modal, already
 * built for the /videos page) against the same shared videos table,
 * capped to the first 3 published videos -- reorder them on the Videos
 * admin screen to change which 3 appear here. */
export async function HomeFeaturedVideos() {
  const locale = await getLocale();
  const [section, videos] = await Promise.all([getHomeVideosSection(), getPublishedVideos()]);

  const items = videos.slice(0, 3).map((v) => ({
    id: v.id,
    title: pickLocale(v.title, locale),
    description: pickLocale(v.description, locale),
    duration: v.duration,
    thumbnail: v.thumbnail_url,
    videoUrl: v.video_url,
    videoProvider: v.video_provider,
  }));

  return (
    <section id="featured-videos" className="relative overflow-hidden py-20 sm:py-28">
      <GlowOrb className="top-10 -end-16 h-72 w-72" />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal className="mx-auto mb-14 max-w-2xl text-center">
          <Eyebrow align="center" className="mb-4">
            {pickLocale(section?.eyebrow, locale)}
          </Eyebrow>
          <h2 className="text-balance text-3xl font-extrabold tracking-tight text-ink-900 sm:text-4xl">
            {pickLocale(section?.heading, locale)}
          </h2>
          {pickLocale(section?.description, locale) && (
            <p className="mt-4 text-[0.98rem] leading-relaxed text-ink-600">{pickLocale(section?.description, locale)}</p>
          )}
        </Reveal>

        <FeaturedVideosList items={items} />

        <Reveal delay={300} className="mt-12 flex justify-center">
          <Button href="/videos" size="lg" icon={<ArrowRight className="h-4.5 w-4.5" />}>
            {pickLocale(section?.view_all_label, locale)}
          </Button>
        </Reveal>
      </div>
    </section>
  );
}
