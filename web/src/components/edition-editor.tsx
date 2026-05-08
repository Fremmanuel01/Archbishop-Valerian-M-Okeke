"use client";

import { useActionState, useId, useState, useTransition } from "react";
import { NewsletterIframe } from "@/components/newsletter-iframe";
import {
  initialEditState,
  initialSendState,
  markEditionStatus,
  updateEdition,
  type EditState,
  type EditorPostInput,
  type SendState,
} from "@/app/(frontend)/admin-tools/send-newsletter/actions";

// Per-edition editor: left column edits subject/eyebrow/lead and the post
// list; right column is a live preview iframe driven by the rendered HTML
// that the server action returns after each Save. The "Mark ready to send"
// buttons gate the broadcast workflow without sending Payload anywhere.

type Post = EditorPostInput & {
  // Stable client-side key — Payload's row id may not exist on freshly
  // appended rows.
  _key: string;
};

type Props = {
  editionId: string;
  initialHtml: string;
  initialStatus: string;
  initial: {
    subjectLine: string;
    eyebrow: string;
    lead: string;
    posts: EditorPostInput[];
  };
};

const STATUS_LABEL: Record<string, string> = {
  draft: "Draft",
  ready_to_send: "Ready to send",
  sending: "Sending…",
  sent: "Sent",
  failed: "Failed",
  skipped_no_posts: "Skipped — no posts",
};

