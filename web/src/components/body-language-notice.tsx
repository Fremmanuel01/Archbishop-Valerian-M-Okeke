import type { Lang } from "@/lib/i18n";
import { getDict } from "@/lib/i18n";

/** Renders a small editorial banner above body content when the visitor's
 *  locale is Igbo, since long-form CMS content (pastoral letters, homilies,
 *  writings) is currently English-only. Returns null for English visitors. */
export function BodyLanguageNotice({ lang }: { lang: Lang }) {
  if (lang !== "ig") return null;
  const t = getDict(lang);
  return (
    <aside
      role="note"
      lang="ig"
      className="mb-10 border-l-2 border-gold bg-bone-deep px-5 py-4 font-[family-name:var(--font-display)] text-[15px] italic leading-[1.55] text-ink-soft"
    >
      {t.bodyEnglishNotice}
    </aside>
  );
}
