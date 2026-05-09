"use server";

import { addAudienceContact, resendConfigured, sendEmail } from "@/lib/resend";
import { getLang } from "@/lib/lang";
import { getDict, type Lang } from "@/lib/i18n";
import { renderConfirmationHtml } from "@/lib/email-templates";
import { createNewsletterToken } from "@/lib/newsletter-token";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { SITE_URL } from "@/lib/site";
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

// Step 1 of double opt-in: send a confirmation email with an HMAC-signed
// link. We do NOT touch the Resend audience yet — that happens in step 2
// when the recipient clicks the link (see /connect/newsletter/confirm).
// This prevents drive-by subscriptions and silent re-subscription of
// previously-unsubscribed contacts.
export async function subscribeNewsletter(
  _prev: FormState,
  data: FormData,
): Promise<FormState> {
  const name = field(data, "name", MAX_NAME);
  const email = field(data, "email", MAX_NAME).toLowerCase();
  const honeypot = field(data, "website", 200);

  if (honeypot) return { status: "success", message: "Thank you." };
  if (!name || !isEmail(email)) {
    return { status: "error", message: "Please enter your name and a valid email address." };
  }
  if (!resendConfigured() || !process.env.RESEND_AUDIENCE_ID) {
    return notConfiguredError();
  }

  // Block bursts of confirmation-email sends from the same IP or to the
  // same address. The window is generous on purpose — a real subscriber
  // who mistypes their email once still gets through, but a bot scripting
  // confirmations to harass random addresses gets stopped.
  const ip = await getClientIp();
  const ipCheck = await checkRateLimit({
    action: "newsletter-subscribe-ip",
    identifier: ip,
    max: 5,
    windowSec: 600,
  });
  if (!ipCheck.ok) {
    return {
      status: "error",
      message:
        "Too many subscription attempts from this device. Please wait a few minutes and try again.",
    };
  }
  const emailCheck = await checkRateLimit({
    action: "newsletter-subscribe-email",
    identifier: email,
    max: 3,
    windowSec: 3600,
  });
  if (!emailCheck.ok) {
    // We've already sent a recent confirmation to this address — pretend
    // success rather than confirm/deny that the address is in flight.
    return {
      status: "success",
      message:
        "Almost done. Please check your inbox and click the confirmation link to complete your subscription.",
    };
  }

  try {
    const token = createNewsletterToken("confirm", email, { name });
    const confirmUrl = `${SITE_URL}/connect/newsletter/confirm?token=${encodeURIComponent(token)}`;
    const lang = await getLang();
    const t = getDict(lang);
    await sendEmail({
      to: email,
      subject: t.confirmations.newsletter.subject,
      text: fillTemplate(t.confirmations.newsletter.bodyTemplate, {
        name,
        confirmUrl,
      }),
      html: renderConfirmationHtml({
        subject: t.confirmations.newsletter.subject,
        body: fillTemplate(t.confirmations.newsletter.bodyTemplate, {
          name,
          confirmUrl,
        }),
        lang,
        cta: { label: t.confirmations.newsletter.ctaLabel, href: confirmUrl },
      }),
    });
    return {
      status: "success",
      message:
        "Almost done. Please check your inbox and click the confirmation link to complete your subscription.",
    };
  } catch (err) {
    console.warn("[connect] newsletter confirmation send failed:", err);
    return {
      status: "error",
      message: "We could not send the confirmation email. Please try again shortly.",
    };
  }
}

// Step 2 of double opt-in: invoked from the /confirm route after the
// HMAC token has been verified. Adds the contact to the Resend audience
// and sends a friendly welcome email.
export async function finaliseNewsletterSubscription(input: {
  email: string;
  name: string | null;
}): Promise<{ ok: true } | { ok: false; message: string }> {
  if (!resendConfigured() || !process.env.RESEND_AUDIENCE_ID) {
    return { ok: false, message: "Newsletter is not currently configured." };
  }
  const { email, name } = input;
  if (!isEmail(email)) return { ok: false, message: "Invalid email." };

  const displayName = (name ?? "").trim();
  const [firstName, ...rest] = displayName.split(/\s+/);

  try {
    await addAudienceContact({
      email,
      firstName: firstName || undefined,
      lastName: rest.join(" ") || undefined,
    });
  } catch (err) {
    return {
      ok: false,
      message: err instanceof Error ? err.message : "Subscription failed.",
    };
  }

  // Send a quiet welcome email (best-effort).
  try {
    const lang = await getLang();
    const t = getDict(lang);
    await sendEmail({
      to: email,
      subject: t.confirmations.newsletter.welcomeSubject,
      text: fillTemplate(t.confirmations.newsletter.welcomeBodyTemplate, {
        name: displayName || "friend",
      }),
      html: renderConfirmationHtml({
        subject: t.confirmations.newsletter.welcomeSubject,
        body: fillTemplate(t.confirmations.newsletter.welcomeBodyTemplate, {
          name: displayName || "friend",
        }),
        lang,
      }),
    });
  } catch (err) {
    console.warn("[connect] newsletter welcome send failed:", err);
  }

  return { ok: true };
}
