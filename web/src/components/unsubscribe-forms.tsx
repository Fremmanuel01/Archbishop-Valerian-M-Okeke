"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import {
  confirmTokenUnsubscribe,
  initialUnsubscribeState,
  submitUnsubscribe,
  type UnsubscribeState,
} from "@/app/(frontend)/connect/newsletter/unsubscribe/actions";

function StatusButton({ children }: { children: React.ReactNode }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      style={{ ["--sweep-color" as string]: "#c9a664" }}
      className="btn-ink btn-sweep disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "Working…" : children}
    </button>
  );
}

function StatusMessage({ state }: { state: UnsubscribeState }) {
  if (state.status === "idle") return null;
  if (state.status === "success") {
    return (
      <p
        role="status"
        aria-live="polite"
        className="mt-2 border-l-2 border-gold pl-4 text-[14px] leading-[1.6] text-ink"
      >
        <span className="font-medium">{state.email}</span> has been removed
        from the list. We will not send you any further messages.
      </p>
    );
  }
  return (
    <p
      role="status"
      aria-live="polite"
      className="mt-2 border-l-2 border-[#a84233] pl-4 text-[14px] leading-[1.6] text-[#7a2f22]"
    >
      {state.message}
    </p>
  );
}

export function ConfirmTokenUnsubscribeForm({
  token,
  email,
}: {
  token: string;
  email: string;
}) {
  const [state, formAction] = useActionState(
    confirmTokenUnsubscribe,
    initialUnsubscribeState,
  );
  if (state.status === "success") {
    return (
      <p
        role="status"
        aria-live="polite"
        className="border-l-2 border-gold pl-4 font-[family-name:var(--font-body)] text-[16px] leading-[1.7] text-ink"
      >
        <span className="font-medium">{state.email}</span> has been removed
        from the Pastoral Diary list. We will not send you any further
        messages. If this was a mistake, you may rejoin at any time from the
        newsletter page.
      </p>
    );
  }
  return (
    <form action={formAction} className="flex flex-col gap-5">
      <input type="hidden" name="token" value={token} />
      <p className="font-[family-name:var(--font-body)] text-[17px] leading-[1.7] text-ink">
        Confirm that you would like to remove{" "}
        <span className="font-medium">{email}</span> from the Pastoral Diary
        list.
      </p>
      <div className="flex flex-wrap gap-4">
        <StatusButton>Yes, unsubscribe me</StatusButton>
      </div>
      {state.status === "error" ? (
        <p
          role="status"
          aria-live="polite"
          className="border-l-2 border-[#a84233] pl-4 text-[14px] leading-[1.6] text-[#7a2f22]"
        >
          {state.message}
        </p>
      ) : null}
    </form>
  );
}

export function UnsubscribeForm({ defaultEmail }: { defaultEmail?: string }) {
  const [state, formAction] = useActionState(
    submitUnsubscribe,
    initialUnsubscribeState,
  );
  return (
    <form action={formAction} className="mt-6 flex flex-col gap-5">
      <div className="flex flex-col">
        <label
          htmlFor="email"
          className="mb-2 font-[family-name:var(--font-ui)] text-[10px] font-semibold uppercase tracking-[2px] text-gold"
        >
          Your email
          <span aria-hidden className="ml-1 text-gold">
            *
          </span>
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          defaultValue={defaultEmail ?? ""}
          className="min-h-12 border border-stone bg-bone px-4 py-3 font-[family-name:var(--font-body)] text-[18px] text-ink placeholder:text-ink-soft/50 focus:border-gold focus:outline-none"
        />
      </div>
      <div className="flex justify-start">
        <StatusButton>Unsubscribe →</StatusButton>
      </div>
      <StatusMessage state={state} />
    </form>
  );
}
