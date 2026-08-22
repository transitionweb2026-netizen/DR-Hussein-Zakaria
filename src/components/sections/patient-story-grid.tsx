import { getLocale } from "next-intl/server";
import { Reveal } from "@/components/ui/reveal";
import { GlowOrb } from "@/components/decorative/glow-orb";
import { getPatientStoriesPageContent, getPublishedPatientStories } from "@/lib/data/patient-stories";
import { pickLocale } from "@/lib/i18n-content";
import { PatientStoryGridList } from "./patient-story-grid-list";

export async function PatientStoryGrid() {
  const locale = await getLocale();
  const [content, stories] = await Promise.all([getPatientStoriesPageContent(), getPublishedPatientStories()]);

  const items = stories.map((s) => ({
    id: s.id,
    name: pickLocale(s.name, locale),
    title: pickLocale(s.title, locale),
    image: s.image_url,
    condition: pickLocale(s.condition, locale),
    journey: pickLocale(s.journey, locale),
    outcome: pickLocale(s.outcome, locale),
  }));

  return (
    <section id="patient-stories" className="relative overflow-hidden py-20 sm:py-28">
      <GlowOrb className="top-10 -start-16 h-72 w-72" />
      <GlowOrb className="-bottom-16 -end-16 h-72 w-72" />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal className="mx-auto mb-14 max-w-2xl text-center">
          <h2 className="text-balance text-3xl font-extrabold tracking-tight text-ink-900 sm:text-4xl">
            {pickLocale(content?.intro_heading, locale)}
          </h2>
        </Reveal>

        <PatientStoryGridList
          items={items}
          readStoryLabel={pickLocale(content?.read_story_label, locale)}
          labelCondition={pickLocale(content?.label_condition, locale)}
          labelJourney={pickLocale(content?.label_journey, locale)}
          labelOutcome={pickLocale(content?.label_outcome, locale)}
        />
      </div>
    </section>
  );
}
