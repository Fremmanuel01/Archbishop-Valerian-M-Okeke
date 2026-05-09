import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageSection, PageShell } from "@/components/shell/page-shell";
import { Roman } from "@/components/editorial";
import { Prose } from "@/components/prose";
import { BodyLanguageNotice } from "@/components/body-language-notice";
import { getLang } from "@/lib/lang";
import {
  getAddressesAndInterviews,
  getWriting,
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
  const writings = await getAddressesAndInterviews();
  return writings.map((w) => ({ slug: `${w.id}-${slugify(w.title)}` }));
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
    const w = await getWriting(id);
    return {
      title: w.title,
      description: w.occasion ?? undefined,
      alternates: { canonical: `/other-teachings/${slug}` },
      openGraph: {
        title: w.title,
        description: w.occasion ?? undefined,
        type: "article",
        url: `/other-teachings/${slug}`,
      },
    };
  } catch {
    return { title: "Not found" };
  }
}

export default async function OtherTeachingPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const id = parseSlug(slug);
  if (!id) notFound();

  let writing;
  try {
    writing = await getWriting(id);
  } catch {
    notFound();
  }

  if (writing.category === "Message") notFound();

  const year = yearOf(writing.date);
  const lang = await getLang();

  return (
    <PageShell
      eyebrow={
        <>
          {writing.category ?? "Writing"}
          {year ? (
            <>
              {" · "}
              <Roman year={year} />
            </>
          ) : null}
        </>
      }
      title={writing.title}
      lead={writing.occasion ?? undefined}
    >
      <PageSection containerClassName="!max-w-[820px]">
        <article className="space-y-7 font-[family-name:var(--font-body)] text-[19px] leading-[1.8] text-ink">
          <p className="font-[family-name:var(--font-ui)] text-[10px] font-semibold uppercase tracking-[2.4px] text-gold-text">
            <time dateTime={writing.date ?? undefined}>
              {writing.date ? formatLongDate(writing.date) : ""}
            </time>
          </p>
          <BodyLanguageNotice lang={lang} />
          {writing.body ? (
            <Prose markdown={writing.body} />
          ) : (
            <p className="italic text-ink-soft">
              The full text of this teaching will be available here shortly.
            </p>
          )}
          {writing.pdf_url ? (
            <a
              href={writing.pdf_url}
              target="_blank"
              rel="noopener noreferrer"
              style={{ ["--sweep-color" as string]: "#c9a664" }}
              className="btn-ink btn-sweep"
            >
              Download the Full Text (PDF) →
            </a>
          ) : null}
          <hr className="my-12 h-px w-16 border-0 bg-gold" />
          <Link
            href="/other-teachings"
            className="link-underline inline-flex font-[family-name:var(--font-ui)] text-[11px] font-semibold uppercase tracking-[2px] text-ink"
          >
            ← All Other Teachings
          </Link>
        </article>
      </PageSection>
    </PageShell>
  );
}
