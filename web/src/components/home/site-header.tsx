import Link from "next/link";
import { Crest } from "@/components/crest";
import { NavOverlay } from "@/components/shell/nav-overlay";
import { MegaNav } from "@/components/shell/mega-nav";
import {
  getPastoralLetters,
  getHomilies,
  slugify,
  yearOf,
} from "@/lib/cms";

export async function SiteHeader() {
  const [rawLetters, rawHomilies] = await Promise.all([
    getPastoralLetters(),
    getHomilies(),
  ]);

  const letters = [...rawLetters]
    .sort((a, b) => (yearOf(b.date) ?? 0) - (yearOf(a.date) ?? 0))
    .map((l) => ({
      id: l.id,
      title: l.title,
      year: yearOf(l.date),
      slug: `${l.id}-${slugify(l.title)}`,
      cover: l.cover_photo_url ?? l.thumbnail_url,
    }));

  const homilies = [...rawHomilies]
    .sort((a, b) => {
      if (!a.date) return 1;
      if (!b.date) return -1;
      return a.date < b.date ? 1 : -1;
    })
    .map((h) => ({
      id: h.id,
      title: h.title,
      year: yearOf(h.date),
      occasion: h.occasion ?? null,
    }));

  return (
    <header className="absolute inset-x-0 top-0 z-50 flex items-center gap-10 bg-[linear-gradient(180deg,rgba(247,244,238,0.92)_0%,rgba(247,244,238,0.6)_60%,transparent_100%)] px-10 pt-[22px] text-ink max-lg:px-7 max-md:px-5 max-md:pt-4">
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

      <MegaNav letters={letters} homilies={homilies} variant="light" />

      <div className="flex items-center gap-2.5 pb-3.5 max-md:gap-2 max-md:pb-2.5">
        <NavOverlay variant="dark" />
      </div>

      <div
        aria-hidden
        className="absolute inset-x-10 -bottom-px h-px bg-ink/15 max-lg:inset-x-7 max-md:inset-x-5"
      />
    </header>
  );
}
