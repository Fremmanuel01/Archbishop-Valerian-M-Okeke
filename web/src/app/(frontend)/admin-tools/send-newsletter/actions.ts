"use server";

import { revalidatePath } from "next/cache";
import { getPayloadClient } from "@/lib/payload";
import { NEWSLETTER_ROLES, requireRole } from "@/lib/admin-auth";
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
import { createNewsletterToken } from "@/lib/newsletter-token";
import { SITE_URL } from "@/lib/site";

function unauthorisedSendState(
  reason: "unauthenticated" | "forbidden",
): { status: "error"; message: string } {
  return {
    status: "error",
    message:
      reason === "unauthenticated"
        ? "Please sign in to Payload before continuing."
        : "Your account does not have a newsletter role.",
  };
}

export type SendState =
  | { status: "idle" }
  | { status: "success"; message: string; broadcastId: string; sentCount: number }
  | { status: "error"; message: string };

export const initialSendState: SendState = { status: "idle" };

// State returned by edit actions on the per-edition editor page. Carries a
// freshly rendered HTML snapshot so the preview iframe can re-paint without
// a round-trip to Payload.
export type EditState =
  | { status: "idle" }
  | { status: "success"; message: string; html: string; editionStatus: string }
  | { status: "error"; message: string };

export const initialEditState: EditState = { status: "idle" };

export type EditorPostInput = {
  fbPostId?: string | null;
  permalinkUrl?: string | null;
  createdTime: string;
  message?: string | null;
  originalMessage?: string | null;
  imageUrl?: string | null;
};

export type RewriteState =
  | { status: "idle" }
  | { status: "success"; text: string }
  | { status: "error"; message: string };

export const initialRewriteState: RewriteState = { status: "idle" };

export type EditorPayload = {
  subjectLine: string;
  eyebrow: string;
  lead: string;
  posts: EditorPostInput[];
};

type NewsletterStatus =
  | "draft"
  | "ready_to_send"
  | "sending"
  | "sent"
  | "failed"
  | "skipped_no_posts";

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
  const auth = await requireRole(NEWSLETTER_ROLES);
  if (!auth.ok) return unauthorisedSendState(auth.reason);
  const payload = await getPayloadClient();

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
      message: "RESEND_AUDIENCE_ID is not set; cannot target an audience.",
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
      message: "This edition is already being sent. Wait for it to complete.",
    };
  }
  const posts = edition.posts ?? [];
  if (posts.length === 0) {
    return {
      status: "error",
      message:
        "This edition has no posts. Add posts to the edition before sending, or set status to 'Skipped: no posts this month'.",
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
    // Resend interpolates this merge tag per-recipient with the right
    // List-Unsubscribe semantics. Outside broadcasts the placeholder is not
    // expanded and the manual /unsubscribe page remains in the footer too.
    unsubscribeUrl: "{{{RESEND_UNSUBSCRIBE_URL}}}",
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
    // Append to existing errors[] rather than replacing — past failures are
    // useful diagnostic context for retries.
    const previousErrors = await payload
      .findByID({ collection: "newsletter-editions", id: edition.id })
      .then((d) => {
        const arr = (d as unknown as EditionDoc & {
          errors?: Array<{ at: string; kind: string; message: string }>;
        }).errors;
        return Array.isArray(arr) ? arr : [];
      })
      .catch(() => [] as Array<{ at: string; kind: string; message: string }>);
    await payload.update({
      collection: "newsletter-editions",
      id: edition.id,
      data: {
        status: "failed",
        errors: [
          ...previousErrors,
          {
            at: new Date().toISOString(),
            kind: "send",
            message,
          },
        ],
      },
    });
    revalidatePath("/admin-tools/send-newsletter");
    return {
      status: "error",
      message: `Send failed: ${message}`,
    };
  }
}

