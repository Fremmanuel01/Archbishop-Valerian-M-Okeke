"use client";

import { useEffect, useState } from "react";

type Heading = { id: string; text: string; level: number };

export function LetterToc({ headings }: { headings: Heading[] }) {
  const [activeId, setActiveId] = useState<string | null>(
    headings[0]?.id ?? null,
  );

  useEffect(() => {
    if (headings.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActiveId(visible[0].target.id);
      },
      { rootMargin: "-20% 0% -70% 0%", threshold: 0 },
    );
    headings.forEach((h) => {
      const el = document.getElementById(h.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <nav aria-label="Table of contents" className="font-[family-name:var(--font-ui)] text-[12px] leading-[1.5] text-ink-soft">
      <p className="mb-4 text-[10px] font-semibold uppercase tracking-[2.4px] text-gold-text">
        Contents
      </p>
      <ul className="space-y-1.5 border-l border-[color:var(--rule)]">
        {headings.map((h) => {
          const active = activeId === h.id;
          return (
            <li key={h.id} className={h.level === 3 ? "pl-5" : "pl-4"}>
              <a
                href={`#${h.id}`}
                className={`block -ml-px border-l-2 py-0.5 pl-4 transition-colors ${
                  active
                    ? "border-gold text-ink"
                    : "border-transparent text-ink-soft hover:text-ink"
                }`}
              >
                {h.text}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
