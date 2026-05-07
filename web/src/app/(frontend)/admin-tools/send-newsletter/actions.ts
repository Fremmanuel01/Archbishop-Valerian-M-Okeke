"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { getPayloadClient } from "@/lib/payload";
import {
  createBroadcast,
  getActiveAudienceCount,
  resendConfigured,
  sendBroadcast,
} from "@/lib/resend";
import {
  renderNewsletterHtml,
  type NewsletterPost,
} from "@/lib/newsletter-template";

export type SendState =
  | { status: "idle" }
  | { status: "success"; message: string; broadcastId: string; sentCount: number }
  | { status: "error"; message: string };

export const initialSendState: SendState = { status: "idle" };

type EditionDoc = {
  id: string | number;
  editionDate: string;
  slug: string;
  subjectLine: string;
  eyebrow?: string | null;
  lead?: string | null;
  posts?: Array<{
    fbPostId?: string | null;
    permalinkUrl?: string | null;
    createdTime: string;
    message?: string | null;
    imageUrl?: string | null;
  }> | null;
  status?: string;
  resendBroadcastId?: string | null;
};

export async function sendEdition(
  _prev: SendState,
  data: FormData,
): Promise<SendState> {
  const headersList = await headers();
  const payload = await getPayloadClient();
  const { user } = await payload.auth({ headers: headersList });
  if (!user) {
    return { status: "error", message: "You must be signed in to admin to send." };
  }

  const editionId = String(data.get("editionId") ?? "").trim();
  if (!editionId) {
    return { status: "error", message: "Missing edition id." };
  }

  if (!resendConfigured()) {
    return {
      status: "error",
      message: "Resend is not configured (RESEND_API_KEY missing).",
    };
  }
  const audienceId = process.env.RESEND_AUDIENCE_ID;
  const from =
    process.env.RESEND_FROM ??
    "His Grace's Office <admin@archbishopvalokeke.org>";
  if (!audienceId) {
    return {
      status: "error",
      message: "RESEND_AUDIENCE_ID is not set — cannot target an audience.",
    };
  }

  let edition: EditionDoc;
  try {
    const found = (await payload.findByID({
      collection: "newsletter-editions",
      id: editionId,
    })) as unknown as EditionDoc;
    edition = found;
  } catch {
    return { status: "error", message: "Edition not found." };
  }

  if (edition.status === "sent") {
    return {
      status: "error",
      message: "This edition has already been sent. Create a new one for a re-send.",
    };
  }
  if (edition.status === "sending") {
    return {
      status: "error",
      message: "This edition is already being sent — wait for it to complete.",
    };
  }
  const posts = edition.posts ?? [];
  if (posts.length === 0) {
    return {
      status: "error",
      message:
        "This edition has no posts. Add posts to the edition before sending, or set status to 'Skipped — no posts this month'.",
    };
  }

  // Lock to "sending" so a double-click doesn't fire two broadcasts.
  await payload.update({
    collection: "newsletter-editions",
    id: edition.id,
    data: { status: "sending" },
  });

  const editionDate = new Date(edition.editionDate);
  const renderPosts: NewsletterPost[] = posts.map((p) => ({
    message: p.message ?? "",
    imageUrl: p.imageUrl ?? null,
    permalinkUrl: p.permalinkUrl ?? null,
    createdTime: new Date(p.createdTime),
  }));

  const html = renderNewsletterHtml({
    editionDate,
    subjectLine: edition.subjectLine,
    eyebrow: edition.eyebrow ?? undefined,
    lead: edition.lead ?? undefined,
    posts: renderPosts,
  });

  try {
    const broadcast = edition.resendBroadcastId
      ? { id: edition.resendBroadcastId }
      : await createBroadcast({
          audienceId,
          from,
          subject: edition.subjectLine,
          html,
          name: `Pastoral Diary · ${edition.slug}`,
        });

    await sendBroadcast(broadcast.id);
    const audienceCount = await getActiveAudienceCount(audienceId).catch(() => 0);

    await payload.update({
      collection: "newsletter-editions",
      id: edition.id,
      data: {
        status: "sent",
        sentAt: new Date().toISOString(),
        sentCount: audienceCount,
        resendBroadcastId: broadcast.id,
        htmlSnapshot: html,
      },
    });
    revalidatePath("/admin-tools/send-newsletter");

    return {
      status: "success",
      message: `Sent to ${audienceCount} subscriber${audienceCount === 1 ? "" : "s"} via Resend (broadcast ${broadcast.id}).`,
      broadcastId: broadcast.id,
      sentCount: audienceCount,
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    await payload.update({
      collection: "newsletter-editions",
      id: edition.id,
      data: {
        status: "failed",
        errors: [
          {
            at: new Date().toISOString(),
            kind: "send",
            message,
          },
        ],
      },
    });
    return {
      status: "error",
      message: `Send failed: ${message}`,
    };
  }
}

export async function previewEdition(editionId: string): Promise<string> {
  const headersList = await headers();
  const payload = await getPayloadClient();
  const { user } = await payload.auth({ headers: headersList });
  if (!user) return "<p>Not authorised.</p>";
  const edition = (await payload.findByID({
    collection: "newsletter-editions",
    id: editionId,
  })) as unknown as EditionDoc;
  const posts = (edition.posts ?? []).map((p) => ({
    message: p.message ?? "",
    imageUrl: p.imageUrl ?? null,
    permalinkUrl: p.permalinkUrl ?? null,
    createdTime: new Date(p.createdTime),
  }));
  return renderNewsletterHtml({
    editionDate: new Date(edition.editionDate),
    subjectLine: edition.subjectLine,
    eyebrow: edition.eyebrow ?? undefined,
    lead: edition.lead ?? undefined,
    posts,
  });
}

export async function sendTestEdition(
  _prev: SendState,
  data: FormData,
): Promise<SendState> {
  // Send the edition's HTML to a single address (the admin's email) for
  // visual review before broadcasting to the whole audience.
  const headersList = await headers();
  const payload = await getPayloadClient();
  const { user } = await payload.auth({ headers: headersList });
  if (!user) return { status: "error", message: "Not authorised." };

  const editionId = String(data.get("editionId") ?? "").trim();
  const testRecipient = String(data.get("testRecipient") ?? "").trim();
  if (!editionId || !testRecipient) {
    return { status: "error", message: "Missing edition id or test recipient." };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(testRecipient)) {
    return { status: "error", message: "Test recipient must be a valid email address." };
  }
  if (!resendConfigured()) {
    return { status: "error", message: "Resend not configured." };
  }

  try {
    const edition = (await payload.findByID({
      collection: "newsletter-editions",
      id: editionId,
    })) as unknown as EditionDoc;
    const posts = (edition.posts ?? []).map((p) => ({
      message: p.message ?? "",
      imageUrl: p.imageUrl ?? null,
      permalinkUrl: p.permalinkUrl ?? null,
      createdTime: new Date(p.createdTime),
    }));
    const html = renderNewsletterHtml({
      editionDate: new Date(edition.editionDate),
      subjectLine: edition.subjectLine,
      eyebrow: edition.eyebrow ?? undefined,
      lead: edition.lead ?? undefined,
      posts,
    });
    const { sendEmail } = await import("@/lib/resend");
    await sendEmail({
      to: testRecipient,
      subject: `[TEST] ${edition.subjectLine}`,
      text: `Test render of ${edition.subjectLine}. View the HTML version in a real mail client.`,
      html,
    });
    return {
      status: "success",
      message: `Test sent to ${testRecipient}. Inspect the rendered HTML before broadcasting.`,
      broadcastId: "",
      sentCount: 1,
    };
  } catch (err) {
    return {
      status: "error",
      message: `Test send failed: ${err instanceof Error ? err.message : String(err)}`,
    };
  }
}