// Reset a failed edition back to ready_to_send so the admin can broadcast
// again. Errors[] history is preserved for audit. The edition's
// `resendBroadcastId` is also cleared so the next send creates a fresh
// broadcast — old broadcast objects in Resend are not re-triggered.
export async function retryFailedEdition(
  _prev: SendState,
  data: FormData,
): Promise<SendState> {
  const auth = await requireRole(NEWSLETTER_ROLES);
  if (!auth.ok) return unauthorisedSendState(auth.reason);
  const payload = await getPayloadClient();

  const editionId = String(data.get("editionId") ?? "").trim();
  if (!editionId) {
    return { status: "error", message: "Missing edition id." };
  }
  let edition: EditionDoc;
  try {
    edition = (await payload.findByID({
      collection: "newsletter-editions",
      id: editionId,
    })) as unknown as EditionDoc;
  } catch {
    return { status: "error", message: "Edition not found." };
  }
  if (edition.status !== "failed") {
    return {
      status: "error",
      message: `Only failed editions can be retried (current status: ${edition.status ?? "unknown"}).`,
    };
  }
  await payload.update({
    collection: "newsletter-editions",
    id: edition.id,
    data: {
      status: "ready_to_send",
      resendBroadcastId: null,
    },
  });
  revalidatePath("/admin-tools/send-newsletter");
  return {
    status: "success",
    message:
      "Edition reset to 'ready to send'. Type SEND below to broadcast again.",
    broadcastId: "",
    sentCount: 0,
  };
}

