import { getLocale } from "next-intl/server";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Reveal } from "@/components/ui/reveal";
import { GlowOrb } from "@/components/decorative/glow-orb";
import { getAboutVideoIntro } from "@/lib/data/about";
import { pickLocale } from "@/lib/i18n-content";
import { AboutVideoIntroPlayer } from "./about-video-intro-player";

/** Independent from Home's own paired-with-text intro video -- this is a
 * major, standalone, wide video section (third on the About Doctor page),
 * matching the site's earlier full-width video treatment. */
export async function AboutVideoIntroSection() {
  const locale = await getLocale();
  const video = await getAboutVideoIntro();
  const heading = pickLocale(video?.heading, locale);

  return (
    <section id="about-video" className="relative overflow-hidden py-20 sm:py-28">
      <GlowOrb className="-bottom-10 -end-24 h-80 w-80" />
      <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
        <Reveal className="mx-auto mb-12 max-w-2xl text-center">
          <Eyebrow align="center" className="mb-4">
            {pickLocale(video?.eyebrow, locale)}
          </Eyebrow>
          <h2 className="text-balance text-3xl font-extrabold tracking-tight text-ink-900 sm:text-4xl">{heading}</h2>
          {pickLocale(video?.description, locale) && (
            <p className="mt-4 text-[0.98rem] leading-relaxed text-ink-600">{pickLocale(video?.description, locale)}</p>
          )}
        </Reveal>

        <Reveal delay={120}>
          <AboutVideoIntroPlayer
            heading={heading}
            duration={video?.duration ?? ""}
            thumbnail={video?.thumbnail_url ?? null}
            videoUrl={video?.video_url ?? null}
            videoProvider={video?.video_provider ?? null}
          />
        </Reveal>
      </div>
    </section>
  );
}
