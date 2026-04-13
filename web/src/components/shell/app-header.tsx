import Link from "next/link";
import { Crest } from "@/components/crest";
import { NavOverlay } from "./nav-overlay";
import { MegaNav } from "./mega-nav";
import {
  getPastoralLetters,
  getHomilies,
  slugify,
  yearOf,
} from "@/lib/cms";

export async function AppHeader() {
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
    <header className="relative border-b border-[color:var(--rule)] bg-bone">
      <div className="mx-auto flex max-w-[1440px] items-center gap-10 px-10 py-5 max-lg:px-7 max-md:px-5 max-md:py-4">
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

        <MegaNav letters={letters} homilies={homilies} variant="light" />

        <div className="flex items-center gap-2.5 max-md:gap-2">
          <NavOverlay variant="light" />
        </div>
      </div>
    </header>
  );
}
