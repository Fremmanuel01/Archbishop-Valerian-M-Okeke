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
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span lang="la" className={className}>
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
      className={`flex items-center gap-4 font-[family-name:var(--font-ui)] text-[10px] font-semibold uppercase tracking-[3px] text-gold ${className}`}
    >
      <span aria-hidden className="block h-px w-9 bg-gold" />
      {children}
    </p>
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
