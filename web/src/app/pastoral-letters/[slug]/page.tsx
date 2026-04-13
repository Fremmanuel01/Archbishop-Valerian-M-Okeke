import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageSection, PageShell } from "@/components/shell/page-shell";
import { Roman } from "@/components/editorial";
import { Prose, renderProse, plainExcerpt } from "@/components/prose";
import { LetterToc } from "@/components/letter-toc";
import { ReadingProgress } from "@/components/reading-progress";
import {
  getPastoralLetter,
  getPastoralLetters,
  slugify,
  yearOf,
  formatLongDate,
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
    return {
      title: letter.title,
      description: letter.description ?? undefined,
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

  const year = yearOf(letter.date);
  const cover = letter.cover_photo_url ?? letter.thumbnail_url;
  const bodyMarkdown = letter.description ?? "";
  const { html: bodyHtml, headings } = bodyMarkdown
    ? renderProse(bodyMarkdown, "letter")
    : { html: "", headings: [] };
  // Rough reading-time estimate: ~220 words/min for serious prose.
  const wordCount = bodyMarkdown ? plainExcerpt(bodyMarkdown, 999999).split(/\s+/).length : 0;
  const readingTime = wordCount ? Math.max(1, Math.round(wordCount / 220)) : 0;

  return (
    <PageShell
      eyebrow={
        <>
          Pastoral Letter
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
          <aside className="max-lg:order-2">
            <div className="sticky top-32 space-y-5 font-[family-name:var(--font-ui)] text-[11px] text-ink-soft">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[2.4px] text-gold-text">
                  Pastoral Letter
                </p>
                {year ? (
                  <p className="mt-1 font-[family-name:var(--font-display)] text-[22px] text-ink">
                    <Roman year={year} />
                  </p>
                ) : null}
              </div>
              {letter.date ? (
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[2px] text-gold-text">
                    Given
                  </p>
                  <p className="mt-1 text-[13px] text-ink">
                    <time dateTime={letter.date}>{formatLongDate(letter.date)}</time>
                  </p>
                </div>
              ) : null}
              {readingTime > 0 ? (
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[2px] text-gold-text">
                    Reading
                  </p>
                  <p className="mt-1 text-[13px] text-ink">{readingTime} min</p>
                </div>
              ) : null}
              {letter.pdf_url ? (
                <div className="pt-2">
                  <a
                    href={letter.pdf_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-underline text-[11px] font-semibold uppercase tracking-[2px] text-ink"
                  >
                    Download PDF ↓
                  </a>
                </div>
              ) : null}
              <div className="pt-2">
                <Link
                  href="/pastoral-letters"
                  className="link-underline text-[11px] font-semibold uppercase tracking-[2px] text-ink"
                >
                  ← All Pastoral Letters
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
                  width={800}
                  height={1100}
                  sizes="(max-width: 1024px) 90vw, 420px"
                  className="h-auto w-full max-w-[420px] object-contain [filter:drop-shadow(0_30px_80px_rgba(10,27,51,0.25))]"
                />
              </div>
            ) : null}
            {letter.key_quote ? (
              <blockquote className="mx-auto mb-12 max-w-[62ch] border-l-2 border-gold pl-7 font-[family-name:var(--font-display)] text-[24px] italic leading-[1.45] text-ink">
                &ldquo;{letter.key_quote}&rdquo;
              </blockquote>
            ) : null}
            {bodyHtml ? (
              <div
                className="prose-editorial-letter mx-auto space-y-5 text-ink"
                dangerouslySetInnerHTML={{ __html: bodyHtml }}
              />
            ) : (
              <p className="italic text-ink-soft">
                The full text of this letter will be available here shortly.
              </p>
            )}
            <hr className="mx-auto my-14 h-px w-16 border-0 bg-gold" />
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
