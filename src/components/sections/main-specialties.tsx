import { useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";
import { Eyebrow } from "@/components/ui/eyebrow";
import { GlassCard } from "@/components/ui/glass-card";
import { IconTile } from "@/components/ui/icon-tile";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { GlowOrb } from "@/components/decorative/glow-orb";
import { getIcon } from "@/lib/icon-map";

type ServiceItem = {
  id: string;
  icon: string;
  title: string;
  description: string;
};

export function MainSpecialties() {
  const t = useTranslations("mainSpecialties");
  const ts = useTranslations("services");
  const items = ts.raw("items") as ServiceItem[];

  return (
    <section id="specialties" className="relative overflow-hidden py-20 sm:py-28">
      <GlowOrb className="top-10 -end-16 h-72 w-72" />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal className="mx-auto mb-12 max-w-2xl text-center">
          <Eyebrow align="center" className="mb-4">
            {t("eyebrow")}
          </Eyebrow>
          <h2 className="text-balance text-3xl font-extrabold tracking-tight text-ink-900 sm:text-4xl">
            {t("heading")}
          </h2>
        </Reveal>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item, i) => (
            <Reveal key={item.id} delay={i * 90}>
              <GlassCard hover className="group h-full p-6">
                <IconTile icon={getIcon(item.icon)} />
                <h3 className="mt-5 text-[1.05rem] font-bold text-ink-900">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-600">{item.description}</p>
                <span className="mt-5 flex h-9 w-9 items-center justify-center rounded-full border border-line text-brand-600 transition-all duration-300 group-hover:bg-brand-500 group-hover:text-white">
                  <ArrowRight className="h-4 w-4 rtl:-scale-x-100" />
                </span>
              </GlassCard>
            </Reveal>
          ))}
        </div>

        <Reveal delay={360} className="mt-12 flex justify-center">
          <Button href="/services" size="lg" icon={<ArrowRight className="h-4.5 w-4.5" />}>
            {t("viewAll")}
          </Button>
        </Reveal>
      </div>
    </section>
  );
}
