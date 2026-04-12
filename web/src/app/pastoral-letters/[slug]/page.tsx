import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageSection, PageShell } from "@/components/shell/page-shell";
import { Roman } from "@/components/editorial";
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
      lead={letter.description ?? undefined}
    >
      <PageSection>
        <div className="grid grid-cols-[1fr_1.4fr] gap-20 max-lg:grid-cols-1 max-lg:gap-14">
          <div className="flex justify-center">
            {cover ? (
              <Image
                src={cover}
                alt={`Cover of ${letter.title}`}
                width={1200}
                height={1500}
                sizes="(max-width: 1024px) 100vw, 480px"
                className="h-auto w-full max-w-[480px] [filter:drop-shadow(0_30px_80px_rgba(10,27,51,0.25))]"
              />
            ) : null}
          </div>
          <article className="space-y-7 font-[family-name:var(--font-body)] text-[19px] leading-[1.8] text-ink">
            <p className="font-[family-name:var(--font-ui)] text-[10px] font-semibold uppercase tracking-[2.4px] text-gold">
              {formatLongDate(letter.date)}
            </p>
            {letter.key_quote ? (
              <blockquote className="border-l-2 border-gold pl-7 font-[family-name:var(--font-display)] text-[26px] italic leading-[1.4]">
                &ldquo;{letter.key_quote}&rdquo;
              </blockquote>
            ) : null}
            {letter.description ? <p>{letter.description}</p> : null}
            {letter.pdf_url ? (
              <a
                href={letter.pdf_url}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#ffffff", ["--sweep-color" as string]: "#c9a664" }}
                className="btn-sweep inline-flex min-h-12 items-center gap-3 bg-ink px-8 py-4 font-[family-name:var(--font-ui)] text-[11px] font-semibold uppercase tracking-[2px] text-white transition-colors hover:text-ink focus-visible:text-ink"
              >
                Download the Full Letter (PDF) →
              </a>
            ) : (
              <p className="text-[15px] italic text-ink-soft">
                The full text of this letter will be available here shortly.
              </p>
            )}
            <hr className="my-12 h-px w-16 border-0 bg-gold" />
            <Link
              href="/pastoral-letters"
              className="inline-flex font-[family-name:var(--font-ui)] text-[11px] font-semibold uppercase tracking-[2px] text-ink"
            >
              ← All Pastoral Letters
            </Link>
          </article>
        </div>
      </PageSection>
    </PageShell>
  );
}
