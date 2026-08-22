"use client";

import { useId, useActionState } from "react";
import { CheckCircle2, AlertCircle, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/eyebrow";
import { GlassCard } from "@/components/ui/glass-card";
import { Reveal } from "@/components/ui/reveal";
import { GlowOrb } from "@/components/decorative/glow-orb";
import { WhatsappIcon } from "@/components/icons/social-icons";
import { submitContactForm, idleContactFormState } from "@/app/[locale]/contact/actions";

const inputClasses =
  "w-full rounded-lg border-2 border-line bg-white/70 px-4 py-3 text-sm text-ink-900 placeholder:text-ink-400/70 outline-none transition-colors duration-200 focus:border-brand-400 focus:bg-white";

export function ContactForm({
  locale,
  eyebrow,
  heading,
  nameLabel,
  namePlaceholder,
  emailLabel,
  emailPlaceholder,
  phoneLabel,
  phonePlaceholder,
  messageLabel,
  messagePlaceholder,
  submitLabel,
  sendingLabel,
  successMessage,
  orLabel,
  whatsappLabel,
  callLabel,
  whatsappHref,
  phoneHref,
}: {
  locale: string;
  eyebrow: string;
  heading: string;
  nameLabel: string;
  namePlaceholder: string;
  emailLabel: string;
  emailPlaceholder: string;
  phoneLabel: string;
  phonePlaceholder: string;
  messageLabel: string;
  messagePlaceholder: string;
  submitLabel: string;
  sendingLabel: string;
  successMessage: string;
  orLabel: string;
  whatsappLabel: string;
  callLabel: string;
  whatsappHref: string;
  phoneHref: string;
}) {
  const [state, formAction, pending] = useActionState(submitContactForm, idleContactFormState);
  const nameId = useId();
  const emailId = useId();
  const phoneId = useId();
  const messageId = useId();

  const errorMessage =
    state.status === "error"
      ? state.message === "missing_fields"
        ? locale === "ar"
          ? "يرجى تعبئة جميع الحقول المطلوبة."
          : "Please fill in all required fields."
        : locale === "ar"
          ? "حدث خطأ ما. يرجى المحاولة مرة أخرى أو التواصل معنا مباشرة."
          : "Something went wrong. Please try again or contact us directly."
      : null;

  return (
    <section id="contact-form" className="relative overflow-hidden py-20 sm:py-28">
      <GlowOrb className="-bottom-16 -start-16 h-80 w-80" />
      <div className="relative mx-auto max-w-3xl px-5 sm:px-8">
        <Reveal>
          <GlassCard className="p-6 sm:p-10">
            <div className="mx-auto max-w-lg text-center">
              <Eyebrow align="center" className="mb-4">
                {eyebrow}
              </Eyebrow>
              <h2 className="text-balance text-3xl font-extrabold tracking-tight text-ink-900 sm:text-4xl">{heading}</h2>
            </div>

            {state.status === "success" ? (
              <div className="mx-auto mt-10 flex max-w-md flex-col items-center gap-3 text-center">
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-100 text-brand-600">
                  <CheckCircle2 className="h-7 w-7" />
                </span>
                <p className="text-[0.98rem] leading-relaxed text-ink-600">{successMessage}</p>
              </div>
            ) : (
              <form action={formAction} className="mx-auto mt-8 grid max-w-lg grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="sm:col-span-1">
                  <label htmlFor={nameId} className="mb-1.5 block text-xs font-bold text-ink-900">
                    {nameLabel}
                  </label>
                  <input id={nameId} name="name" type="text" required placeholder={namePlaceholder} className={inputClasses} />
                </div>
                <div className="sm:col-span-1">
                  <label htmlFor={phoneId} className="mb-1.5 block text-xs font-bold text-ink-900">
                    {phoneLabel}
                  </label>
                  <input id={phoneId} name="phone" type="tel" placeholder={phonePlaceholder} className={inputClasses} dir="ltr" />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor={emailId} className="mb-1.5 block text-xs font-bold text-ink-900">
                    {emailLabel}
                  </label>
                  <input id={emailId} name="email" type="email" required placeholder={emailPlaceholder} className={inputClasses} dir="ltr" />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor={messageId} className="mb-1.5 block text-xs font-bold text-ink-900">
                    {messageLabel}
                  </label>
                  <textarea
                    id={messageId}
                    name="message"
                    required
                    rows={4}
                    placeholder={messagePlaceholder}
                    className={`${inputClasses} resize-none`}
                  />
                </div>

                {errorMessage && (
                  <div className="flex items-center gap-1.5 text-sm font-medium text-red-600 sm:col-span-2">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    {errorMessage}
                  </div>
                )}

                <div className="mt-2 sm:col-span-2">
                  <Button type="submit" size="lg" className="w-full" disabled={pending}>
                    {pending ? sendingLabel : submitLabel}
                  </Button>
                </div>
              </form>
            )}

            <div className="mx-auto mt-8 flex max-w-lg items-center gap-3">
              <span className="h-px flex-1 bg-line" />
              <span className="text-xs font-semibold text-ink-400">{orLabel}</span>
              <span className="h-px flex-1 bg-line" />
            </div>

            <div className="mx-auto mt-6 flex max-w-lg flex-col gap-3 sm:flex-row">
              <Button href={whatsappHref} size="lg" variant="ghost" icon={<WhatsappIcon className="h-5 w-5" />} className="w-full sm:w-1/2">
                {whatsappLabel}
              </Button>
              <Button href={phoneHref} size="lg" variant="ghost" icon={<Phone className="h-4.5 w-4.5" />} className="w-full sm:w-1/2">
                {callLabel}
              </Button>
            </div>
          </GlassCard>
        </Reveal>
      </div>
    </section>
  );
}