export async function previewEdition(editionId: string): Promise<string> {
  const auth = await requireRole(NEWSLETTER_ROLES);
  if (!auth.ok) return "<p>Not authorised.</p>";
  const payload = await getPayloadClient();
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
  const auth = await requireRole(NEWSLETTER_ROLES);
  if (!auth.ok) return unauthorisedSendState(auth.reason);
  const payload = await getPayloadClient();

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
    const unsubToken = createNewsletterToken("unsubscribe", testRecipient);
    const unsubscribeUrl = `${SITE_URL}/connect/newsletter/unsubscribe?token=${encodeURIComponent(unsubToken)}`;
    const html = renderNewsletterHtml({
      editionDate: new Date(edition.editionDate),
      subjectLine: edition.subjectLine,
      eyebrow: edition.eyebrow ?? undefined,
      lead: edition.lead ?? undefined,
      posts,
      unsubscribeUrl,
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

// Persist subject / eyebrow / lead / posts edits from the per-edition editor.
// Editions in `sending` or `sent` state are locked. After saving, returns a
// freshly rendered HTML snapshot so the editor's iframe preview can refresh
// without an extra fetch. Does NOT touch the `htmlSnapshot` field — that is
// only written by `sendEdition` to record exactly what subscribers received.
export async function updateEdition(
  editionId: string,
  body: EditorPayload,
): Promise<EditState> {
  const auth = await requireRole(NEWSLETTER_ROLES);
  if (!auth.ok) {
    return {
      status: "error",
      message:
        auth.reason === "unauthenticated"
          ? "You must be signed in to edit."
          : "Your account does not have a newsletter role.",
    };
  }
  const payload = await getPayloadClient();
  if (!editionId) {
    return { status: "error", message: "Missing edition id." };
  }
  const subjectLine = body.subjectLine.trim();
  if (!subjectLine) {
    return { status: "error", message: "Subject line is required." };
  }

  let edition: EditionDoc;
  try {
    edition = (await payload.findByID({
      collection: "newsletter-editions",
      id: editionId,
    })) as unknown as EditionDoc;
  } catch {
    return { status: "error", message: "Edition not found." };
  }
  if (edition.status === "sent" || edition.status === "sending") {
    return {
      status: "error",
      message: `This edition is ${edition.status}; edits are locked. Create a new edition for changes.`,
    };
  }

  // Drop empty posts (no message AND no image) so the admin can clear a row
  // by blanking both fields. Preserve fbPostId and originalMessage so the
  // raw FB caption is never lost across saves.
  const cleanPosts = body.posts
    .map((p) => ({
      fbPostId: p.fbPostId?.trim() || null,
      permalinkUrl: p.permalinkUrl?.trim() || null,
      message: p.message?.trim() || "",
      originalMessage: p.originalMessage ?? null,
      imageUrl: p.imageUrl?.trim() || null,
      createdTime: p.createdTime,
    }))
    .filter((p) => p.message.length > 0 || p.imageUrl);

  for (const p of cleanPosts) {
    const t = new Date(p.createdTime);
    if (Number.isNaN(t.getTime())) {
      return {
        status: "error",
        message: `One of the posts has an invalid date/time: ${p.createdTime}`,
      };
    }
  }

  try {
    const updated = (await payload.update({
      collection: "newsletter-editions",
      id: edition.id,
      data: {
        subjectLine,
        eyebrow: body.eyebrow.trim() || null,
        lead: body.lead.trim() || null,
        posts: cleanPosts,
      },
    })) as unknown as EditionDoc;

    const html = renderNewsletterHtml({
      editionDate: new Date(updated.editionDate),
      subjectLine: updated.subjectLine,
      eyebrow: updated.eyebrow ?? undefined,
      lead: updated.lead ?? undefined,
      posts: (updated.posts ?? []).map((p) => ({
        message: p.message ?? "",
        imageUrl: p.imageUrl ?? null,
        permalinkUrl: p.permalinkUrl ?? null,
        createdTime: new Date(p.createdTime),
      })),
    });
    revalidatePath("/admin-tools/send-newsletter");
    revalidatePath(`/admin-tools/send-newsletter/${edition.id}`);
    return {
      status: "success",
      message: `Saved · ${cleanPosts.length} post${cleanPosts.length === 1 ? "" : "s"}.`,
      html,
      editionStatus: updated.status ?? "draft",
    };
  } catch (err) {
    return {
      status: "error",
      message: `Save failed: ${err instanceof Error ? err.message : String(err)}`,
    };
  }
}

// Flip the edition's status (e.g. draft → ready_to_send, or back to draft).
// Used by the "Mark ready to send" / "Move back to draft" buttons in the
// editor. Sending and post-send transitions are normally owned by
// sendEdition, but `sending → failed` is allowed manually so admins can
// recover an edition whose function timed out mid-broadcast.
const ALLOWED_STATUS_TRANSITIONS: Record<string, string[]> = {
  draft: ["ready_to_send", "skipped_no_posts"],
  ready_to_send: ["draft", "skipped_no_posts"],
  skipped_no_posts: ["draft"],
  failed: ["draft"],
  // Manual escape hatch: when a send hangs (function timeout while Resend
  // was processing) the edition is stuck in `sending`. Admins flip it to
  // `failed`, which then unlocks the existing retry button. We do NOT
  // allow `sending → sent` or `sending → ready_to_send` here — both could
  // race with an in-flight broadcast.
  sending: ["failed"],
};

export async function markEditionStatus(
  _prev: SendState,
  data: FormData,
): Promise<SendState> {
  const auth = await requireRole(NEWSLETTER_ROLES);
  if (!auth.ok) return unauthorisedSendState(auth.reason);
  const payload = await getPayloadClient();

  const editionId = String(data.get("editionId") ?? "").trim();
  const next = String(data.get("nextStatus") ?? "").trim();
  if (!editionId || !next) {
    return { status: "error", message: "Missing edition id or status." };
  }

  let edition: EditionDoc;
  try {
    edition = (await payload.findByID({
      collection: "newsletter-editions",
      id: editionId,
    })) as unknown as EditionDoc;
  } catch {
    return { status: "error", message: "Edition not found." };
  }

  const current = edition.status ?? "draft";
  const allowed = ALLOWED_STATUS_TRANSITIONS[current] ?? [];
  if (!allowed.includes(next)) {
    return {
      status: "error",
      message: `Cannot move from ${current} to ${next}.`,
    };
  }

  // Special-case: sending → failed is a recovery flip. Append an audit
  // entry so the errors[] log captures who reset what and when, otherwise
  // the recovery is silent.
  const updatePayload: { status: NewsletterStatus; errors?: Array<{ at: string; kind: string; message: string }> } = {
    status: next as NewsletterStatus,
  };
  if (current === "sending" && next === "failed") {
    const previous = (
      (edition as unknown as {
        errors?: Array<{ at: string; kind: string; message: string }>;
      }).errors ?? []
    ).filter((e) => e && typeof e === "object");
    updatePayload.errors = [
      ...previous,
      {
        at: new Date().toISOString(),
        kind: "manual_recover",
        message: `Manually flipped from sending → failed by ${auth.user.email ?? auth.user.id}. The edition was likely stuck after a function timeout; click "Reset & retry" to broadcast again.`,
      },
    ];
  }

  await payload.update({
    collection: "newsletter-editions",
    id: edition.id,
    data: updatePayload,
  });
  revalidatePath("/admin-tools/send-newsletter");
  revalidatePath(`/admin-tools/send-newsletter/${edition.id}`);
  return {
    status: "success",
    message: `Status changed to "${next.replace(/_/g, " ")}".`,
    broadcastId: "",
    sentCount: 0,
  };
}

// AI editorial rewriter for a single post. Returns only the rewritten text;
// the caller (the editor) holds form state and persists via updateEdition.
// This keeps the action cheap and idempotent — re-clicking "Rewrite" just
// generates a fresh draft against the same source without touching Payload.
export async function rewritePostAction(input: {
  source: string;
  createdTime: string;
}): Promise<RewriteState> {
  const auth = await requireRole(NEWSLETTER_ROLES);
  if (!auth.ok) {
    return {
      status: "error",
      message:
        auth.reason === "unauthenticated"
          ? "You must be signed in to rewrite."
          : "Your account does not have a newsletter role.",
    };
  }
  const source = input.source?.trim() ?? "";
  if (!source) {
    return {
      status: "error",
      message: "No source caption to rewrite. Add the original message first.",
    };
  }
  const createdTime = new Date(input.createdTime);
  if (Number.isNaN(createdTime.getTime())) {
    return { status: "error", message: "Invalid post date." };
  }
  try {
    const { aiConfigured, rewritePostEditorially } = await import(
      "@/lib/newsletter-ai"
    );
    if (!aiConfigured()) {
      return {
        status: "error",
        message:
          "Editorial AI is not configured (ANTHROPIC_API_KEY missing).",
      };
    }
    const text = await rewritePostEditorially({ source, createdTime });
    if (!text) {
      return {
        status: "error",
        message:
          "The source caption is too sparse to rewrite. Edit it manually instead.",
      };
    }
    return { status: "success", text };
  } catch (err) {
    return {
      status: "error",
      message: `Rewrite failed: ${err instanceof Error ? err.message : String(err)}`,
    };
  }
}

// AI lead-sentence generator. Reads the current set of posts (whichever
// version the admin has in their editor — raw, edited, or rewritten) and
// returns one italic sentence for the edition's `lead` field.
export async function generateLeadAction(input: {
  editionDate: string;
  posts: Array<{ message: string; createdTime: string }>;
}): Promise<RewriteState> {
  const auth = await requireRole(NEWSLETTER_ROLES);
  if (!auth.ok) {
    return {
      status: "error",
      message:
        auth.reason === "unauthenticated"
          ? "You must be signed in."
          : "Your account does not have a newsletter role.",
    };
  }
  const editionDate = new Date(input.editionDate);
  if (Number.isNaN(editionDate.getTime())) {
    return { status: "error", message: "Invalid edition date." };
  }
  const posts = (input.posts ?? [])
    .map((p) => ({
      message: (p.message ?? "").trim(),
      createdTime: new Date(p.createdTime),
    }))
    .filter((p) => p.message.length > 0 && !Number.isNaN(p.createdTime.getTime()));
  if (posts.length === 0) {
    return {
      status: "error",
      message:
        "No posts with content to summarise. Add at least one post first.",
    };
  }
  try {
    const { aiConfigured, generateMonthlyLead } = await import(
      "@/lib/newsletter-ai"
    );
    if (!aiConfigured()) {
      return {
        status: "error",
        message:
          "Editorial AI is not configured (ANTHROPIC_API_KEY missing).",
      };
    }
    const text = await generateMonthlyLead({ posts, editionDate });
    if (!text) {
      return {
        status: "error",
        message:
          "Posts too sparse to characterise the month. Write a lead manually.",
      };
    }
    return { status: "success", text };
  } catch (err) {
    return {
      status: "error",
      message: `Lead generation failed: ${err instanceof Error ? err.message : String(err)}`,
    };
  }
}
