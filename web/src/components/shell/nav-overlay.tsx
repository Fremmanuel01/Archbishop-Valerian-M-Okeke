"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Crest } from "@/components/crest";

const SECTIONS = [
  {
    eyebrow: "About His Grace",
    items: [
      { label: "Biography", href: "/biography" },
      { label: "His Episcopacy", href: "/his-episcopacy" },
      { label: "Coat of Arms", href: "/coat-of-arms" },
      { label: "Pastoral Diary", href: "/diary" },
      { label: "Pastoral Visits", href: "/pastoral-visits" },
    ],
  },
  {
    eyebrow: "The Library",
    items: [
      { label: "Pastoral Letters", href: "/pastoral-letters" },
      { label: "Reflections & Homilies", href: "/reflections" },
      { label: "Other Teachings", href: "/other-teachings" },
    ],
  },
  {
    eyebrow: "Connect",
    items: [
      { label: "Prayer Requests", href: "/connect/prayer-requests" },
      { label: "Contact", href: "/connect/contact" },
      { label: "Newsletter", href: "/connect/newsletter" },
    ],
  },
];

export function NavOverlay({
  variant = "light",
}: {
  variant?: "light" | "dark";
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  const buttonClass =
    variant === "dark"
      ? "inline-flex min-h-[44px] items-center gap-2.5 bg-gold-soft px-5 py-3 font-[family-name:var(--font-ui)] text-[13px] font-semibold text-ink transition-colors hover:bg-white focus-visible:bg-white max-md:min-h-[40px] max-md:px-3.5 max-md:py-2.5 max-md:text-xs"
      : "inline-flex min-h-[44px] items-center gap-2.5 bg-gold-soft px-5 py-3 font-[family-name:var(--font-ui)] text-[13px] font-semibold text-ink transition-colors hover:bg-gold hover:text-white focus-visible:bg-gold focus-visible:text-white max-md:min-h-[40px] max-md:px-3.5 max-md:py-2.5 max-md:text-xs";

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        aria-expanded={open}
        aria-controls="nav-overlay"
        className={buttonClass}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.75}
          strokeLinecap="round"
          aria-hidden
          className="h-[18px] w-[18px]"
        >
          <path d="M3 7h18M3 12h18M3 17h18" />
        </svg>
        <span className={variant === "light" ? "max-md:sr-only" : undefined}>
          Menu
        </span>
      </button>

      {open ? (
        <div
          id="nav-overlay"
          role="dialog"
          aria-modal="true"
          aria-label="Site navigation"
          className="fixed inset-0 z-[100] flex flex-col bg-ink text-white"
        >
          <div className="flex items-center justify-between border-b border-white/10 px-10 pt-[22px] pb-5 max-lg:px-7 max-md:px-5 max-md:pt-4 max-md:pb-4">
            <Link
              href="/"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3.5 text-white"
            >
              <Crest size={56} className="h-14 w-14" />
              <span className="font-[family-name:var(--font-ui)] text-[11px] font-semibold uppercase leading-[1.3] tracking-[1.4px]">
                <strong className="block font-semibold">The Archbishop</strong>
                of Onitsha
              </span>
            </Link>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              className="inline-flex min-h-[44px] items-center gap-2.5 bg-gold-soft px-5 py-3 font-[family-name:var(--font-ui)] text-[13px] font-semibold text-ink transition-colors hover:bg-white focus-visible:bg-white"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.75}
                strokeLinecap="round"
                aria-hidden
                className="h-[18px] w-[18px]"
              >
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
              Close
            </button>
          </div>

          <nav
            aria-label="Primary"
            className="flex-1 overflow-y-auto px-10 py-20 max-lg:px-7 max-md:px-5 max-md:py-14"
          >
            <div className="mx-auto grid max-w-[1240px] grid-cols-3 gap-16 max-lg:grid-cols-1 max-lg:gap-12">
              {SECTIONS.map((section) => (
                <div key={section.eyebrow}>
                  <p className="flex items-center gap-4 font-[family-name:var(--font-ui)] text-[10px] font-semibold uppercase tracking-[3px] text-gold-soft">
                    <span aria-hidden className="block h-px w-9 bg-gold-soft" />
                    {section.eyebrow}
                  </p>
                  <ul className="mt-8 space-y-5">
                    {section.items.map((item) => (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          onClick={() => setOpen(false)}
                          className="block font-[family-name:var(--font-display)] text-[34px] font-medium leading-[1.1] text-white transition-colors hover:text-gold-soft focus-visible:text-gold-soft max-md:text-[28px]"
                        >
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </nav>

          <div className="border-t border-white/10 px-10 py-6 text-center font-[family-name:var(--font-ui)] text-[10px] uppercase tracking-[1.6px] text-white/60 max-md:px-5">
            <span lang="la">Domus Episcopalis</span> · Onitsha · Anambra ·
            Nigeria
          </div>
        </div>
      ) : null}
    </>
  );
}
