import Link from "next/link";
import { Crest } from "@/components/crest";
import { NavOverlay } from "@/components/shell/nav-overlay";

export function SiteHeader() {
  return (
    <header className="absolute inset-x-0 top-0 z-50 flex items-center justify-between bg-[linear-gradient(180deg,rgba(10,27,51,0.45)_0%,rgba(10,27,51,0.25)_60%,transparent_100%)] px-10 pt-[22px] text-white max-lg:px-7 max-md:px-5 max-md:pt-4">
      <Link
        href="/"
        aria-label="Home — The Archbishop of Onitsha"
        className="flex items-center gap-3.5 pb-5 pt-2.5 max-md:gap-2.5 max-md:pb-4 max-md:pt-1.5"
      >
        <Crest size={56} priority className="h-14 w-14 max-md:h-11 max-md:w-11" />
        <span className="font-[family-name:var(--font-ui)] text-[11px] font-semibold uppercase leading-[1.3] tracking-[1.4px] max-md:text-[10px] max-md:tracking-[1.1px]">
          <strong className="block font-semibold">The Archbishop</strong>
          of Onitsha
        </span>
      </Link>

      <div className="flex items-center gap-2.5 pb-3.5 max-md:gap-2 max-md:pb-2.5">
        <NavOverlay variant="dark" />
      </div>

      <div
        aria-hidden
        className="absolute inset-x-10 -bottom-px h-px bg-white/20 max-lg:inset-x-7 max-md:inset-x-5"
      />
    </header>
  );
}

