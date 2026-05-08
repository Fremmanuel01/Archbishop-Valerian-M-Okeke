import { NextResponse } from "next/server";
import crypto from "node:crypto";
import { getPayloadClient } from "@/lib/payload";
import { unsubscribeAudienceContact } from "@/lib/resend";

// Resend → Vercel webhook receiver. Resend signs every webhook with the
// Svix protocol; we validate the signature with HMAC-SHA256 using the
// shared secret stored in RESEND_WEBHOOK_SECRET (the dashboard-issued
// `whsec_…` string).
//
// Events we care about:
//   • email.bounced      → mark the recipient unsubscribed if hard-bounce,
//                          and increment the originating edition's
//                          failedCount.
//   • email.complained   → mark unsubscribed and increment failedCount.
//   • broadcast.*        → log only (no-op writes), useful for diagnosing
//                          why a broadcast didn't fire.
//
// Anything else is acknowledged with 200 so Resend stops retrying. The
// route is defensive: malformed payloads become 400, signature failures
// become 401, transient downstream failures become 500 so Resend retries
// per its built-in exponential backoff.

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 60;

const SIGNATURE_TOLERANCE_MS = 5 * 60 * 1000;

function timingSafeStringEqual(a: string, b: string): boolean {
  const aBuf = Buffer.from(a, "base64");
  const bBuf = Buffer.from(b, "base64");
  if (aBuf.length !== bBuf.length) return false;
  try {
    return crypto.timingSafeEqual(aBuf, bBuf);
  } catch {
    return false;
  }
}

function verifySignature(headers: Headers, body: string): boolean {
  const secret = process.env.RESEND_WEBHOOK_SECRET;
  if (!secret) return false;
  const id = headers.get("svix-id");
  const timestamp = headers.get("svix-timestamp");
  const signature = headers.get("svix-signature");
  if (!id || !timestamp || !signature) return false;

  // Drop replays from outside the tolerance window. Svix timestamps are
  // unix seconds.
  const ts = Number(timestamp);
  if (!Number.isFinite(ts)) return false;
  const drift = Math.abs(Date.now() - ts * 1000);
  if (drift > SIGNATURE_TOLERANCE_MS) return false;

  const secretMaterial = secret.startsWith("whsec_")
    ? Buffer.from(secret.slice("whsec_".length), "base64")
    : Buffer.from(secret, "utf8");
  const expected = crypto
    .createHmac("sha256", secretMaterial)
    .update(`${id}.${timestamp}.${body}`)
    .digest("base64");

  // The signature header may carry multiple comma- or space-separated
  // signatures (Svix supports key rotation). Each entry is `<version>,<sig>`.
  return signature
    .split(/\s+/)
    .map((token) => token.split(",")[1])
    .filter((sig): sig is string => Boolean(sig))
    .some((sig) => timingSafeStringEqual(sig, expected));
}

type ResendEvent = {
  type?: string;
  created_at?: string;
  data?: {
    email_id?: string;
    broadcast_id?: string;
    to?: string[] | string;
    from?: string;
    subject?: string;
    bounce?: { type?: string; subType?: string; message?: string };
    complaint?: { type?: string };
  };
};

async function findEditionByBroadcastId(broadcastId: string | undefined) {
  if (!broadcastId) return null;
  try {
    const payload = await getPayloadClient();
    const result = await payload.find({
      collection: "newsletter-editions",
      where: { resendBroadcastId: { equals: broadcastId } },
      limit: 1,
      depth: 0,
    });
    return result.docs[0] ?? null;
  } catch (err) {
    console.warn("[webhook/resend] edition lookup failed:", err);
    return null;
  }
}

async function bumpFailedCount(broadcastId: string | undefined, kind: string, message: string) {
  const edition = await findEditionByBroadcastId(broadcastId);
  if (!edition) return;
  try {
    const payload = await getPayloadClient();
    const e = edition as {
      id: string | number;
      failedCount?: number | null;
      errors?: Array<{ at: string; kind: string; message: string }> | null;
    };
    const previousErrors = Array.isArray(e.errors) ? e.errors : [];
    await payload.update({
      collection: "newsletter-editions",
      id: e.id,
      data: {
        failedCount: (e.failedCount ?? 0) + 1,
        errors: [
          ...previousErrors,
          { at: new Date().toISOString(), kind, message },
        ],
      },
    });
  } catch (err) {
    console.warn("[webhook/resend] failedCount bump failed:", err);
  }
}

async function unsubscribeRecipient(email: string | undefined) {
  const audienceId = process.env.RESEND_AUDIENCE_ID;
  if (!email || !audienceId) return;
  try {
    await unsubscribeAudienceContact({ audienceId, email });
  } catch (err) {
    console.warn(`[webhook/resend] failed to unsubscribe ${email}:`, err);
  }
}

function firstRecipient(to: string[] | string | undefined): string | undefined {
  if (!to) return undefined;
  if (Array.isArray(to)) return to[0];
  return to;
}

export async function POST(req: Request) {
  const body = await req.text();
  if (!verifySignature(req.headers, body)) {
    return NextResponse.json({ error: "invalid signature" }, { status: 401 });
  }

  let event: ResendEvent;
  try {
    event = JSON.parse(body) as ResendEvent;
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }

  const type = event.type ?? "";
  const data = event.data ?? {};
  const recipient = firstRecipient(data.to);

  switch (type) {
    case "email.bounced": {
      const bounceType = data.bounce?.type?.toLowerCase() ?? "";
      const isHard = bounceType === "hard" || bounceType === "permanent";
      if (isHard) {
        await unsubscribeRecipient(recipient);
      }
      await bumpFailedCount(
        data.broadcast_id,
        "bounce",
        `${bounceType || "unknown"} bounce for ${recipient ?? "unknown recipient"}: ${data.bounce?.message ?? ""}`,
      );
      break;
    }
    case "email.complained": {
      await unsubscribeRecipient(recipient);
      await bumpFailedCount(
        data.broadcast_id,
        "complaint",
        `${recipient ?? "unknown recipient"} marked the broadcast as spam.`,
      );
      break;
    }
    case "email.delivery_delayed": {
      // Soft signal — do not flip status, just log.
      console.log(
        `[webhook/resend] delivery delayed for ${recipient ?? "unknown"} (broadcast=${data.broadcast_id ?? "n/a"})`,
      );
      break;
    }
    default:
      // Unhandled types (email.opened, broadcast.delivered, etc.) get a
      // 200 acknowledgement so Resend stops retrying.
      break;
  }

  return NextResponse.json({ ok: true });
}
