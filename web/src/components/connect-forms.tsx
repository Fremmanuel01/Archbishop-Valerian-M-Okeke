"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { FormField, TextArea } from "@/components/form";
import {
  initialFormState,
  submitContact,
  submitPrayerRequest,
  subscribeNewsletter,
  type FormState,
} from "@/app/connect/actions";

function Honeypot() {
  return (
    <div aria-hidden className="sr-only" style={{ position: "absolute", left: "-9999px" }}>
      <label htmlFor="website">Website</label>
      <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
    </div>
  );
}

function StatusButton({ children }: { children: React.ReactNode }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      style={{ ["--sweep-color" as string]: "#c9a664" }}
      className="btn-ink btn-sweep disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "Sending…" : children}
    </button>
  );
}

function StatusMessage({ state }: { state: FormState }) {
  if (state.status === "idle") return null;
  const isSuccess = state.status === "success";
  return (
    <p
      role="status"
      aria-live="polite"
      className={`mt-2 border-l-2 pl-4 text-[14px] leading-[1.6] ${
        isSuccess ? "border-gold text-ink" : "border-[#a84233] text-[#7a2f22]"
      }`}
    >
      {state.message}
    </p>
  );
}

export function ContactForm() {
  const [state, formAction] = useActionState(submitContact, initialFormState);
  return (
    <form action={formAction} className="space-y-7">
      <Honeypot />
      <div className="grid grid-cols-2 gap-6 max-md:grid-cols-1">
        <FormField id="name" label="Your Name" required autoComplete="name" />
        <FormField id="email" label="Email" type="email" required autoComplete="email" />
      </div>
      <FormField id="subject" label="Subject" required />
      <TextArea id="message" label="Message" rows={8} required />
      <StatusButton>Send Message →</StatusButton>
      <StatusMessage state={state} />
    </form>
  );
}

export function PrayerRequestForm() {
  const [state, formAction] = useActionState(submitPrayerRequest, initialFormState);
  return (
    <form action={formAction} className="space-y-7">
      <Honeypot />
      <FormField id="name" label="Your Name" required autoComplete="name" />
      <FormField
        id="email"
        label="Email Address"
        type="email"
        required
        autoComplete="email"
        helper="We will send a brief acknowledgement when your intention is received."
      />
      <TextArea
        id="intention"
        label="Your Intention"
        rows={7}
        required
        placeholder="Please remember in prayer…"
      />
      <StatusButton>Submit Intention →</StatusButton>
      <StatusMessage state={state} />
    </form>
  );
}

export function NewsletterForm() {
  const [state, formAction] = useActionState(subscribeNewsletter, initialFormState);
  return (
    <form
      action={formAction}
      className="mt-12 flex flex-col items-stretch gap-5 text-left"
    >
      <Honeypot />
      <FormField id="name" label="Your Name" required autoComplete="name" />
      <FormField
        id="email"
        label="Email"
        type="email"
        required
        autoComplete="email"
        helper="We will send an email to confirm your subscription."
      />
      <div className="mt-2 flex justify-center">
        <StatusButton>Subscribe →</StatusButton>
      </div>
      <StatusMessage state={state} />
      <p className="mt-6 text-center text-[13px] leading-[1.6] text-ink-soft">
        Your email is kept in confidence. You may unsubscribe at any time — the link is
        included in every message.
      </p>
    </form>
  );
}
