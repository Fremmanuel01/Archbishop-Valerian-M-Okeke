import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { PageSection, PageShell } from "@/components/shell/page-shell";
import { Latin } from "@/components/editorial";
import { getPayloadClient } from "@/lib/payload";
import { SendEditionPanel } from "@/components/send-edition-panel";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Send Newsletter",
  robots: { index: false, follow: false },
};

type EditionError = { at: string; kind: string; message: string };

type EditionRow = {
  id: string | number;
  editionDate: string;
  slug: string;
  subjectLine: string;
  status: string;
  postsCount: number;
  sentCount?: number | null;
  sentAt?: string | null;
  errors: EditionError[];
};

const STATUS_LABEL: Record<string, string> = {
  draft: "Draft",
  ready_to_send: "Ready to send",
  sending: "Sending…",
  sent: "Sent",
  failed: "Failed",
  skipped_no_posts: "Skipped",
};

export default async function SendNewsletterPage() {
  const headersList = await headers();
  const payload = await getPayloadClient();
  const { user } = await payload.auth({ headers: headersList });
  if (!user) redirect("/admin");

  const result = await payload.find({
    collection: "newsletter-editions",
    limit: 24,
    sort: "-editionDate",
  });

  const editions: EditionRow[] = result.docs.map((d) => {
    const doc = d as unknown as {
      id: string | number;
      editionDate: string;
      slug: string;
      subjectLine: string;
      status?: string;
      posts?: unknown[] | null;
      sentCount?: number | null;
      sentAt?: string | null;
      errors?: EditionError[] | null;
    };
    return {
      id: doc.id,
      editionDate: doc.editionDate,
      slug: doc.slug,
      subjectLine: doc.subjectLine,
      status: doc.status ?? "draft",
      postsCount: Array.isArray(doc.posts) ? doc.posts.length : 0,
      sentCount: doc.sentCount ?? null,
      sentAt: doc.sentAt ?? null,
      errors: Array.isArray(doc.errors) ? doc.errors : [],
    };
  });

  return (
    <PageShell
      eyebrow={<Latin>Instrumenta · Admin</Latin>}
      title="Send"
      titleAccent="Newsletter"
      lead="Review the monthly Pastoral Diary draft, send a test to your inbox, then broadcast to all subscribers via Resend. Approval-gated — nothing leaves this page automatically."
    >
      <PageSection>
        <div className="mx-auto max-w-[960px]">
          {editions.length === 0 ? (
            <div className="border border-[color:var(--rule)] bg-bone-deep p-10 text-center">
              <p className="font-[family-name:var(--font-ui)] text-[10px] font-semibold uppercase tracking-[3px] text-gold-text">
                Nothing yet
              </p>
              <p className="mt-4 text-[16px] leading-[1.65] text-ink-soft">
                The cron drafts a new edition on the 28th of each month. To
                create one manually for testing, open the{" "}
                <Link
                  href="/admin/collections/newsletter-editions/create"
                  className="link-underline text-ink"
                >
                  Newsletter Editions admin
                </Link>{" "}
                and add a record.
              </p>
            </div>
          ) : (
            <ul className="space-y-10">
              {editions.map((e) => (
                <li
                  key={e.id}
                  className="border border-[color:var(--rule)] bg-bone-deep p-7"
                >
                  <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 border-b border-[color:var(--rule)] pb-4">
                    <div>
                      <p className="font-[family-name:var(--font-ui)] text-[10px] font-semibold uppercase tracking-[2.4px] text-gold-text">
                        {STATUS_LABEL[e.status] ?? e.status} · {e.postsCount} post
                        {e.postsCount === 1 ? "" : "s"}
                      </p>
                      <h2 className="mt-2 font-[family-name:var(--font-display)] text-[26px] font-medium leading-[1.2] text-ink">
                        {e.subjectLine}
                      </h2>
                    </div>
                    <div className="flex items-center gap-5">
                      <Link
                        href={`/admin-tools/send-newsletter/${e.id}`}
                        className="link-underline font-[family-name:var(--font-ui)] text-[11px] font-semibold uppercase tracking-[2px] text-ink"
                      >
                        Preview &amp; edit →
                      </Link>
                      <Link
                        href={`/admin/collections/newsletter-editions/${e.id}`}
                        className="link-underline font-[family-name:var(--font-ui)] text-[11px] font-semibold uppercase tracking-[2px] text-ink-soft"
                      >
                        Payload ↗
                      </Link>
                    </div>
                  </div>
                  {e.errors.length > 0 ? (
                    <details className="mt-4 border border-[#e8b8b0] bg-[#fbf3f1] p-4">
                      <summary className="cursor-pointer font-[family-name:var(--font-ui)] text-[10px] font-semibold uppercase tracking-[2px] text-[#7a2f22]">
                        {e.errors.length} error
                        {e.errors.length === 1 ? "" : "s"} · open log
                      </summary>
                      <ul className="mt-3 space-y-3 text-[13px] leading-[1.55] text-[#7a2f22]">
                        {e.errors.map((err, idx) => (
                          <li
                            key={idx}
                            className="border-l-2 border-[#a84233] pl-3"
                          >
                            <p className="font-[family-name:var(--font-ui)] text-[10px] font-semibold uppercase tracking-[1.5px]">
                              {err.kind} ·{" "}
                              {new Date(err.at).toLocaleString("en-US", {
                                dateStyle: "medium",
                                timeStyle: "short",
                              })}
                            </p>
                            <p className="mt-1 whitespace-pre-wrap break-words font-[family-name:var(--font-body)]">
                              {err.message}
                            </p>
                          </li>
                        ))}
                      </ul>
                    </details>
                  ) : null}

                  {e.sentAt && e.status === "sent" ? (
                    <p className="mt-4 text-[14px] text-ink-soft">
                      Sent {new Date(e.sentAt).toLocaleString("en-US", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                      {e.sentCount != null ? ` · ${e.sentCount} subscriber${e.sentCount === 1 ? "" : "s"}` : ""}
                      .
                    </p>
                  ) : (
                    <SendEditionPanel
                      editionId={String(e.id)}
                      defaultTestRecipient={user.email ?? ""}
                      hasPosts={e.postsCount > 0}
                      status={e.status}
                    />
                  )}
                </li>
              ))}
            </ul>
          )}

          <details className="mt-12 border border-[color:var(--rule)] bg-bone-deep p-6">
            <summary className="cursor-pointer font-[family-name:var(--font-ui)] text-[11px] font-semibold uppercase tracking-[2px] text-gold-text">
              How this works
            </summary>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-[14px] leading-relaxed text-ink-soft">
              <li>
                The daily cron creates / refreshes a draft on the <strong>28th</strong> of each month at 08:00 UTC. On the <strong>last day</strong>, if the draft is still unsent, an escalation is emailed to the office.
              </li>
              <li>
                Open the edition in Payload to add, remove, or edit posts. Once you&apos;re happy, return here.
              </li>
              <li>
                <strong>Send a test</strong> first — it goes only to the address you specify. Open it on a phone and on a desktop mail client.
              </li>
              <li>
                <strong>Send to all subscribers</strong> creates a Resend Broadcast targeting the &quot;Archbishop&apos;s Office&quot; audience and triggers it. Resend handles unsubscribe and per-recipient delivery.
              </li>
              <li>
                Send is one-shot: once an edition is in <em>sent</em> state, this page locks it. To re-broadcast, create a new edition.
              </li>
            </ul>
          </details>
        </div>
      </PageSection>
    </PageShell>
  );
}
