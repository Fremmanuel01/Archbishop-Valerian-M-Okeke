"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import {
  initialSendState,
  sendEdition,
  sendTestEdition,
  type SendState,
} from "@/app/(frontend)/admin-tools/send-newsletter/actions";

function StatusButton({
  children,
  variant = "outline",
  disabled,
}: {
  children: React.ReactNode;
  variant?: "ink" | "outline";
  disabled?: boolean;
}) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending || disabled}
      style={
        variant === "ink"
          ? ({ ["--sweep-color" as string]: "#c9a664" } as React.CSSProperties)
          : undefined
      }
      className={`${variant === "ink" ? "btn-ink btn-sweep" : "btn-outline btn-sweep"} disabled:cursor-not-allowed disabled:opacity-60`}
    >
      {pending ? "Working…" : children}
    </button>
  );
}

function StatusMessage({ state }: { state: SendState }) {
  if (state.status === "idle") return null;
  const isSuccess = state.status === "success";
  return (
    <p
      role="status"
      aria-live="polite"
      className={`mt-4 border-l-2 pl-4 text-[14px] leading-[1.6] ${
        isSuccess ? "border-gold text-ink" : "border-[#a84233] text-[#7a2f22]"
      }`}
    >
      {state.message}
    </p>
  );
}

export function SendEditionPanel({
  editionId,
  defaultTestRecipient,
  hasPosts,
  status,
}: {
  editionId: string;
  defaultTestRecipient: string;
  hasPosts: boolean;
  status: string;
}) {
  const [testState, testAction] = useActionState(sendTestEdition, initialSendState);
  const [sendState, sendStateAction] = useActionState(sendEdition, initialSendState);
  const [confirmText, setConfirmText] = useState("");

  const broadcastDisabled =
    !hasPosts || status === "sent" || status === "sending" || confirmText !== "SEND";

  return (
    <div className="mt-5 space-y-7">
      <form action={testAction} className="space-y-3">
        <input type="hidden" name="editionId" value={editionId} />
        <label className="block">
          <span className="block font-[family-name:var(--font-ui)] text-[10px] font-semibold uppercase tracking-[2.4px] text-gold-text">
            Test recipient
          </span>
          <input
            type="email"
            name="testRecipient"
            defaultValue={defaultTestRecipient}
            required
            className="mt-2 block w-full max-w-[420px] border border-[color:var(--rule)] bg-bone px-3 py-2 font-[family-name:var(--font-body)] text-[15px] text-ink focus:outline-none focus:ring-2 focus:ring-gold-soft"
          />
        </label>
        <StatusButton variant="outline">Send test to this address</StatusButton>
        <StatusMessage state={testState} />
      </form>

      <form
        action={sendStateAction}
        className="border-t border-[color:var(--rule)] pt-5"
      >
        <input type="hidden" name="editionId" value={editionId} />
        <p className="font-[family-name:var(--font-ui)] text-[10px] font-semibold uppercase tracking-[2.4px] text-gold-text">
          Broadcast to all subscribers
        </p>
        <p className="mt-2 max-w-[560px] text-[14px] leading-[1.6] text-ink-soft">
          This sends the edition to every active contact in the &quot;Archbishop&apos;s Office&quot; Resend audience. It cannot be undone — Resend processes the broadcast asynchronously and there is no &quot;cancel after send&quot; flow.
        </p>
        <label className="mt-4 block">
          <span className="block font-[family-name:var(--font-ui)] text-[10px] font-semibold uppercase tracking-[2px] text-gold-text">
            Type SEND to confirm
          </span>
          <input
            type="text"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder="SEND"
            className="mt-2 block w-full max-w-[200px] border border-[color:var(--rule)] bg-bone px-3 py-2 font-[family-name:var(--font-ui)] text-[14px] tracking-[2px] uppercase text-ink focus:outline-none focus:ring-2 focus:ring-gold-soft"
          />
        </label>
        <div className="mt-4">
          <StatusButton variant="ink" disabled={broadcastDisabled}>
            Broadcast now
          </StatusButton>
        </div>
        <StatusMessage state={sendState} />
        {!hasPosts ? (
          <p className="mt-3 text-[13px] italic text-ink-soft">
            This edition has no posts. Add posts in Payload before broadcasting, or set status to &quot;Skipped — no posts this month.&quot;
          </p>
        ) : null}
      </form>
    </div>
  );
}
