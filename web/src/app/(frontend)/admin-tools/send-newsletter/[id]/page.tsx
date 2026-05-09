import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { PageSection, PageShell } from "@/components/shell/page-shell";
import { Latin } from "@/components/editorial";
import { EditionEditor } from "@/components/edition-editor";
import { SendEditionPanel } from "@/components/send-edition-panel";
import { getAdminUserOr403, NEWSLETTER_ROLES } from "@/lib/admin-auth";
import { getPayloadClient } from "@/lib/payload";
import {
  renderNewsletterHtml,
  type NewsletterPost,
} from "@/lib/newsletter-template";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Edit Newsletter Edition",
  robots: { index: false, follow: false },
};

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
    originalMessage?: string | null;
    imageUrl?: string | null;
  }> | null;
  status?: string;
  sentAt?: string | null;
  sentCount?: number | null;
  errors?: Array<{ at: string; kind: string; message: string }> | null;
};

export default async function EditEditionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const auth = await getAdminUserOr403(NEWSLETTER_ROLES);
  if (!auth.user) {
    if (auth.reason === "unauthenticated") redirect("/admin");
    return (
      <PageShell
        eyebrow={<Latin>Instrumenta · Edit Edition</Latin>}
        title="Not"
        titleAccent="Authorised"
        lead="This page requires a newsletter editor or admin role."
      >
        <PageSection>
          <div className="mx-auto max-w-[600px] border border-[color:var(--rule)] bg-bone-deep p-8 text-center">
            <Link
              href="/admin"
              className="link-underline font-[family-name:var(--font-ui)] text-[11px] uppercase tracking-[1.5px] text-ink"
            >
              Return to Payload admin
            </Link>
          </div>
        </PageSection>
      </PageShell>
    );
  }
  const user = auth.user;
  const payload = await getPayloadClient();

  let edition: EditionDoc;
  try {
    edition = (await payload.findByID({
      collection: "newsletter-editions",
      id,
    })) as unknown as EditionDoc;
  } catch {
    notFound();
  }

  const posts = (edition.posts ?? []).map((p) => ({
    fbPostId: p.fbPostId ?? null,
    permalinkUrl: p.permalinkUrl ?? null,
    message: p.message ?? "",
    originalMessage: p.originalMessage ?? null,
    imageUrl: p.imageUrl ?? null,
    createdTime: p.createdTime,
  }));
  const renderPosts: NewsletterPost[] = posts.map((p) => ({
    message: p.message,
    imageUrl: p.imageUrl,
    permalinkUrl: p.permalinkUrl,
    createdTime: new Date(p.createdTime),
  }));
  const initialHtml = renderNewsletterHtml({
    editionDate: new Date(edition.editionDate),
    subjectLine: edition.subjectLine,
    eyebrow: edition.eyebrow ?? undefined,
    lead: edition.lead ?? undefined,
    posts: renderPosts,
  });

  const status = edition.status ?? "draft";
  const sentLabel =
    status === "sent" && edition.sentAt
      ? `Sent ${new Date(edition.sentAt).toLocaleString("en-GB", {
          day: "numeric",
          month: "long",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })}${
          edition.sentCount != null
            ? ` · ${edition.sentCount} subscriber${edition.sentCount === 1 ? "" : "s"}`
            : ""
        }`
      : null;

  return (
    <PageShell
      eyebrow={<Latin>Instrumenta · Edit Edition</Latin>}
      title="Edit"
      titleAccent={edition.subjectLine}
      lead="Review the rendered preview, edit any post, then mark the edition ready and broadcast. Nothing is sent until you confirm."
    >
      <PageSection>
        <div className="mx-auto max-w-[1400px]">
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-[color:var(--rule)] pb-4 font-[family-name:var(--font-ui)] text-[11px] font-semibold uppercase tracking-[2px]">
            <Link
              href="/admin-tools/send-newsletter"
              className="link-underline text-ink"
            >
              ← All editions
            </Link>
            <Link
              href={`/admin/collections/newsletter-editions/${edition.id}`}
              className="link-underline text-ink-soft"
              target="_blank"
              rel="noreferrer"
            >
              Open in Payload ↗
            </Link>
          </div>

          {sentLabel ? (
            <p className="mb-6 border-l-2 border-gold pl-4 text-[14px] italic text-ink-soft">
              {sentLabel}. This edition is locked. Create a new edition for
              any further changes.
            </p>
          ) : null}

          <EditionEditor
            editionId={String(edition.id)}
            editionDate={edition.editionDate}
            initialHtml={initialHtml}
            initialStatus={status}
            initial={{
              subjectLine: edition.subjectLine,
              eyebrow: edition.eyebrow ?? "",
              lead: edition.lead ?? "",
              posts,
            }}
          />

          {status !== "sent" ? (
            <div className="mt-12 border-t border-[color:var(--rule)] pt-8">
              <h2 className="font-[family-name:var(--font-ui)] text-[10px] font-semibold uppercase tracking-[2.4px] text-gold-text">
                Send
              </h2>
              <p className="mt-2 max-w-[720px] text-[14px] leading-[1.6] text-ink-soft">
                Send a test to your inbox first to confirm the rendered email
                looks right in a real mail client. Then confirm the broadcast.
              </p>
              <div className="mt-4 max-w-[720px]">
                <SendEditionPanel
                  editionId={String(edition.id)}
                  defaultTestRecipient={user.email ?? ""}
                  hasPosts={posts.length > 0}
                  status={status}
                />
              </div>
            </div>
          ) : null}
        </div>
      </PageSection>
    </PageShell>
  );
}
