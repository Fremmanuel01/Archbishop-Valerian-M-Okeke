import { NextResponse } from "next/server";
import { getPayloadClient } from "@/lib/payload";
import {
  fetchPagePosts,
  isFacebookConfigured,
  type FBPost,
} from "@/lib/facebook";
import { resendConfigured, sendEmail } from "@/lib/resend";

// Daily cron entry point. Vercel hits this at 08:00 UTC every day; the
// handler decides what to do based on the day of the month.
//
//   Day 28 (or earlier in February):  Auto-create / refresh the draft for
//                                     this month. Pull all FB posts from
//                                     the page during this calendar month,
//                                     populate the edition, email admin@
//                                     "edition ready for review."
//   Last day of month:                If status is still draft or
//                                     ready_to_send, escalate to admin@.
//                                     Cron does NOT auto-send — approval
//                                     gate is permanent.
//   Other days:                       No-op (cron returns 200, "skipped").
//
// Vercel cron requests carry an Authorization: Bearer <CRON_SECRET> header
// (CRON_SECRET is auto-generated and injected by Vercel for projects that
// set up cron). We reject anything else with 401.
//
// Manual invocation for testing: hit the endpoint with the same Bearer
// header from your local shell, optionally with ?force=draft or ?force=
// escalate to bypass the date check.

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
// Cron handler can take a while if FB is slow. Cap at 300s — the Vercel
// cron will independently kill anything past that, but be explicit.
export const maxDuration = 300;

type Cmd = "draft" | "escalate" | "skip";

function decideCommand(today: Date, override: string | null): Cmd {
  if (override === "draft" || override === "escalate") return override;
  const day = today.getUTCDate();
  const lastDay = new Date(
    Date.UTC(today.getUTCFullYear(), today.getUTCMonth() + 1, 0),
  ).getUTCDate();
  if (day === 28 || (lastDay < 28 && day === lastDay - 2)) return "draft";
  if (day === lastDay) return "escalate";
  return "skip";
}

function monthSlug(d: Date): string {
  const month = d.toLocaleString("en-US", { month: "long", timeZone: "UTC" }).toLowerCase();
  return `${month}-${d.getUTCFullYear()}`;
}

function monthBounds(d: Date): { start: Date; end: Date } {
  const start = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1, 0, 0, 0));
  const end = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 1, 1, 0, 0, 0));
  return { start, end };
}

function authorised(req: Request): boolean {
  const expected = process.env.CRON_SECRET;
  if (!expected) {
    // Without a configured secret the endpoint is effectively closed —
    // refuse all calls so a misconfigured deploy can't accidentally fire.
    return false;
  }
  const auth = req.headers.get("authorization") ?? "";
  return auth === `Bearer ${expected}`;
}

export async function GET(req: Request) {
  if (!authorised(req)) {
    return NextResponse.json({ error: "unauthorised" }, { status: 401 });
  }
  const url = new URL(req.url);
  const override = url.searchParams.get("force");
  const today = new Date();
  const cmd = decideCommand(today, override);

  if (cmd === "skip") {
    return NextResponse.json({ status: "skip", date: today.toISOString() });
  }

  if (cmd === "draft") return draft(today);
  if (cmd === "escalate") return escalate(today);
  return NextResponse.json({ status: "skip" });
}

