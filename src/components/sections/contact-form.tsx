"use client";

import { useId, useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { CheckCircle2, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/eyebrow";
import { GlassCard } from "@/components/ui/glass-card";
import { Reveal } from "@/components/ui/reveal";
import { GlowOrb } from "@/components/decorative/glow-orb";
import { WhatsappIcon } from "@/components/icons/social-icons";
import { WHATSAPP_HREF, PHONE_HREF } from "@/lib/contact";

type Status = "idle" | "sending" | "sent";

const inputClasses =
  "w-full rounded-lg border-2 border-line bg-white/70 px-4 py-3 text-sm text-ink-900 placeholder:text-ink-400/70 outline-none transition-colors duration-200 focus:border-brand-400 focus:bg-white";

export function ContactForm() {
  const t = useTranslations("contactPage.form");
  const tf = useTranslations("finalCta");
  const [status, setStatus] = useState<Status>("idle");
  const nameId = useId();
  const emailId = useId();
  const phoneId = useId();
  const messageId = useId();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status === "sending") return;
    setStatus("sending");
    window.setTimeout(() => {
      setStatus("sent");
      e.currentTarget?.reset();
    }, 900);
  };

  return (
    <section id="contact-form" className="relative overflow-hidden py-20 sm:py-28">
      <GlowOrb className="-bottom-16 -start-16 h-80 w-80" />
      <div className="relative mx-auto max-w-3xl px-5 sm:px-8">
        <Reveal>
          <GlassCard className="p-6 sm:p-10">
            <div className="mx-auto max-w-lg text-center">
              <Eyebrow align="center" className="mb-4">
                {t("eyebrow")}
              </Eyebrow>
              <h2 className="text-balance text-3xl font-extrabold tracking-tight text-ink-900 sm:text-4xl">
                {t("heading")}
              </h2>
            </div>

            {status === "sent" ? (
              <div className="mx-auto mt-10 flex max-w-md flex-col items-center gap-3 text-center">
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-100 text-brand-600">
                  <CheckCircle2 className="h-7 w-7" />
                </span>
                <p className="text-[0.98rem] leading-relaxed text-ink-600">{t("success")}</p>
                <Button variant="ghost" onClick={() => setStatus("idle")} className="mt-2">
                  {t("submit")}
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mx-auto mt-8 grid max-w-lg grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="sm:col-span-1">
                  <label htmlFor={nameId} className="mb-1.5 block text-xs font-bold text-ink-900">
                    {t("nameLabel")}
                  </label>
                  <input id={nameId} name="name" type="text" required placeholder={t("namePlaceholder")} className={inputClasses} />
                </div>
                <div className="sm:col-span-1">
                  <label htmlFor={phoneId} className="mb-1.5 block text-xs font-bold text-ink-900">
                    {t("phoneLabel")}
                  </label>
                  <input id={phoneId} name="phone" type="tel" required placeholder={t("phonePlaceholder")} className={inputClasses} dir="ltr" />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor={emailId} className="mb-1.5 block text-xs font-bold text-ink-900">
                    {t("emailLabel")}
                  </label>
                  <input id={emailId} name="email" type="email" required placeholder={t("emailPlaceholder")} className={inputClasses} dir="ltr" />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor={messageId} className="mb-1.5 block text-xs font-bold text-ink-900">
                    {t("messageLabel")}
                  </label>
                  <textarea
                    id={messageId}
                    name="message"
                    required
                    rows={4}
                    placeholder={t("messagePlaceholder")}
                    className={`${inputClasses} resize-none`}
                  />
                </div>

                <div className="sm:col-span-2 mt-2">
                  <Button type="submit" size="lg" className="w-full">
                    {status === "sending" ? t("sending") : t("submit")}
                  </Button>
                </div>
              </form>
            )}

            <div className="mx-auto mt-8 flex max-w-lg items-center gap-3">
              <span className="h-px flex-1 bg-line" />
              <span className="text-xs font-semibold text-ink-400">{t("orLabel")}</span>
              <span className="h-px flex-1 bg-line" />
            </div>

            <div className="mx-auto mt-6 flex max-w-lg flex-col gap-3 sm:flex-row">
              <Button href={WHATSAPP_HREF} size="lg" variant="ghost" icon={<WhatsappIcon className="h-5 w-5" />} className="w-full sm:w-1/2">
                {tf("whatsapp")}
              </Button>
              <Button href={PHONE_HREF} size="lg" variant="ghost" icon={<Phone className="h-4.5 w-4.5" />} className="w-full sm:w-1/2">
                {tf("call")}
              </Button>
            </div>
          </GlassCard>
        </Reveal>
      </div>
    </section>
  );
}
