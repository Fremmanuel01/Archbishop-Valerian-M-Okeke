import "server-only";
import { headers } from "next/headers";

// In-memory sliding-window rate limiter. Each function instance keeps its
// own map of `<action>:<identifier>` → array of unexpired hit timestamps;
// requests beyond `max` within `windowSec` are rejected.
//
// Trade-off: an attacker who can land requests on different serverless
// instances will get up to `max × instances` allowed hits, not `max`. For
// a low-traffic Catholic site this is fine — the goal is to stop a single
// scripted form-submitter, not a distributed botnet. The previous
// implementation used a Payload-backed table for cross-instance state but
// that broke production updates when the new collection's column wasn't
// migrated into `payload_locked_documents_rels`. If we ever need durable
// rate-limit state again, store it in Upstash Redis (Vercel Marketplace)
// instead of a Payload collection.

export type RateLimitInput = {
  /** Action name — combined with the identifier into the bucket key. */
  action: string;
  /** Stable identifier such as the requester's IP or normalised email. */
  identifier: string;
  /** Maximum number of allowed hits within the window (inclusive). */
  max: number;
  /** Window length in seconds. */
  windowSec: number;
};

export type RateLimitResult =
  | { ok: true }
  | { ok: false; retryAfterSec: number };

type Bucket = number[];

const buckets = new Map<string, Bucket>();

// Cap memory usage even under sustained load. We never need more than a
// few hundred unique buckets at peak — purge the oldest if we exceed.
const MAX_BUCKETS = 5_000;

function bucketKey(action: string, identifier: string): string {
  return `${action}:${identifier.toLowerCase()}`;
}

function evictIfTooLarge(): void {
  if (buckets.size <= MAX_BUCKETS) return;
  const overflow = buckets.size - MAX_BUCKETS;
  const iterator = buckets.keys();
  for (let i = 0; i < overflow; i++) {
    const next = iterator.next();
    if (next.done) break;
    buckets.delete(next.value);
  }
}

export async function checkRateLimit(
  input: RateLimitInput,
): Promise<RateLimitResult> {
  if (input.max <= 0 || input.windowSec <= 0) return { ok: true };

  const key = bucketKey(input.action, input.identifier);
  const now = Date.now();
  const cutoff = now - input.windowSec * 1000;

  const existing = buckets.get(key) ?? [];
  // Drop expired hits.
  const fresh = existing.filter((ts) => ts > cutoff);

  if (fresh.length >= input.max) {
    buckets.set(key, fresh);
    const oldest = fresh[0] ?? now;
    const retryMs = Math.max(0, oldest + input.windowSec * 1000 - now);
    return { ok: false, retryAfterSec: Math.ceil(retryMs / 1000) };
  }

  fresh.push(now);
  buckets.set(key, fresh);
  evictIfTooLarge();
  return { ok: true };
}

// Best-effort client-IP extraction. Vercel forwards the original client
// IP in `x-forwarded-for` (left-most entry); local development exposes
// `x-real-ip`. We fall back to "unknown" so requests without an
// inferable IP still get a consistent bucket key.
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
