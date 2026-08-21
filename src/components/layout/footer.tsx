import { useTranslations } from "next-intl";
import { Brain, Mail, MapPin, Phone } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { GlowOrb } from "@/components/decorative/glow-orb";
import { FacebookIcon, InstagramIcon, TiktokIcon, YoutubeIcon } from "@/components/icons/social-icons";

const socials = [
  { icon: FacebookIcon, label: "Facebook" },
  { icon: InstagramIcon, label: "Instagram" },
  { icon: TiktokIcon, label: "TikTok" },
  { icon: YoutubeIcon, label: "YouTube" },
];

const quickLinkHrefs = ["/", "/services", "/videos", "/patient-stories", "/articles", "/contact"];

export function Footer() {
  const t = useTranslations("footer");
  const th = useTranslations("header");
  const year = new Date().getFullYear();

  const quickLinks = t.raw("quickLinks") as string[];
  const services = t.raw("services") as string[];

  return (
    <footer className="relative overflow-hidden border-t-2 border-line bg-glass text-ink-900 backdrop-blur-xl">
      <GlowOrb className="-top-20 start-1/4 h-72 w-72" />
      <GlowOrb className="bottom-0 end-0 h-80 w-80" />

      <div className="relative mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:py-20">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-5 lg:gap-8">
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-brand-400 to-brand-600 text-white shadow-btn">
                <Brain className="h-5.5 w-5.5" strokeWidth={1.8} />
              </span>
              <span className="flex flex-col leading-tight">
                <span className="text-[0.95rem] font-extrabold text-ink-900">{th("logoName")}</span>
                <span className="text-xs font-medium text-ink-400">{th("logoTitle")}</span>
              </span>
            </Link>
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-ink-600">{t("description")}</p>
            <div className="mt-6 flex items-center gap-2.5">
              {socials.map(({ icon: Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-line bg-glass-strong text-brand-600 shadow-glass-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-400 hover:text-brand-700"
                >
                  <Icon className="h-4.5 w-4.5" />
                </a>
              ))}
            </div>
          </div>

          <FooterColumn title={t("quickLinksTitle")}>
            {quickLinks.map((label, i) => (
              <Link
                key={label}
                href={quickLinkHrefs[i] ?? "/"}
                className="text-sm text-ink-600 transition-colors hover:text-brand-600"
              >
                {label}
              </Link>
            ))}
          </FooterColumn>

          <FooterColumn title={t("servicesTitle")}>
            {services.map((label) => (
              <Link
                key={label}
                href="/services"
                className="text-sm text-ink-600 transition-colors hover:text-brand-600"
              >
                {label}
              </Link>
            ))}
          </FooterColumn>

          <FooterColumn title={t("contactTitle")}>
            <span className="flex items-start gap-2.5 text-sm text-ink-600">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-brand-500" />
              <span dir="ltr" className="text-start">{t("phone")}</span>
            </span>
            <span className="flex items-start gap-2.5 text-sm text-ink-600">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-brand-500" />
              <span dir="ltr" className="text-start">{t("email")}</span>
            </span>
            <span className="flex items-start gap-2.5 text-sm text-ink-600">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-500" />
              {t("address")}
            </span>
          </FooterColumn>

          <FooterColumn title={t("hoursTitle")}>
            <div className="text-sm text-ink-600">
              <p className="font-semibold text-ink-900">{t("weekdays")}</p>
              <p>{t("weekdayHours")}</p>
            </div>
            <div className="text-sm text-ink-600">
              <p className="font-semibold text-ink-900">{t("weekend")}</p>
              <p>{t("weekendStatus")}</p>
            </div>
          </FooterColumn>
        </div>

        <div className="mt-14 border-t border-line pt-7 text-center text-sm text-ink-400">
          {t("copyright", { year })}
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-sm font-bold uppercase tracking-wide text-ink-900">{title}</h3>
      <div className="mt-5 flex flex-col items-start gap-3">{children}</div>
    </div>
  );
}
