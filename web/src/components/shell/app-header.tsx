"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Crest } from "@/components/crest";
import { NavOverlay } from "./nav-overlay";

const NAV = [
  { label: "Biography", href: "/biography" },
  { label: "Pastoral Letters", href: "/pastoral-letters" },
  { label: "Reflections", href: "/reflections" },
  { label: "Diary", href: "/diary" },
  { label: "Connect", href: "/connect" },
];

export function AppHeader() {
  const pathname = usePathname();
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname?.startsWith(href);
  return (
    <header className="relative border-b border-[color:var(--rule)] bg-bone">
      <div className="mx-auto flex max-w-[1240px] items-center justify-between px-10 py-5 max-lg:px-7 max-md:px-5 max-md:py-4">
        <Link
          href="/"
          aria-label="Home — The Archbishop of Onitsha"
          className="flex items-center gap-3.5 text-ink"
        >
          <Crest size={56} className="h-14 w-14 max-md:h-11 max-md:w-11" />
          <span className="font-[family-name:var(--font-ui)] text-[11px] font-semibold uppercase leading-[1.3] tracking-[1.4px] max-md:text-[10px] max-md:tracking-[1.1px]">
            <strong className="block font-semibold">The Archbishop</strong>
            of Onitsha
          </span>
        </Link>

        <nav
          aria-label="Primary"
          className="flex items-center gap-9 font-[family-name:var(--font-ui)] text-[12px] font-medium uppercase tracking-[1.4px] text-ink max-lg:hidden"
        >
          {NAV.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={
                  active
                    ? "text-gold-text opacity-100 [text-decoration:underline_from-font] [text-underline-offset:6px] [text-decoration-color:var(--gold)]"
                    : "opacity-85 transition-opacity hover:opacity-100 hover:text-gold-text"
                }
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2.5 max-md:gap-2">
          <NavOverlay variant="light" />
        </div>
      </div>
    </header>
  );
}
