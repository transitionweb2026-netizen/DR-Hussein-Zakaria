import { getLocale } from "next-intl/server";
import { ArrowRight } from "lucide-react";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { GlowOrb } from "@/components/decorative/glow-orb";
import { getHomeAbout, getHomeVideoIntro } from "@/lib/data/home";
import { pickLocale } from "@/lib/i18n-content";
import { AboutVideoPlayer } from "./about-video-player";

/** Combines the two existing home_about (text) and home_video_intro
 * (video) tables into one visually merged section -- the Home page's
 * second section is now "About Doctor / Intro Video" as a single
 * symmetric two-column composition rather than two separate sections. */
export async function AboutVideoIntro() {
  const locale = await getLocale();
  const [about, video] = await Promise.all([getHomeAbout(), getHomeVideoIntro()]);

  return (
    <section id="about" className="relative overflow-hidden py-20 sm:py-28">
      <GlowOrb className="top-10 -start-24 h-80 w-80" />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <Eyebrow className="mb-4">{pickLocale(about?.eyebrow, locale)}</Eyebrow>
            <h2 className="text-balance text-3xl font-extrabold leading-[1.15] tracking-tight text-ink-900 sm:text-4xl">
              {pickLocale(about?.heading_prefix, locale)}{" "}
              <span className="text-brand-500">{pickLocale(about?.heading_highlight, locale)}</span>
            </h2>
            <p className="mt-5 max-w-xl text-[0.98rem] leading-relaxed text-ink-600">{pickLocale(about?.paragraph_1, locale)}</p>
            <p className="mt-4 max-w-xl text-[0.98rem] leading-relaxed text-ink-600">{pickLocale(about?.paragraph_2, locale)}</p>
            <Button href="/about" className="mt-8" icon={<ArrowRight className="h-4 w-4" />}>
              {pickLocale(about?.cta_label, locale)}
            </Button>
          </Reveal>

          <Reveal delay={120}>
            <AboutVideoPlayer
              captionName={pickLocale(about?.doctor_name, locale)}
              captionTitle={pickLocale(about?.doctor_title, locale)}
              duration={video?.duration ?? ""}
              thumbnail={video?.thumbnail_url ?? null}
              videoUrl={video?.video_url ?? null}
              videoProvider={video?.video_provider ?? null}
            />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
