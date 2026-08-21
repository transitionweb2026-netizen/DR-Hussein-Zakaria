import { useTranslations } from "next-intl";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Accordion } from "@/components/ui/accordion";
import { DecorativeQuestion } from "@/components/decorative/decorative-question";
import { GlowOrb } from "@/components/decorative/glow-orb";

type FaqItem = {
  question: string;
  answer: string;
};

export function Faq() {
  const t = useTranslations("faq");
  const items = t.raw("items") as FaqItem[];

  return (
    <section id="faq" className="relative overflow-hidden py-20 sm:py-28">
      <GlowOrb className="top-1/4 -start-24 h-72 w-72" />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_0.44fr] lg:gap-10">
          <div>
            <Eyebrow className="mb-4">{t("eyebrow")}</Eyebrow>
            <h2 className="mb-8 text-3xl font-extrabold tracking-tight text-ink-900 sm:text-4xl">
              {t("heading")}
            </h2>
            <Accordion items={items} />
          </div>
          <div className="hidden items-center justify-center lg:flex">
            <DecorativeQuestion className="h-72 w-72" />
          </div>
        </div>
      </div>
    </section>
  );
}
