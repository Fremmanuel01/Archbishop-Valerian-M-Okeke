import Link from "next/link";
import { Crest } from "@/components/crest";
import { LangToggle } from "@/components/lang-toggle";
import { NavOverlay } from "@/components/shell/nav-overlay";
import { MegaNav } from "@/components/shell/mega-nav";
import {
  getPastoralLetters,
  getHomilies,
  slugify,
  yearOf,
} from "@/lib/cms";
import { getLang } from "@/lib/lang";
import { getDict } from "@/lib/i18n";

export async function SiteHeader() {
  const [rawLetters, rawHomilies, lang] = await Promise.all([
    getPastoralLetters(),
    getHomilies(),
    getLang(),
  ]);
  const t = getDict(lang);

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
      slug: `${h.id}-${slugify(h.title)}`,
    }));

  return (
    <header className="absolute inset-x-0 top-0 z-50 flex items-center gap-5 bg-[linear-gradient(180deg,rgba(247,244,238,0.92)_0%,rgba(247,244,238,0.6)_60%,transparent_100%)] px-6 pt-[22px] text-ink lg:gap-7 lg:px-8 xl:gap-10 xl:px-10 max-md:px-5 max-md:pt-4">
      <Link
        href="/"
        aria-label={`Home · ${t.brandTagline}`}
        className="flex items-center gap-3.5 pb-5 pt-2.5 max-md:gap-2.5 max-md:pb-4 max-md:pt-1.5"
      >
        <Crest size={56} priority className="h-14 w-14 max-md:h-11 max-md:w-11" />
        <span className="font-[family-name:var(--font-ui)] text-[11px] font-semibold uppercase leading-[1.3] tracking-[1.4px] max-md:text-[10px] max-md:tracking-[1.1px]">
          <strong className="block font-semibold">
            {lang === "ig" ? "Onyenwe" : "The Archbishop"}
          </strong>
          {lang === "ig" ? "Onye Isi Bishọp nke Onitsha" : "of Onitsha"}
        </span>
      </Link>

      <MegaNav letters={letters} homilies={homilies} variant="light" lang={lang} />

      <div className="ml-auto flex items-center gap-3 pb-3.5 max-md:gap-2 max-md:pb-2.5">
        <LangToggle current={lang} ariaLabel={t.langToggleLabel} variant="light" />
        <NavOverlay variant="dark" />
      </div>

      <div
        aria-hidden
        className="absolute inset-x-6 -bottom-px h-px bg-ink/15 lg:inset-x-8 xl:inset-x-10 max-md:inset-x-5"
      />
    </header>
  );
}
