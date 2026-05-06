import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageSection, PageShell } from "@/components/shell/page-shell";
import { Roman } from "@/components/editorial";
import { renderProse, plainExcerpt } from "@/components/prose";
import { ArrowDown, ArrowLeft, ArrowRight } from "@/components/icons";
import { BodyLanguageNotice } from "@/components/body-language-notice";
import { getLang } from "@/lib/lang";
import { getDict } from "@/lib/i18n";
import { LetterToc } from "@/components/letter-toc";
import { ReadingProgress } from "@/components/reading-progress";
import {
  getPastoralLetter,
  getPastoralLetters,
  slugify,
  yearOf,
} from "@/lib/cms";

export const revalidate = 3600;

function parseSlug(slug: string): number | null {
  const id = Number(slug.split("-")[0]);
  return Number.isFinite(id) ? id : null;
}

export async function generateStaticParams() {
  const letters = await getPastoralLetters();
  return letters.map((l) => ({
    slug: `${l.id}-${slugify(l.title)}`,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const id = parseSlug(slug);
  if (!id) return { title: "Not found" };
  try {
    const letter = await getPastoralLetter(id);
    const cover = letter.cover_photo_url ?? letter.thumbnail_url ?? undefined;
    const summary = letter.description
      ? plainExcerpt(letter.description, 200)
      : undefined;
    return {
      title: letter.title,
      description: summary,
      openGraph: {
        title: letter.title,
        description: summary,
        type: "article",
        images: cover
          ? [{ url: cover, width: 1200, height: 1500, alt: `Cover of ${letter.title}` }]
          : undefined,
      },
      twitter: {
        card: cover ? "summary_large_image" : "summary",
        title: letter.title,
        description: summary,
        images: cover ? [cover] : undefined,
      },
    };
  } catch {
    return { title: "Not found" };
  }
}

export default async function LetterPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const id = parseSlug(slug);
  if (!id) notFound();

  let letter;
  try {
    letter = await getPastoralLetter(id);
  } catch {
    notFound();
  }

  const [lang, allLetters] = await Promise.all([getLang(), getPastoralLetters()]);
  const t = getDict(lang);
  const year = yearOf(letter.date);
  const cover = letter.cover_photo_url ?? letter.thumbnail_url;
  const bodyMarkdown = letter.description ?? "";
  const { html: bodyHtml, headings } = bodyMarkdown
    ? renderProse(bodyMarkdown, "letter")
    : { html: "", headings: [] };
  // Rough reading-time estimate: ~220 words/min for serious prose.
  const wordCount = bodyMarkdown ? plainExcerpt(bodyMarkdown, 999999).split(/\s+/).length : 0;
  const readingTime = wordCount ? Math.max(1, Math.round(wordCount / 220)) : 0;

  // Prev / next pastoral letter — sorted oldest → newest so "previous" reads
  // as chronologically earlier and "next" as later, matching how letters are
  // received in time. The site index displays them newest-first; this page
  // reverses for reading flow.
  const sortedAsc = [...allLetters].sort((a, b) => {
    const ya = yearOf(a.date) ?? 0;
    const yb = yearOf(b.date) ?? 0;
    if (ya !== yb) return ya - yb;
    return a.id - b.id;
  });
  const idx = sortedAsc.findIndex((l) => l.id === letter.id);
  const prev = idx > 0 ? sortedAsc[idx - 1] : null;
  const next = idx >= 0 && idx < sortedAsc.length - 1 ? sortedAsc[idx + 1] : null;
  const slugFor = (l: { id: number; title: string }) =>
    `/pastoral-letters/${l.id}-${slugify(l.title)}`;

  return (
    <PageShell
      eyebrow={
        <>
          {t.panel.libraryTitle}
          {year ? (
            <>
              {" · "}
              <Roman year={year} />
            </>
          ) : null}
        </>
      }
      title={letter.title}
    >
      <ReadingProgress targetId="letter-article" />
      <PageSection>
        <div className="grid grid-cols-[180px_minmax(0,1fr)_220px] gap-12 max-xl:grid-cols-[160px_minmax(0,1fr)] max-lg:grid-cols-1 max-lg:gap-10">
          {/* ─── Left rail: metadata ─────────── */}
          {/* On mobile we keep this as order-1 so the PDF download and
              "All Pastoral Letters" links sit above the long-form body
              instead of at the very end of a 30-min read. Sticky only
              on desktop where it has parallel scroll context. */}
          <aside>
            <div className="space-y-5 font-[family-name:var(--font-ui)] text-[11px] text-ink-soft lg:sticky lg:top-32 max-lg:flex max-lg:flex-wrap max-lg:items-baseline max-lg:gap-x-8 max-lg:gap-y-4 max-lg:space-y-0 max-lg:border-y max-lg:border-[color:var(--rule)] max-lg:py-5">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[2.4px] text-gold-text">
                  {t.panel.libraryTitle}
                </p>
                {year ? (
                  <p className="mt-1 font-[family-name:var(--font-display)] text-[22px] text-ink">
                    <Roman year={year} />
                  </p>
                ) : null}
              </div>
              {readingTime > 0 ? (
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[2px] text-gold-text">
                    {t.letter.readingLabel}
                  </p>
                  <p className="mt-1 text-[13px] text-ink">
                    {readingTime} {t.letter.minRead}
                  </p>
                </div>
              ) : null}
              {letter.pdf_url ? (
                <div className="pt-2">
                  <a
                    href={letter.pdf_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-underline inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[2px] text-ink"
                  >
                    {t.cta.downloadPdf}
                    <ArrowDown size={12} aria-hidden />
                    <span className="sr-only">{t.letter.pdfNewTabHint}</span>
                  </a>
                </div>
              ) : null}
              <div className="pt-2">
                <Link
                  href="/pastoral-letters"
                  className="link-underline inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[2px] text-ink"
                >
                  <ArrowLeft size={12} aria-hidden />
                  {t.letter.allLetters}
                </Link>
              </div>
            </div>
          </aside>

          {/* ─── Centre: article ─────────────── */}
          <article id="letter-article" className="min-w-0">
            {cover ? (
              <div className="mb-14 flex justify-center">
                <Image
                  src={cover}
                  alt={`Cover of ${letter.title}`}
                  width={1200}
                  height={1500}
                  sizes="(max-width: 1024px) 90vw, 420px"
                  className="h-auto w-full max-w-[420px] object-contain [filter:drop-shadow(0_30px_80px_rgba(10,27,51,0.25))]"
                />
              </div>
            ) : null}
            {letter.key_quote ? (
              <blockquote className="mx-auto mb-12 max-w-[62ch] border-l-2 border-gold pl-7 font-[family-name:var(--font-display)] text-[26px] italic leading-[1.4] text-ink max-md:text-[22px]">
                &ldquo;{letter.key_quote}&rdquo;
              </blockquote>
            ) : null}
            <BodyLanguageNotice lang={lang} />
            {headings.length > 0 ? (
              <details className="mb-10 border border-[color:var(--rule)] bg-bone-deep px-5 py-3 xl:hidden">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-3 font-[family-name:var(--font-ui)] text-[10px] font-semibold uppercase tracking-[2.4px] text-gold-text marker:hidden">
                  <span>{t.letter.contents}</span>
                  <ArrowDown size={12} className="summary-chevron text-gold" aria-hidden />
                </summary>
                <div className="mt-4">
                  <LetterToc headings={headings} hideLabel />
                </div>
              </details>
            ) : null}
            {bodyHtml ? (
              <div
                className="prose-editorial-letter mx-auto text-ink"
                dangerouslySetInnerHTML={{ __html: bodyHtml }}
              />
            ) : (
              <div className="mx-auto max-w-[62ch] border border-[color:var(--rule)] bg-bone-deep px-8 py-10 max-md:px-6 max-md:py-8">
                <p className="font-[family-name:var(--font-ui)] text-[10px] font-semibold uppercase tracking-[3px] text-gold-text">
                  {t.letter.fullTextUnavailableTitle}
                </p>
                <p className="mt-4 text-[17px] leading-[1.6] text-ink-soft">
                  {t.letter.fullTextUnavailableBody}
                </p>
                <div className="mt-7 flex flex-wrap items-center gap-x-8 gap-y-3 font-[family-name:var(--font-ui)] text-[11px] font-semibold uppercase tracking-[2px]">
                  {letter.pdf_url ? (
                    <a
                      href={letter.pdf_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link-underline inline-flex items-center gap-2 text-ink"
                    >
                      {t.cta.downloadPdf}
                      <ArrowDown size={12} aria-hidden />
                      <span className="sr-only">{t.letter.pdfNewTabHint}</span>
                    </a>
                  ) : null}
                  <Link
                    href="/pastoral-letters"
                    className="link-underline inline-flex items-center gap-2 text-ink"
                  >
                    <ArrowLeft size={12} aria-hidden />
                    {t.letter.allLetters}
                  </Link>
                </div>
              </div>
            )}
            {(prev || next) ? (
              <nav
                aria-label={t.letter.continueReading}
                className="mx-auto mt-20 max-w-[64ch] border-t border-[color:var(--rule)] pt-10"
              >
                <p className="text-center font-[family-name:var(--font-ui)] text-[10px] font-semibold uppercase tracking-[3px] text-gold-text">
                  {t.letter.continueReading}
                </p>
                <div className="mt-6 grid grid-cols-2 gap-8 max-sm:grid-cols-1 max-sm:gap-6">
                  {prev ? (
                    <Link
                      href={slugFor(prev)}
                      className="group block"
                    >
                      <p className="flex items-center gap-2 font-[family-name:var(--font-ui)] text-[10px] font-semibold uppercase tracking-[2.4px] text-gold-text">
                        <ArrowLeft size={12} aria-hidden />
                        {t.letter.previousLetter}
                        {yearOf(prev.date) ? (
                          <>
                            {" · "}
                            <Roman year={yearOf(prev.date) as number} arabic={false} />
                          </>
                        ) : null}
                      </p>
                      <h3 className="mt-2 font-[family-name:var(--font-display)] text-[20px] font-medium leading-[1.25] text-ink transition-colors group-hover:text-gold-text">
                        {prev.title}
                      </h3>
                    </Link>
                  ) : (
                    <span aria-hidden />
                  )}
                  {next ? (
                    <Link
                      href={slugFor(next)}
                      className="group block text-right max-sm:text-left"
                    >
                      <p className="flex items-center justify-end gap-2 font-[family-name:var(--font-ui)] text-[10px] font-semibold uppercase tracking-[2.4px] text-gold-text max-sm:justify-start">
                        {yearOf(next.date) ? (
                          <>
                            <Roman year={yearOf(next.date) as number} arabic={false} />
                            {" · "}
                          </>
                        ) : null}
                        {t.letter.nextLetter}
                        <ArrowRight size={12} aria-hidden />
                      </p>
                      <h3 className="mt-2 font-[family-name:var(--font-display)] text-[20px] font-medium leading-[1.25] text-ink transition-colors group-hover:text-gold-text">
                        {next.title}
                      </h3>
                    </Link>
                  ) : (
                    <span aria-hidden />
                  )}
                </div>
                <div className="mt-10 flex justify-center">
                  <Link
                    href="/pastoral-letters"
                    className="link-underline inline-flex items-center gap-2 font-[family-name:var(--font-ui)] text-[11px] font-semibold uppercase tracking-[2px] text-ink"
                  >
                    <ArrowLeft size={12} aria-hidden />
                    {t.letter.allLetters}
                  </Link>
                </div>
              </nav>
            ) : (
              <hr className="mx-auto my-14 h-px w-20 border-0 bg-gold" />
            )}
          </article>

          {/* ─── Right rail: TOC ─────────────── */}
          <aside className="max-xl:hidden">
            <div className="sticky top-32 max-h-[calc(100vh-160px)] overflow-y-auto pr-2">
              <LetterToc headings={headings} />
            </div>
          </aside>
        </div>
      </PageSection>
    </PageShell>
  );
}
