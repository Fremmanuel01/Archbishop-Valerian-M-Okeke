"use server";

import { addAudienceContact, resendConfigured, sendEmail } from "@/lib/resend";
import { getLang } from "@/lib/lang";
import { getDict, type Lang } from "@/lib/i18n";
import { renderConfirmationHtml } from "@/lib/email-templates";
import type { FormState } from "./form-state";

const MAX_NAME = 120;
const MAX_SUBJECT = 200;
const MAX_BODY = 5000;

function field(data: FormData, key: string, max: number): string {
  const raw = data.get(key);
  if (typeof raw !== "string") return "";
  return raw.trim().slice(0, max);
}

function isEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function notConfiguredError(): FormState {
  return {
    status: "error",
    message:
      "Submissions are temporarily unavailable. Please write directly to the Chancery.",
  };
}

function contactRecipient(): string | null {
  return process.env.CONTACT_TO ?? null;
}

function prayerRecipient(): string | null {
  return process.env.PRAYER_TO ?? null;
}

// Send a confirmation back to the form submitter. Failures are swallowed —
// the primary notification to the Chancery has already succeeded by the time
// we get here, so a confirmation hiccup must not flip the form into an error
// state for the user. The body text is sent as the plaintext fallback;
// branded HTML is rendered alongside via renderConfirmationHtml.
async function sendConfirmation(input: {
  to: string;
  subject: string;
  body: string;
  lang: Lang;
}): Promise<void> {
  try {
    await sendEmail({
      to: input.to,
      subject: input.subject,
      text: input.body,
      html: renderConfirmationHtml({
        subject: input.subject,
        body: input.body,
        lang: input.lang,
      }),
    });
  } catch (err) {
    console.warn("[connect] confirmation send failed:", err);
  }
}

function fillTemplate(
  template: string,
  values: Record<string, string>,
): string {
  return Object.entries(values).reduce(
    (acc, [key, value]) => acc.replaceAll(`{${key}}`, value),
    template,
  );
}

export async function submitContact(
  _prev: FormState,
  data: FormData,
): Promise<FormState> {
  const name = field(data, "name", MAX_NAME);
  const email = field(data, "email", MAX_NAME);
  const subject = field(data, "subject", MAX_SUBJECT);
  const message = field(data, "message", MAX_BODY);
  const honeypot = field(data, "website", 200);

  if (honeypot) return { status: "success", message: "Thank you." };
  if (!name || !isEmail(email) || !subject || !message) {
    return { status: "error", message: "Please complete every field with a valid email." };
  }
  const recipient = contactRecipient();
  if (!resendConfigured() || !recipient) return notConfiguredError();

  try {
    await sendEmail({
      to: recipient,
      subject: `[Website contact] ${subject}`,
      text: `From: ${name} <${email}>\n\n${message}`,
      replyTo: email,
    });
    const lang = await getLang();
    const t = getDict(lang);
    await sendConfirmation({
      to: email,
      subject: t.confirmations.contact.subject,
      body: fillTemplate(t.confirmations.contact.bodyTemplate, { name, subject }),
      lang,
    });
    return {
      status: "success",
      message:
        "Your message has been received. A confirmation has been sent to your email; the Chancery will respond as soon as possible.",
    };
  } catch {
    return {
      status: "error",
      message: "We could not send your message. Please try again in a few minutes.",
    };
  }
}

export async function submitPrayerRequest(
  _prev: FormState,
  data: FormData,
): Promise<FormState> {
  const name = field(data, "name", MAX_NAME);
  const email = field(data, "email", MAX_NAME);
  const intention = field(data, "intention", MAX_BODY);
  const honeypot = field(data, "website", 200);

  if (honeypot) return { status: "success", message: "Thank you." };
  if (!name || !isEmail(email) || !intention) {
    return { status: "error", message: "Please share your name, email, and intention." };
  }
  const recipient = prayerRecipient();
  if (!resendConfigured() || !recipient) return notConfiguredError();

  try {
    await sendEmail({
      to: recipient,
      subject: `Prayer intention from ${name}`,
      text: `From: ${name} <${email}>\n\nIntention:\n${intention}`,
      replyTo: email,
    });
    const lang = await getLang();
    const t = getDict(lang);
    await sendConfirmation({
      to: email,
      subject: t.confirmations.prayer.subject,
      body: fillTemplate(t.confirmations.prayer.bodyTemplate, { name }),
      lang,
    });
    return {
      status: "success",
      message:
        "Your intention has been received and will be remembered at the cathedral altar. A confirmation is on its way to your inbox.",
    };
  } catch {
    return {
      status: "error",
      message: "We could not deliver your intention. Please try again shortly.",
    };
  }
}

export async function subscribeNewsletter(
  _prev: FormState,
  data: FormData,
): Promise<FormState> {
  const name = field(data, "name", MAX_NAME);
  const email = field(data, "email", MAX_NAME);
  const honeypot = field(data, "website", 200);

  if (honeypot) return { status: "success", message: "Thank you." };
  if (!name || !isEmail(email)) {
    return { status: "error", message: "Please enter your name and a valid email address." };
  }
  if (!resendConfigured() || !process.env.RESEND_AUDIENCE_ID) {
    return notConfiguredError();
  }

  const [firstName, ...rest] = name.split(/\s+/);
  try {
    await addAudienceContact({
      email,
      firstName: firstName || undefined,
      lastName: rest.join(" ") || undefined,
    });
    const lang = await getLang();
    const t = getDict(lang);
    await sendConfirmation({
      to: email,
      subject: t.confirmations.newsletter.subject,
      body: fillTemplate(t.confirmations.newsletter.bodyTemplate, { name }),
      lang,
    });
    return {
      status: "success",
      message:
        "You are subscribed. A welcome message has been sent to your inbox — thank you.",
    };
  } catch {
    return {
      status: "error",
      message: "We could not complete your subscription. Please try again shortly.",
    };
  }
}
