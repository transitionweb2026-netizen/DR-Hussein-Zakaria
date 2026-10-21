import Image from "next/image";

/** Small "designed & developed by" badge -- the agency's own branding on
 * the site they built, same pill-badge shape as their reference image,
 * recolored to this site's brand gradient instead of their reference's
 * purple, with their logo (white mark, transparent background) dropped
 * into the center circle instead of the reference's generic icon. */
export function AgencyCredit({ locale }: { locale: string }) {
  const brandLabel = locale === "ar" ? "ترانزيشن" : "Transition";
  const serviceLabel = locale === "ar" ? "تصميم وتطوير" : "Design & Development";

  return (
    <div className="inline-flex items-center gap-2.5 rounded-pill bg-gradient-to-r from-brand-400 via-brand-500 to-brand-600 px-4 py-2 shadow-btn">
      <span className="text-xs font-bold text-white">{brandLabel}</span>
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-navy-950/25 p-1.5">
        <Image src="/images/transition-logo.png" alt={brandLabel} width={20} height={20} className="h-full w-full object-contain" />
      </span>
      <span className="text-xs font-semibold text-white/90">{serviceLabel}</span>
    </div>
  );
}
