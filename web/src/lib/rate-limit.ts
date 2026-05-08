import "server-only";
import { headers } from "next/headers";
import { getPayloadClient } from "@/lib/payload";

// Sliding-window rate-limit helper backed by the `rate-limits` Payload
// collection. Designed for low-volume public forms (newsletter signup,
// unsubscribe, prayer requests) where a tiny amount of latency on each
// submission is acceptable and request volume per IP is single-digit
// per minute. Not appropriate for hot paths.
//
// Each call:
//   1. Prunes any expired rows for `key` (best-effort cleanup).
//   2. Counts remaining rows for `key`.
//   3. If count >= max, returns { ok: false, retryAfter }.
//   4. Otherwise inserts a fresh row with `expiresAt = now + windowSec`.
//
// Failures are swallowed and treated as "ok" — a broken rate limiter must
// never block a legitimate user. Logged via console.warn.

export type RateLimitInput = {
  /** Action name — combined with the identifier into the row's key.
   *  Example: "newsletter-subscribe". */
  action: string;
  /** A stable identifier such as the requester's IP or normalised email.
   *  Pass an empty string and the rate limit becomes a global throttle. */
  identifier: string;
  /** Maximum number of allowed hits within the window (inclusive). */
  max: number;
  /** Window length in seconds. */
  windowSec: number;
};

export type RateLimitResult =
  | { ok: true }
  | { ok: false; retryAfterSec: number };

const RATE_LIMITS_SLUG = "rate-limits" as const;

function buildKey(action: string, identifier: string): string {
  // Lowercase the identifier so the rate limit keys consistently across
  // case variations of email addresses or upper/lowercase IP letters.
  return `${action}:${identifier.toLowerCase()}`;
}

export async function checkRateLimit(
  input: RateLimitInput,
): Promise<RateLimitResult> {
  if (input.max <= 0 || input.windowSec <= 0) return { ok: true };
  const key = buildKey(input.action, input.identifier);
  const now = new Date();
  const expiresAt = new Date(now.getTime() + input.windowSec * 1000);

  let payload: Awaited<ReturnType<typeof getPayloadClient>>;
  try {
    payload = await getPayloadClient();
  } catch (err) {
    console.warn("[rate-limit] payload client unavailable, allowing:", err);
    return { ok: true };
  }

  // Best-effort cleanup. Errors are swallowed so a transient db blip can
  // never escalate into a denial of service for legitimate visitors.
  try {
    const expired = await payload.find({
      collection: RATE_LIMITS_SLUG,
      where: {
        and: [
          { key: { equals: key } },
          { expiresAt: { less_than: now.toISOString() } },
        ],
      },
      limit: 100,
      pagination: false,
      depth: 0,
    });
    if (expired.docs.length > 0) {
      await Promise.all(
        expired.docs.map((doc) =>
          payload
            .delete({
              collection: RATE_LIMITS_SLUG,
              id: (doc as { id: string | number }).id,
            })
            .catch(() => null),
        ),
      );
    }
  } catch (err) {
    console.warn("[rate-limit] cleanup failed:", err);
  }

  let activeCount: number;
  let oldestExpiry: Date | null = null;
  try {
    const active = await payload.find({
      collection: RATE_LIMITS_SLUG,
      where: {
        and: [
          { key: { equals: key } },
          { expiresAt: { greater_than_equal: now.toISOString() } },
        ],
      },
      sort: "expiresAt",
      limit: input.max + 1,
      pagination: false,
      depth: 0,
    });
    activeCount = active.docs.length;
    const first = active.docs[0] as { expiresAt?: string } | undefined;
    if (first?.expiresAt) oldestExpiry = new Date(first.expiresAt);
  } catch (err) {
    console.warn("[rate-limit] active count read failed, allowing:", err);
    return { ok: true };
  }

  if (activeCount >= input.max) {
    const retryMs = oldestExpiry
      ? Math.max(0, oldestExpiry.getTime() - now.getTime())
      : input.windowSec * 1000;
    return { ok: false, retryAfterSec: Math.ceil(retryMs / 1000) };
  }

  try {
    await payload.create({
      collection: RATE_LIMITS_SLUG,
      data: { key, expiresAt: expiresAt.toISOString() },
    });
  } catch (err) {
    console.warn("[rate-limit] write failed, allowing:", err);
  }

  return { ok: true };
}

// Best-effort client-IP extraction. Vercel forwards the original client IP
// in `x-forwarded-for` (left-most entry); local development exposes
// `x-real-ip`; we fall back to the literal string "unknown" so requests
// without an inferable IP still get a consistent rate limit identifier.
export async function getClientIp(): Promise<string> {
  try {
    const h = await headers();
    const xff = h.get("x-forwarded-for");
    if (xff) {
      const first = xff.split(",")[0]?.trim();
      if (first) return first;
    }
    const real = h.get("x-real-ip");
    if (real) return real.trim();
  } catch {
    // headers() throws outside a request context — fall through to default.
  }
  return "unknown";
}
