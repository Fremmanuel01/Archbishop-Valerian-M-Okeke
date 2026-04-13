export function FormField({
  id,
  label,
  type = "text",
  required,
  placeholder,
  helper,
  autoComplete,
}: {
  id: string;
  label: string;
  type?: "text" | "email" | "tel";
  required?: boolean;
  placeholder?: string;
  helper?: string;
  autoComplete?: string;
}) {
  return (
    <div className="flex flex-col">
      <label
        htmlFor={id}
        className="mb-2 font-[family-name:var(--font-ui)] text-[10px] font-semibold uppercase tracking-[2px] text-gold"
      >
        {label}
        {required ? (
          <span aria-hidden className="ml-1 text-gold">
            *
          </span>
        ) : null}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        required={required}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className="min-h-12 border border-stone bg-bone px-4 py-3 font-[family-name:var(--font-body)] text-[18px] text-ink placeholder:text-ink-soft/50 focus:border-gold focus:outline-none"
      />
      {helper ? (
        <p className="mt-2 text-[13px] text-ink-soft">{helper}</p>
      ) : null}
    </div>
  );
}

export function TextArea({
  id,
  label,
  rows = 6,
  required,
  placeholder,
  helper,
}: {
  id: string;
  label: string;
  rows?: number;
  required?: boolean;
  placeholder?: string;
  helper?: string;
}) {
  return (
    <div className="flex flex-col">
      <label
        htmlFor={id}
        className="mb-2 font-[family-name:var(--font-ui)] text-[10px] font-semibold uppercase tracking-[2px] text-gold"
      >
        {label}
        {required ? (
          <span aria-hidden className="ml-1 text-gold">
            *
          </span>
        ) : null}
      </label>
      <textarea
        id={id}
        name={id}
        rows={rows}
        required={required}
        placeholder={placeholder}
        className="border border-stone bg-bone px-4 py-3 font-[family-name:var(--font-body)] text-[18px] leading-[1.6] text-ink placeholder:text-ink-soft/50 focus:border-gold focus:outline-none"
      />
      {helper ? (
        <p className="mt-2 text-[13px] text-ink-soft">{helper}</p>
      ) : null}
    </div>
  );
}

export function SubmitButton({ children }: { children: React.ReactNode }) {
  return (
    <button
      type="submit"
      style={{ ["--sweep-color" as string]: "#c9a664" }}
      className="btn-ink btn-sweep"
    >
      {children}
    </button>
  );
}
