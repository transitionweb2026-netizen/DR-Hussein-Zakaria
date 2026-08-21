import { useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { IconTile } from "@/components/ui/icon-tile";
import { GlowOrb } from "@/components/decorative/glow-orb";
import { getIcon } from "@/lib/icon-map";

type ServiceItem = {
  id: string;
  icon: string;
  title: string;
  description: string;
};

export function Services() {
  const t = useTranslations("services");
  const items = t.raw("items") as ServiceItem[];

  return (
    <section id="services" className="relative overflow-hidden">
      <GlowOrb className="top-10 -end-16 h-72 w-72" />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item) => (
            <GlassCard key={item.id} hover className="group p-6">
              <IconTile icon={getIcon(item.icon)} />
              <h3 className="mt-5 text-[1.05rem] font-bold text-ink-900">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-600">{item.description}</p>
              <span className="mt-5 flex h-9 w-9 items-center justify-center rounded-full border border-line text-brand-600 transition-all duration-300 group-hover:bg-brand-500 group-hover:text-white">
                <ArrowRight className="h-4 w-4 rtl:-scale-x-100" />
              </span>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
}
