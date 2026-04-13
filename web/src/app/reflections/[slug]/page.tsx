import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageSection, PageShell } from "@/components/shell/page-shell";
import { Roman } from "@/components/editorial";
import {
  getHomilies,
  getHomily,
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
  const homilies = await getHomilies();
  return homilies.map((h) => ({ slug: `${h.id}-${slugify(h.title)}` }));
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
    const homily = await getHomily(id);
    return {
      title: homily.title,
      description: homily.description ?? homily.occasion ?? undefined,
    };
  } catch {
    return { title: "Not found" };
  }
}

export default async function HomilyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const id = parseSlug(slug);
  if (!id) notFound();

  let homily;
  try {
    homily = await getHomily(id);
  } catch {
    notFound();
  }

  const year = yearOf(homily.date);
  const cover = homily.cover_photo_url ?? homily.thumbnail_url;

  return (
    <PageShell
      eyebrow={
        <>
          Homily
          {homily.occasion ? (
            <>
              {" · "}
              {homily.occasion}
            </>
          ) : null}
        </>
      }
      title={homily.title}
      lead={homily.description ?? undefined}
    >
      <PageSection>
        <div className="grid grid-cols-[1fr_1.4fr] gap-20 max-lg:grid-cols-1 max-lg:gap-14">
          {cover ? (
            <div className="flex justify-center">
              <Image
                src={cover}
                alt={homily.title}
                width={1000}
                height={1200}
                sizes="(max-width: 1024px) 100vw, 480px"
                className="h-auto w-full max-w-[460px] [filter:drop-shadow(0_30px_80px_rgba(10,27,51,0.18))]"
              />
            </div>
          ) : (
            <div />
          )}
          <article className="space-y-7 font-[family-name:var(--font-body)] text-[19px] leading-[1.8] text-ink">
            <p className="font-[family-name:var(--font-ui)] text-[10px] font-semibold uppercase tracking-[2.4px] text-gold-text">
              <time dateTime={homily.date ?? undefined}>
                {homily.date ? formatLongDate(homily.date) : ""}
              </time>
              {year ? (
                <>
                  {" · "}
                  <Roman year={year} arabic={false} />
                </>
              ) : null}
            </p>
            {homily.key_quote ? (
              <blockquote className="border-l-2 border-gold pl-7 font-[family-name:var(--font-display)] text-[26px] italic leading-[1.4]">
                &ldquo;{homily.key_quote}&rdquo;
              </blockquote>
            ) : null}
            {homily.description ? (
              <p>{homily.description}</p>
            ) : (
              <p className="italic text-ink-soft">
                The full text of this homily will be available here
                shortly.
              </p>
            )}
            {homily.pdf_url ? (
              <a
                href={homily.pdf_url}
                target="_blank"
                rel="noopener noreferrer"
                style={{ ["--sweep-color" as string]: "#c9a664" }}
                className="btn-ink btn-sweep"
              >
                Download the Full Homily (PDF) →
              </a>
            ) : null}
            <hr className="my-12 h-px w-16 border-0 bg-gold" />
            <Link
              href="/reflections"
              className="link-underline inline-flex font-[family-name:var(--font-ui)] text-[11px] font-semibold uppercase tracking-[2px] text-ink"
            >
              ← All Homilies & Reflections
            </Link>
          </article>
        </div>
      </PageSection>
    </PageShell>
  );
}