async function draft(today: Date) {
  const slug = monthSlug(today);
  const { start, end } = monthBounds(today);
  const payload = await getPayloadClient();

  // Idempotent: re-running on the 28th, 29th, etc. should not duplicate.
  const existing = await payload.find({
    collection: "newsletter-editions",
    where: { slug: { equals: slug } },
    limit: 1,
  });
  const editionId = existing.docs[0]?.id;

  // Pull FB posts (or empty if not yet configured — phase 1 ships before
  // the FB token; the draft will be empty and the Office can populate it
  // by hand if desired).
  let posts: FBPost[] = [];
  let fbError: string | null = null;
  if (isFacebookConfigured()) {
    try {
      posts = await fetchPagePosts({ since: start, until: end });
    } catch (err) {
      fbError = err instanceof Error ? err.message : String(err);
    }
  } else {
    fbError = "Facebook not yet configured (token + page id missing).";
  }

  const monthLabel = today.toLocaleString("en-US", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });

  const data: {
    editionDate: string;
    slug: string;
    subjectLine: string;
    eyebrow: string;
    lead: string;
    posts: Array<{
      fbPostId: string;
      permalinkUrl: string;
      createdTime: string;
      message: string;
      imageUrl: string | null;
    }>;
    status: "draft" | "skipped_no_posts";
    errors?: Array<{ at: string; kind: string; message: string }>;
  } = {
    editionDate: start.toISOString(),
    slug,
    subjectLine: `Pastoral Diary · ${monthLabel}`,
    eyebrow: `PASTORAL DIARY · ${monthLabel.toUpperCase()}`,
    lead: posts.length
      ? `A few moments from ${monthLabel} on the page of His Grace.`
      : "No posts were captured this month — review and either send an empty edition or skip.",
    posts: posts.map((p) => ({
      fbPostId: p.id,
      permalinkUrl: p.permalinkUrl,
      createdTime: p.createdTime.toISOString(),
      message: p.message,
      imageUrl: p.imageUrl,
    })),
    status: posts.length > 0 ? "draft" : "skipped_no_posts",
  };
  if (fbError) {
    data.errors = [
      { at: new Date().toISOString(), kind: "facebook_fetch", message: fbError },
    ];
  }

  if (editionId) {
    await payload.update({
      collection: "newsletter-editions",
      id: editionId,
      data,
    });
  } else {
    await payload.create({ collection: "newsletter-editions", data });
  }

  // Notify admin@. Best-effort — failure here does not fail the cron.
  if (resendConfigured() && process.env.CONTACT_TO) {
    try {
      const recipient = process.env.CONTACT_TO;
      const reviewUrl = "https://archbishopvalokeke.org/admin-tools/send-newsletter";
      await sendEmail({
        to: recipient,
        subject: posts.length
          ? `[Newsletter] ${monthLabel} draft ready for review`
          : `[Newsletter] ${monthLabel} skipped — no FB posts`,
        text: posts.length
          ? `The ${monthLabel} Pastoral Diary edition has been drafted with ${posts.length} post${posts.length === 1 ? "" : "s"}.

Review and send: ${reviewUrl}

— Cron`
          : `The ${monthLabel} edition has no posts (status: skipped_no_posts).

Reason: ${fbError ?? "no posts in date range"}.

If you'd like to populate the edition by hand, open ${reviewUrl} and add posts manually.

— Cron`,
      });
    } catch (err) {
      console.warn("[cron/newsletter] admin notify failed:", err);
    }
  }

  return NextResponse.json({
    status: "drafted",
    slug,
    postsCount: posts.length,
    editionStatus: data.status,
    fbError,
  });
}

async function escalate(today: Date) {
  const slug = monthSlug(today);
  const payload = await getPayloadClient();
  const found = await payload.find({
    collection: "newsletter-editions",
    where: { slug: { equals: slug } },
    limit: 1,
  });
  const edition = found.docs[0];
  if (!edition) {
    // Nothing to escalate — fall back to drafting.
    return draft(today);
  }
  const status = (edition as { status?: string }).status;
  if (status === "sent" || status === "skipped_no_posts" || status === "failed") {
    return NextResponse.json({ status: "noop", reason: `edition ${status}` });
  }

  if (resendConfigured() && process.env.CONTACT_TO) {
    try {
      const recipient = process.env.CONTACT_TO;
      const monthLabel = today.toLocaleString("en-US", {
        month: "long",
        year: "numeric",
        timeZone: "UTC",
      });
      await sendEmail({
        to: recipient,
        subject: `[Newsletter] ESCALATION — ${monthLabel} edition not yet sent`,
        text: `Today is the last day of the month and the ${monthLabel} edition is still in status: ${status}.

If the Office wishes to send, approve and trigger via:
https://archbishopvalokeke.org/admin-tools/send-newsletter

If not, set status to 'skipped_no_posts' or 'failed' to silence this escalation.

— Cron`,
      });
    } catch (err) {
      console.warn("[cron/newsletter] escalation notify failed:", err);
    }
  }

  return NextResponse.json({
    status: "escalated",
    slug,
    editionStatus: status,
  });
}
