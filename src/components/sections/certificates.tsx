import { getLocale } from "next-intl/server";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Reveal } from "@/components/ui/reveal";
import { GlowOrb } from "@/components/decorative/glow-orb";
import { getHomeCertificatesSection } from "@/lib/data/home";
import { getPublishedCertificates } from "@/lib/data/shared-content";
import { pickLocale } from "@/lib/i18n-content";
import { CertificatesGrid } from "./certificates-grid";

export async function Certificates() {
  const locale = await getLocale();
  const [section, items] = await Promise.all([getHomeCertificatesSection(), getPublishedCertificates()]);

  const resolvedItems = items.map((item) => ({
    id: item.id,
    year: item.year,
    imageUrl: item.image_url,
    title: pickLocale(item.title, locale),
    issuer: pickLocale(item.issuer, locale),
  }));

  return (
    <section id="certificates" className="relative overflow-hidden py-20 sm:py-28">
      <GlowOrb className="bottom-0 -end-20 h-72 w-72" />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal className="mx-auto mb-12 max-w-2xl text-center">
          <Eyebrow align="center" className="mb-4">
            {pickLocale(section?.eyebrow, locale)}
          </Eyebrow>
          <h2 className="text-balance text-3xl font-extrabold tracking-tight text-ink-900 sm:text-4xl">
            {pickLocale(section?.heading, locale)}
          </h2>
        </Reveal>

        <CertificatesGrid items={resolvedItems} />
      </div>
    </section>
  );
}
