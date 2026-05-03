"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { generateSlotsForYear } from "@/app/(frontend)/admin-tools/generate-slots/actions";
import { initialGenerateState } from "@/app/(frontend)/admin-tools/generate-slots/types";

function StatusButton({ year }: { year: number }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      style={{ ["--sweep-color" as string]: "#c9a664" }}
      className="btn-ink btn-sweep disabled:opacity-50"
    >
      {pending ? "Generating…" : `Generate slots for ${year}`}
    </button>
  );
}

export function GenerateSlotsForm({ defaultYear }: { defaultYear: number }) {
  const [state, formAction] = useActionState(
    generateSlotsForYear,
    initialGenerateState,
  );

  return (
    <form action={formAction} className="space-y-7">
      <div>
        <label
          htmlFor="year"
          className="mb-2 block font-[family-name:var(--font-ui)] text-[10px] font-semibold uppercase tracking-[2px] text-gold"
        >
          Year
        </label>
        <input
          id="year"
          name="year"
          type="number"
          min={2024}
          max={2100}
          step={1}
          defaultValue={defaultYear}
          required
          className="w-40 border border-stone bg-bone px-4 py-3 font-[family-name:var(--font-body)] text-[18px] text-ink focus:border-gold focus:outline-none"
        />
        <p className="mt-2 text-[13px] text-ink-soft">
          The generator only creates slots for dates that are today or later — past dates are skipped automatically.
        </p>
      </div>

      <StatusButton year={defaultYear} />

      {state.message ? (
        <div
          role="status"
          className={`border-l-4 p-4 ${
            state.ok
              ? "border-gold bg-bone-deep text-ink"
              : "border-red-400 bg-red-50 text-red-900"
          }`}
        >
          <p className="font-[family-name:var(--font-display)] text-[18px] font-medium">
            {state.message}
          </p>
        </div>
      ) : null}
    </form>
  );
}
