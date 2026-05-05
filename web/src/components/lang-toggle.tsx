"use client";

import { usePathname } from "next/navigation";
import { useTransition } from "react";
import { setLang } from "@/app/(frontend)/actions/lang";
import type { Lang } from "@/lib/i18n";

export function LangToggle({
  current,
  ariaLabel,
  variant = "light",
}: {
  current: Lang;
  /** Localised "Language" label for screen readers. */
  ariaLabel: string;
  variant?: "light" | "dark";
}) {
  const pathname = usePathname();
  const [pending, startTransition] = useTransition();

  function pick(next: Lang) {
    if (next === current) return;
    startTransition(() => {
      void setLang(next, pathname || "/");
    });
  }

  const baseColor =
    variant === "dark" ? "text-bone/80 hover:text-bone" : "text-ink/70 hover:text-ink";
  const activeColor = variant === "dark" ? "text-gold-soft" : "text-gold-text";
  const ruleColor = variant === "dark" ? "bg-bone/30" : "bg-ink/20";

  return (
    <div
      role="group"
      aria-label={ariaLabel}
      className={`flex items-center gap-1.5 font-[family-name:var(--font-ui)] text-[10px] font-semibold uppercase tracking-[1.6px] ${
        pending ? "opacity-60" : ""
      }`}
    >
      <button
        type="button"
        onClick={() => pick("en")}
        aria-pressed={current === "en"}
        className={`px-1.5 py-1 transition-colors ${
          current === "en" ? activeColor : baseColor
        }`}
      >
        EN
      </button>
      <span aria-hidden className={`block h-3 w-px ${ruleColor}`} />
      <button
        type="button"
        onClick={() => pick("ig")}
        aria-pressed={current === "ig"}
        className={`px-1.5 py-1 transition-colors ${
          current === "ig" ? activeColor : baseColor
        }`}
      >
        IG
      </button>
    </div>
  );
}
