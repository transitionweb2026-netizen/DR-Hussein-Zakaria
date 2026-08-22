import { getLocale } from "next-intl/server";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Reveal } from "@/components/ui/reveal";
import { GlowOrb } from "@/components/decorative/glow-orb";
import { getVideosPageContent, getPublishedVideos } from "@/lib/data/videos";
import { pickLocale } from "@/lib/i18n-content";
import { FeaturedVideosList } from "./featured-videos-list";

export async function FeaturedVideos() {
  const locale = await getLocale();
  const [content, videos] = await Promise.all([getVideosPageContent(), getPublishedVideos()]);

  const items = videos.map((v) => ({
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
      <GlowOrb className="-bottom-16 -start-16 h-72 w-72" />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal className="mx-auto mb-14 max-w-2xl text-center">
          <Eyebrow align="center" className="mb-4">
            {pickLocale(content?.intro_eyebrow, locale)}
          </Eyebrow>
          <h2 className="text-balance text-3xl font-extrabold tracking-tight text-ink-900 sm:text-4xl">
            {pickLocale(content?.intro_heading, locale)}
          </h2>
          <p className="mt-4 text-[0.98rem] leading-relaxed text-ink-600">{pickLocale(content?.intro_description, locale)}</p>
        </Reveal>

        <FeaturedVideosList items={items} />
      </div>
    </section>
  );
}
