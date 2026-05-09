"use server";

import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { verifyNewsletterToken } from "@/lib/newsletter-token";
import { resendConfigured, unsubscribeAudienceContact } from "@/lib/resend";

export type UnsubscribeState =
  | { status: "idle" }
  | { status: "success"; email: string }
  | { status: "error"; message: string };

export const initialUnsubscribeState: UnsubscribeState = { status: "idle" };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

async function performUnsubscribe(email: string): Promise<UnsubscribeState> {
  if (!resendConfigured()) {
    return {
      status: "error",
      message: "Newsletter service is unavailable. Please try again later.",
    };
  }
  const audienceId = process.env.RESEND_AUDIENCE_ID;
  if (!audienceId) {
    return {
      status: "error",
      message: "Newsletter service is not configured.",
    };
  }
  const result = await unsubscribeAudienceContact({ audienceId, email });
  if (result.ok || result.status === 404) {
    return { status: "success", email };
  }
  return {
    status: "error",
    message: `We could not unsubscribe that address (${result.status}). Please write to the Chancery.`,
  };
}

// Token-driven path. The unsubscribe link in every email points at this
// page on GET; the page renders a confirmation button that submits this
// action on POST. We deliberately do NOT process the unsubscribe on the
// GET request because email-security scanners (Outlook ATP, Mimecast,
// GSuite anti-phishing, link-warmers in general) prefetch every URL in
// inbound mail and a GET-side unsubscribe would silently remove
// legitimate readers as soon as the message hit their inbox.
export async function confirmTokenUnsubscribe(
  _prev: UnsubscribeState,
  data: FormData,
): Promise<UnsubscribeState> {
  const token = String(data.get("token") ?? "").trim();
  if (!token) {
    return { status: "error", message: "Missing or expired unsubscribe link." };
  }
  const verified = verifyNewsletterToken(token, "unsubscribe");
  if (!verified) {
    return {
      status: "error",
      message:
        "Unsubscribe link is invalid or has expired. Use the manual form below.",
    };
  }
  return performUnsubscribe(verified.email);
}

// Manual-form fallback path: a visitor who lost their unsubscribe link
// can still type their email here. We don't require the HMAC token in
// this case. Resend's contacts endpoint is idempotent, so the worst case
// is that somebody else types in your email and removes you, which is
// the desired outcome anyway (you wanted off the list). The IP rate
// limit below caps how fast a single device can do this so the form
// can't be scripted to pre-emptively unsubscribe arbitrary addresses.
export async function submitUnsubscribe(
  _prev: UnsubscribeState,
  data: FormData,
): Promise<UnsubscribeState> {
  const email = String(data.get("email") ?? "").trim().toLowerCase();
  if (!EMAIL_RE.test(email)) {
    return { status: "error", message: "Please enter a valid email address." };
  }
  const ip = await getClientIp();
  const ipCheck = await checkRateLimit({
    action: "newsletter-unsubscribe-ip",
    identifier: ip,
    max: 10,
    windowSec: 600,
  });
  if (!ipCheck.ok) {
    return {
      status: "error",
      message:
        "Too many unsubscribe attempts from this device. Please wait a few minutes and try again.",
    };
  }
  return performUnsubscribe(email);
}
