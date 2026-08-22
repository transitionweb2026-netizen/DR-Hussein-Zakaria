import { getLocale } from "next-intl/server";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Reveal } from "@/components/ui/reveal";
import { GlowOrb } from "@/components/decorative/glow-orb";
import { getServicesPageContent, getPublishedSurgeries } from "@/lib/data/services";
import { getPublishedServiceCategories } from "@/lib/data/shared-content";
import { pickLocale } from "@/lib/i18n-content";
import { DetailedSurgeriesList } from "./detailed-surgeries-list";

export async function DetailedSurgeries() {
  const locale = await getLocale();
  const [content, categories, surgeries] = await Promise.all([
    getServicesPageContent(),
    getPublishedServiceCategories(),
    getPublishedSurgeries(),
  ]);

  const groups = categories.map((category) => ({
    id: category.id,
    slug: category.slug,
    title: pickLocale(category.title, locale),
    surgeries: surgeries
      .filter((s) => s.category_id === category.id)
      .map((s) => ({
        id: s.id,
        title: pickLocale(s.title, locale),
        short: pickLocale(s.short_description, locale),
        fullDescription: pickLocale(s.full_description, locale),
        symptoms: s.symptoms ? pickLocale(s.symptoms, locale) : "",
        treatmentInfo: s.treatment_info ? pickLocale(s.treatment_info, locale) : "",
        faq: (s.faq ?? []).map((f) => ({ question: pickLocale(f.question, locale), answer: pickLocale(f.answer, locale) })),
        videoUrl: s.video_url,
        videoProvider: s.video_provider,
        image: s.primary_image_url,
      })),
  }));

  return (
    <section className="relative overflow-hidden py-20 sm:py-28">
      <GlowOrb className="-bottom-10 -start-24 h-80 w-80" />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal className="mx-auto mb-16 max-w-2xl text-center">
          <Eyebrow align="center" className="mb-4">
            {pickLocale(content?.detailed_heading, locale)}
          </Eyebrow>
        </Reveal>

        <DetailedSurgeriesList
          groups={groups}
          symptomsLabel={pickLocale(content?.symptoms_label, locale)}
          treatmentLabel={pickLocale(content?.treatment_label, locale)}
        />
      </div>
    </section>
  );
}
