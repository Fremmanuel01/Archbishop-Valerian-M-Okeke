import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";

// Stateless HMAC-signed tokens for newsletter confirm + unsubscribe links.
// We don't keep a subscriber table in our DB — the audience lives in Resend
// — so the token has to carry the recipient identity itself. Format:
//
//   <purpose>.<email-base64url>.<exp-seconds>.<sig-base64url>
//
// The signature is HMAC-SHA256 of "<purpose>.<email>.<exp>" using
// PAYLOAD_SECRET as the key. PAYLOAD_SECRET is already required by the app
// in production, so no new env var is introduced.

type Purpose = "confirm" | "unsubscribe";

const CONFIRM_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 days for confirm links
const UNSUBSCRIBE_TTL_SECONDS = 60 * 60 * 24 * 365; // 1 year for unsub links

function getSecret(): string {
  const secret = process.env.PAYLOAD_SECRET;
  if (!secret || secret.length < 16) {
    throw new Error("PAYLOAD_SECRET is required for newsletter token signing");
  }
  return secret;
}

function b64urlEncode(value: string | Buffer): string {
  const buf = Buffer.isBuffer(value) ? value : Buffer.from(value, "utf8");
  return buf
    .toString("base64")
    .replaceAll("+", "-")
    .replaceAll("/", "_")
    .replaceAll("=", "");
}

function b64urlDecode(value: string): string {
  const padded = value.replaceAll("-", "+").replaceAll("_", "/");
  const pad = padded.length % 4 === 0 ? "" : "=".repeat(4 - (padded.length % 4));
  return Buffer.from(padded + pad, "base64").toString("utf8");
}

function sign(purpose: Purpose, email: string, exp: number): string {
  const payload = `${purpose}.${email}.${exp}`;
  const sig = createHmac("sha256", getSecret()).update(payload).digest();
  return b64urlEncode(sig);
}

export function createNewsletterToken(
  purpose: Purpose,
  email: string,
  options: { name?: string } = {},
): string {
  const ttl = purpose === "confirm" ? CONFIRM_TTL_SECONDS : UNSUBSCRIBE_TTL_SECONDS;
  const exp = Math.floor(Date.now() / 1000) + ttl;
  const normalisedEmail = email.trim().toLowerCase();
  const sig = sign(purpose, normalisedEmail, exp);
  const emailEnc = b64urlEncode(normalisedEmail);
  const nameEnc = options.name ? b64urlEncode(options.name) : "";
  return [purpose, emailEnc, String(exp), sig, nameEnc].filter(Boolean).join(".");
}

export type VerifiedToken = {
  purpose: Purpose;
  email: string;
  name: string | null;
  exp: number;
};

export function verifyNewsletterToken(
  token: string,
  expectedPurpose: Purpose,
): VerifiedToken | null {
  const parts = token.split(".");
  if (parts.length < 4 || parts.length > 5) return null;
  const [purpose, emailEnc, expStr, sig, nameEnc] = parts;
  if (purpose !== expectedPurpose) return null;

  let email = "";
  try {
    email = b64urlDecode(emailEnc);
  } catch {
    return null;
  }
  const exp = Number(expStr);
  if (!Number.isFinite(exp)) return null;
  if (exp < Math.floor(Date.now() / 1000)) return null;

  const expectedSig = sign(purpose, email, exp);
  const a = Buffer.from(sig);
  const b = Buffer.from(expectedSig);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;

  let name: string | null = null;
  if (nameEnc) {
    try {
      name = b64urlDecode(nameEnc);
    } catch {
      name = null;
    }
  }
  return { purpose: purpose as Purpose, email, name, exp };
}
