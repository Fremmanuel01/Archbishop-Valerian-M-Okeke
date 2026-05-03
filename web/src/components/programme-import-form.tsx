"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { importProgramme } from "@/app/(frontend)/admin-tools/programme-import/actions";
import { initialImportState } from "@/app/(frontend)/admin-tools/programme-import/types";

function StatusButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      style={{ ["--sweep-color" as string]: "#c9a664" }}
      className="btn-ink btn-sweep disabled:opacity-50"
    >
      {pending ? "Importing…" : "Import CSV"}
    </button>
  );
}

export function ProgrammeImportForm() {
  const [state, formAction] = useActionState(importProgramme, initialImportState);

  return (
    <form action={formAction} className="space-y-7">
      <div>
        <label
          htmlFor="file"
          className="mb-2 block font-[family-name:var(--font-ui)] text-[10px] font-semibold uppercase tracking-[2px] text-gold"
        >
          CSV file
        </label>
        <input
          id="file"
          name="file"
          type="file"
          accept=".csv,text/csv"
          required
          className="block w-full border border-stone bg-bone p-3 font-[family-name:var(--font-body)] text-[15px] text-ink file:mr-4 file:border-0 file:bg-ink file:px-4 file:py-2 file:text-bone file:font-[family-name:var(--font-ui)] file:text-[11px] file:font-semibold file:uppercase file:tracking-[1.5px] hover:file:bg-ink/90"
        />
        <p className="mt-2 text-[13px] text-ink-soft">
          Header row required. Recognised columns: <code>date</code>,{" "}
          <code>title</code>, <code>location</code>, <code>notes</code>. Date
          format <code>YYYY-MM-DD</code> preferred; <code>DD/MM/YYYY</code> is
          accepted as a fallback.
        </p>
      </div>

      <fieldset className="space-y-2">
        <legend className="mb-2 font-[family-name:var(--font-ui)] text-[10px] font-semibold uppercase tracking-[2px] text-gold">
          Mode
        </legend>
        <label className="flex cursor-pointer items-start gap-3 border border-stone bg-bone p-4 transition-colors has-[:checked]:border-gold has-[:checked]:bg-bone-deep">
          <input
            type="radio"
            name="mode"
            value="append"
            defaultChecked
            className="mt-1 accent-gold"
          />
          <span>
            <span className="block font-[family-name:var(--font-display)] text-[18px] font-medium text-ink">
              Append
            </span>
            <span className="block text-[13px] text-ink-soft">
              Add the new rows to the existing programme. Safe — keeps everything currently scheduled.
            </span>
          </span>
        </label>
        <label className="flex cursor-pointer items-start gap-3 border border-stone bg-bone p-4 transition-colors has-[:checked]:border-gold has-[:checked]:bg-bone-deep">
          <input
            type="radio"
            name="mode"
            value="replace"
            className="mt-1 accent-gold"
          />
          <span>
            <span className="block font-[family-name:var(--font-display)] text-[18px] font-medium text-ink">
              Replace
            </span>
            <span className="block text-[13px] text-ink-soft">
              Wipe the entire programme and use only the rows from this CSV.
              Use this when you have a full year planned and want a clean slate.
            </span>
          </span>
        </label>
      </fieldset>

      <StatusButton />

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
          {state.skipped.length > 0 ? (
            <details className="mt-3">
              <summary className="cursor-pointer font-[family-name:var(--font-ui)] text-[12px] font-semibold uppercase tracking-[1.5px]">
                {state.skipped.length} row{state.skipped.length === 1 ? "" : "s"} skipped
              </summary>
              <ul className="mt-3 space-y-1 text-[13px]">
                {state.skipped.map((s) => (
                  <li key={s.row}>
                    Row {s.row}: {s.reason}
                  </li>
                ))}
              </ul>
            </details>
          ) : null}
        </div>
      ) : null}
    </form>
  );
}
