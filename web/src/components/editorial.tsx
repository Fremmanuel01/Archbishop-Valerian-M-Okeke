const ROMAN_LITERALS: Array<[string, number]> = [
  ["M", 1000],
  ["CM", 900],
  ["D", 500],
  ["CD", 400],
  ["C", 100],
  ["XC", 90],
  ["L", 50],
  ["XL", 40],
  ["X", 10],
  ["IX", 9],
  ["V", 5],
  ["IV", 4],
  ["I", 1],
];

export function toRoman(num: number): string {
  let n = num;
  let result = "";
  for (const [roman, value] of ROMAN_LITERALS) {
    while (n >= value) {
      result += roman;
      n -= value;
    }
  }
  return result;
}

export function Roman({
  year,
  className,
  arabic = true,
}: {
  year: number;
  className?: string;
  arabic?: boolean;
}) {
  const roman = toRoman(year);
  if (!arabic) {
    return (
      <abbr title={String(year)} className={className}>
        {roman}
      </abbr>
    );
  }
  return (
    <span className={className}>
      <abbr title={String(year)}>{roman}</abbr>
      <span className="ml-1.5 text-[0.72em] font-normal tracking-normal opacity-70">
        ({year})
      </span>
    </span>
  );
}

export function Latin({
  children,
  className = "",
  smallCaps = false,
}: {
  children: React.ReactNode;
  className?: string;
  smallCaps?: boolean;
}) {
  return (
    <span
      lang="la"
      className={smallCaps ? `small-caps ${className}` : className}
    >
      {children}
    </span>
  );
}

export function SectionLabel({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p
      className={`flex items-center gap-4 font-[family-name:var(--font-ui)] text-[10px] font-semibold uppercase tracking-[3px] text-gold-text ${className}`}
    >
      <span aria-hidden className="block h-px w-9 bg-gold" />
      {children}
    </p>
  );
}

export function FleuronDivider({
  className = "",
}: {
  className?: string;
}) {
  return (
    <div
      aria-hidden
      className={`flex items-center justify-center gap-5 text-gold ${className}`}
    >
      <span className="block h-px flex-1 max-w-[140px] bg-[color:var(--rule)]" />
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.25}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-5 w-5 flex-shrink-0"
      >
        <path d="M4 12 L9 12" />
        <path d="M15 12 L20 12" />
        <path d="M12 7 Q 9.5 9.5 9.5 12 Q 9.5 14.5 12 17 Q 14.5 14.5 14.5 12 Q 14.5 9.5 12 7 Z" />
        <circle cx="12" cy="12" r="0.6" fill="currentColor" stroke="none" />
      </svg>
      <span className="block h-px flex-1 max-w-[140px] bg-[color:var(--rule)]" />
    </div>
  );
}

export function EmptyState({
  title,
  body,
}: {
  title: string;
  body: string;
}) {
  return (
    <div className="mx-auto max-w-[560px] border border-[color:var(--rule)] bg-bone-deep px-10 py-16 text-center">
      <p className="font-[family-name:var(--font-ui)] text-[10px] font-semibold uppercase tracking-[3px] text-gold-text">
        Nothing to show yet
      </p>
      <h2 className="mt-5 font-[family-name:var(--font-display)] text-[32px] font-medium italic leading-[1.2] text-ink">
        {title}
      </h2>
      <p className="mt-4 text-[16px] leading-[1.65] text-ink-soft">{body}</p>
    </div>
  );
}

export function LatinCross({
  className = "",
  title,
}: {
  className?: string;
  title?: string;
}) {
  return (
    <svg
      viewBox="0 0 100 140"
      xmlns="http://www.w3.org/2000/svg"
      role={title ? "img" : "presentation"}
      aria-hidden={title ? undefined : true}
      aria-label={title}
      className={className}
    >
      <path fill="currentColor" d="M42 0h16v40h40v16H58v84H42V56H2V40h40z" />
    </svg>
  );
}