// `<input type="datetime-local">` returns and accepts a "YYYY-MM-DDTHH:mm"
// string in the user's local time. We persist absolute UTC ISO strings, so
// translate at the boundary.
function isoToLocalInput(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
function localInputToIso(local: string): string {
  if (!local) return new Date().toISOString();
  const d = new Date(local);
  if (Number.isNaN(d.getTime())) return new Date().toISOString();
  return d.toISOString();
}

function genKey(): string {
  return `p_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

function StatusBanner({ state }: { state: EditState | SendState }) {
  if (state.status === "idle") return null;
  const isSuccess = state.status === "success";
  return (
    <p
      role="status"
      aria-live="polite"
      className={`mt-3 border-l-2 pl-3 text-[13px] leading-[1.55] ${
        isSuccess ? "border-gold text-ink" : "border-[#a84233] text-[#7a2f22]"
      }`}
    >
      {state.message}
    </p>
  );
}

export function EditionEditor({
  editionId,
  initialHtml,
  initialStatus,
  initial,
}: Props) {
  const subjectId = useId();
  const eyebrowId = useId();
  const leadId = useId();

  const [subjectLine, setSubjectLine] = useState(initial.subjectLine);
  const [eyebrow, setEyebrow] = useState(initial.eyebrow);
  const [lead, setLead] = useState(initial.lead);
  const [posts, setPosts] = useState<Post[]>(() =>
    initial.posts.map((p) => ({ ...p, _key: genKey() })),
  );
  const [previewHtml, setPreviewHtml] = useState(initialHtml);
  const [status, setStatus] = useState(initialStatus);
  const [editState, setEditState] = useState<EditState>(initialEditState);
  const [isPending, startTransition] = useTransition();
  const [statusState, statusAction] = useActionState(
    markEditionStatus,
    initialSendState,
  );

  // Editions in `sending` or `sent` state are read-only.
  const locked = status === "sending" || status === "sent";

  function patchPost(key: string, patch: Partial<Post>) {
    setPosts((prev) =>
      prev.map((p) => (p._key === key ? { ...p, ...patch } : p)),
    );
  }
  function movePost(key: string, dir: -1 | 1) {
    setPosts((prev) => {
      const idx = prev.findIndex((p) => p._key === key);
      if (idx < 0) return prev;
      const next = idx + dir;
      if (next < 0 || next >= prev.length) return prev;
      const copy = prev.slice();
      const [item] = copy.splice(idx, 1);
      copy.splice(next, 0, item);
      return copy;
    });
  }
  function deletePost(key: string) {
    setPosts((prev) => prev.filter((p) => p._key !== key));
  }
  function addPost() {
    setPosts((prev) => [
      ...prev,
      {
        _key: genKey(),
        fbPostId: null,
        permalinkUrl: null,
        message: "",
        imageUrl: null,
        createdTime: new Date().toISOString(),
      },
    ]);
  }

  function onSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (locked) return;
    const body = {
      subjectLine,
      eyebrow,
      lead,
      posts: posts.map((p) => ({
        fbPostId: p.fbPostId ?? null,
        permalinkUrl: p.permalinkUrl ?? null,
        message: p.message ?? "",
        imageUrl: p.imageUrl ?? null,
        createdTime: p.createdTime,
      })),
    };
    startTransition(async () => {
      const result = await updateEdition(editionId, body);
      setEditState(result);
      if (result.status === "success") {
        setPreviewHtml(result.html);
        setStatus(result.editionStatus);
      }
    });
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      {/* LEFT — edit form */}
      <form onSubmit={onSave} className="space-y-8">
        {/* Edition meta */}
        <section className="space-y-5">
          <header className="flex items-baseline justify-between gap-4 border-b border-[color:var(--rule)] pb-2">
            <h2 className="font-[family-name:var(--font-ui)] text-[10px] font-semibold uppercase tracking-[2.4px] text-gold-text">
              Edition
            </h2>
            <p className="font-[family-name:var(--font-ui)] text-[10px] font-semibold uppercase tracking-[2px] text-ink-soft">
              Status · {STATUS_LABEL[status] ?? status}
            </p>
          </header>

          <label htmlFor={subjectId} className="block">
            <span className="block font-[family-name:var(--font-ui)] text-[10px] font-semibold uppercase tracking-[2.4px] text-gold-text">
              Subject line
            </span>
            <input
              id={subjectId}
              type="text"
              value={subjectLine}
              onChange={(e) => setSubjectLine(e.target.value)}
              disabled={locked}
              required
              className="mt-2 block w-full border border-[color:var(--rule)] bg-bone px-3 py-2 font-[family-name:var(--font-display)] text-[20px] text-ink focus:outline-none focus:ring-2 focus:ring-gold-soft disabled:cursor-not-allowed disabled:opacity-60"
            />
          </label>

          <label htmlFor={eyebrowId} className="block">
            <span className="block font-[family-name:var(--font-ui)] text-[10px] font-semibold uppercase tracking-[2.4px] text-gold-text">
              Eyebrow (small caps over the heading)
            </span>
            <input
              id={eyebrowId}
              type="text"
              value={eyebrow}
              onChange={(e) => setEyebrow(e.target.value)}
              disabled={locked}
              placeholder="PASTORAL DIARY · MMXXVI · MAY"
              className="mt-2 block w-full border border-[color:var(--rule)] bg-bone px-3 py-2 font-[family-name:var(--font-ui)] text-[12px] uppercase tracking-[2px] text-ink focus:outline-none focus:ring-2 focus:ring-gold-soft disabled:cursor-not-allowed disabled:opacity-60"
            />
          </label>

          <label htmlFor={leadId} className="block">
            <span className="block font-[family-name:var(--font-ui)] text-[10px] font-semibold uppercase tracking-[2.4px] text-gold-text">
              Italic lead
            </span>
            <textarea
              id={leadId}
              value={lead}
              onChange={(e) => setLead(e.target.value)}
              disabled={locked}
              rows={2}
              placeholder="One short sentence describing the month."
              className="mt-2 block w-full border border-[color:var(--rule)] bg-bone px-3 py-2 font-[family-name:var(--font-body)] italic text-[16px] leading-[1.5] text-ink focus:outline-none focus:ring-2 focus:ring-gold-soft disabled:cursor-not-allowed disabled:opacity-60"
            />
          </label>
        </section>

        {/* Posts */}
        <section className="space-y-5">
          <header className="flex items-baseline justify-between gap-4 border-b border-[color:var(--rule)] pb-2">
            <h2 className="font-[family-name:var(--font-ui)] text-[10px] font-semibold uppercase tracking-[2.4px] text-gold-text">
              Posts · {posts.length}
            </h2>
            <p className="font-[family-name:var(--font-body)] text-[12px] italic text-ink-soft">
              First post becomes the lead with full-bleed photo.
            </p>
          </header>

          {posts.length === 0 ? (
            <p className="border border-dashed border-[color:var(--rule)] bg-bone-deep p-6 text-center font-[family-name:var(--font-body)] italic text-ink-soft">
              No posts yet. Add one below — or leave empty and mark this
              edition &ldquo;Skipped&rdquo;.
            </p>
          ) : null}

          <ul className="space-y-4">
            {posts.map((post, idx) => (
              <li
                key={post._key}
                className="border border-[color:var(--rule)] bg-bone p-4"
              >
                <div className="flex items-center justify-between gap-3 border-b border-[color:var(--rule)] pb-2">
                  <p className="font-[family-name:var(--font-ui)] text-[10px] font-semibold uppercase tracking-[2px] text-gold-text">
                    {idx === 0 ? "Lead post" : `Post ${idx + 1}`}
                    {post.fbPostId ? (
                      <span className="ml-2 text-ink-soft">
                        · fb {post.fbPostId.slice(-8)}
                      </span>
                    ) : null}
                  </p>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => movePost(post._key, -1)}
                      disabled={locked || idx === 0}
                      className="border border-[color:var(--rule)] px-2 py-1 font-[family-name:var(--font-ui)] text-[10px] font-semibold uppercase tracking-[1.5px] text-ink hover:bg-bone-deep disabled:cursor-not-allowed disabled:opacity-40"
                      aria-label="Move post up"
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      onClick={() => movePost(post._key, 1)}
                      disabled={locked || idx === posts.length - 1}
                      className="border border-[color:var(--rule)] px-2 py-1 font-[family-name:var(--font-ui)] text-[10px] font-semibold uppercase tracking-[1.5px] text-ink hover:bg-bone-deep disabled:cursor-not-allowed disabled:opacity-40"
                      aria-label="Move post down"
                    >
                      ↓
                    </button>
                    <button
                      type="button"
                      onClick={() => deletePost(post._key)}
                      disabled={locked}
                      className="border border-[#e8b8b0] px-2 py-1 font-[family-name:var(--font-ui)] text-[10px] font-semibold uppercase tracking-[1.5px] text-[#7a2f22] hover:bg-[#fbf3f1] disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                <div className="mt-3 space-y-3">
                  <label className="block">
                    <span className="block font-[family-name:var(--font-ui)] text-[10px] font-semibold uppercase tracking-[2px] text-ink-soft">
                      Date & time (local)
                    </span>
                    <input
                      type="datetime-local"
                      value={isoToLocalInput(post.createdTime)}
                      onChange={(e) =>
                        patchPost(post._key, {
                          createdTime: localInputToIso(e.target.value),
                        })
                      }
                      disabled={locked}
                      className="mt-1 block w-full max-w-[260px] border border-[color:var(--rule)] bg-bone px-2 py-1.5 font-[family-name:var(--font-ui)] text-[13px] text-ink focus:outline-none focus:ring-2 focus:ring-gold-soft disabled:cursor-not-allowed disabled:opacity-60"
                    />
                  </label>

                  <label className="block">
                    <span className="block font-[family-name:var(--font-ui)] text-[10px] font-semibold uppercase tracking-[2px] text-ink-soft">
                      Message
                    </span>
                    <textarea
                      value={post.message ?? ""}
                      onChange={(e) =>
                        patchPost(post._key, { message: e.target.value })
                      }
                      disabled={locked}
                      rows={6}
                      className="mt-1 block w-full border border-[color:var(--rule)] bg-bone px-3 py-2 font-[family-name:var(--font-body)] text-[15px] leading-[1.6] text-ink focus:outline-none focus:ring-2 focus:ring-gold-soft disabled:cursor-not-allowed disabled:opacity-60"
                    />
                  </label>

                  <label className="block">
                    <span className="block font-[family-name:var(--font-ui)] text-[10px] font-semibold uppercase tracking-[2px] text-ink-soft">
                      Image URL
                    </span>
                    <input
                      type="url"
                      value={post.imageUrl ?? ""}
                      onChange={(e) =>
                        patchPost(post._key, {
                          imageUrl: e.target.value || null,
                        })
                      }
                      disabled={locked}
                      placeholder="https://…"
                      className="mt-1 block w-full border border-[color:var(--rule)] bg-bone px-3 py-1.5 font-mono text-[12px] text-ink focus:outline-none focus:ring-2 focus:ring-gold-soft disabled:cursor-not-allowed disabled:opacity-60"
                    />
                  </label>

                  <label className="block">
                    <span className="block font-[family-name:var(--font-ui)] text-[10px] font-semibold uppercase tracking-[2px] text-ink-soft">
                      Facebook permalink
                    </span>
                    <input
                      type="url"
                      value={post.permalinkUrl ?? ""}
                      onChange={(e) =>
                        patchPost(post._key, {
                          permalinkUrl: e.target.value || null,
                        })
                      }
                      disabled={locked}
                      placeholder="https://www.facebook.com/…"
                      className="mt-1 block w-full border border-[color:var(--rule)] bg-bone px-3 py-1.5 font-mono text-[12px] text-ink focus:outline-none focus:ring-2 focus:ring-gold-soft disabled:cursor-not-allowed disabled:opacity-60"
                    />
                  </label>
                </div>
              </li>
            ))}
          </ul>

          <button
            type="button"
            onClick={addPost}
            disabled={locked}
            className="btn-outline btn-sweep disabled:cursor-not-allowed disabled:opacity-60"
          >
            + Add post
          </button>
        </section>

        {/* Save bar */}
        <div className="sticky bottom-4 z-10 flex items-center justify-between gap-4 border border-[color:var(--rule)] bg-bone-deep p-4 shadow-[0_8px_24px_rgba(10,27,51,0.08)]">
          <p className="font-[family-name:var(--font-body)] text-[13px] italic text-ink-soft">
            {locked
              ? "Locked — this edition is sending or sent."
              : "Saving rebuilds the preview on the right."}
          </p>
          <button
            type="submit"
            disabled={locked || isPending}
            style={{ ["--sweep-color" as string]: "#c9a664" } as React.CSSProperties}
            className="btn-ink btn-sweep disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isPending ? "Saving…" : "Save changes"}
          </button>
        </div>
        <StatusBanner state={editState} />
      </form>

      {/* RIGHT — sticky preview + status controls */}
      <aside className="space-y-6 lg:sticky lg:top-6 lg:self-start">
        <div className="border border-[color:var(--rule)] bg-bone-deep p-4">
          <div className="mb-3 flex items-baseline justify-between gap-4">
            <p className="font-[family-name:var(--font-ui)] text-[10px] font-semibold uppercase tracking-[2.4px] text-gold-text">
              Preview · what subscribers will see
            </p>
            <p className="font-[family-name:var(--font-ui)] text-[10px] font-semibold uppercase tracking-[2px] text-ink-soft">
              {STATUS_LABEL[status] ?? status}
            </p>
          </div>
          <div className="max-h-[78vh] overflow-y-auto">
            <NewsletterIframe html={previewHtml} title={subjectLine} />
          </div>
        </div>

        {!locked ? (
          <form
            action={statusAction}
            className="border border-[color:var(--rule)] bg-bone p-4"
          >
            <input type="hidden" name="editionId" value={editionId} />
            <p className="font-[family-name:var(--font-ui)] text-[10px] font-semibold uppercase tracking-[2.4px] text-gold-text">
              Approval
            </p>
            <p className="mt-2 text-[13px] leading-[1.55] text-ink-soft">
              Marking ready to send unlocks the &ldquo;Broadcast now&rdquo;
              button below. Nothing is sent until you confirm.
            </p>
            <div className="mt-3 flex flex-wrap gap-3">
              {status === "draft" || status === "skipped_no_posts" || status === "failed" ? (
                <button
                  type="submit"
                  name="nextStatus"
                  value="ready_to_send"
                  className="btn-outline btn-sweep"
                >
                  Mark ready to send
                </button>
              ) : null}
              {status === "ready_to_send" ? (
                <button
                  type="submit"
                  name="nextStatus"
                  value="draft"
                  className="btn-outline btn-sweep"
                >
                  Move back to draft
                </button>
              ) : null}
              {status === "draft" || status === "ready_to_send" ? (
                <button
                  type="submit"
                  name="nextStatus"
                  value="skipped_no_posts"
                  className="btn-outline btn-sweep"
                >
                  Skip this month
                </button>
              ) : null}
            </div>
            <StatusBanner state={statusState} />
          </form>
        ) : null}
      </aside>
    </div>
  );
}
