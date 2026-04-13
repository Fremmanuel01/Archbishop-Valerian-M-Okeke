import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageSection, PageShell } from "@/components/shell/page-shell";
import { Roman } from "@/components/editorial";
import { Prose } from "@/components/prose";
import {
  getMessages,
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
  const messages = await getMessages();
  return messages.map((m) => ({ slug: `${m.id}-${slugify(m.title)}` }));
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
    const msg = await getWriting(id);
    return {
      title: msg.title,
      description: msg.occasion ?? undefined,
    };
  } catch {
    return { title: "Not found" };
  }
}

export default async function MessagePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const id = parseSlug(slug);
  if (!id) notFound();

  let message;
  try {
    message = await getWriting(id);
  } catch {
    notFound();
  }

  if (message.category !== "Message") notFound();

  const year = yearOf(message.date);
  const isChristmas = message.title.toLowerCase().includes("christmas");
  const season = isChristmas ? "Christmas" : "Easter";
  const cleanTitle = message.title.replace(
    /^\d{4}\s+(Easter|Christmas)\s+Message:\s*/i,
    "",
  );

  return (
    <PageShell
      eyebrow={
        <>
          {season} Message
          {year ? (
            <>
              {" · "}
              <Roman year={year} />
            </>
          ) : null}
        </>
      }
      title={cleanTitle}
      lead={message.occasion ?? undefined}
    >
      <PageSection>
        <div className="grid grid-cols-[1fr_1.4fr] gap-20 max-lg:grid-cols-1 max-lg:gap-14">
          {message.cover_photo_url ? (
            <div className="flex justify-center">
              <Image
                src={message.cover_photo_url}
                alt={message.title}
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
              <time dateTime={message.date ?? undefined}>
                {message.date ? formatLongDate(message.date) : ""}
              </time>
            </p>
            {message.body ? (
              <Prose markdown={message.body} />
            ) : (
              <p className="italic text-ink-soft">
                The full text of this message will be available here
                shortly.
              </p>
            )}
            {message.pdf_url ? (
              <a
                href={message.pdf_url}
                target="_blank"
                rel="noopener noreferrer"
                style={{ ["--sweep-color" as string]: "#c9a664" }}
                className="btn-ink btn-sweep"
              >
                Download the Full Message (PDF) →
              </a>
            ) : null}
            <hr className="my-12 h-px w-16 border-0 bg-gold" />
            <Link
              href="/messages"
              className="link-underline inline-flex font-[family-name:var(--font-ui)] text-[11px] font-semibold uppercase tracking-[2px] text-ink"
            >
              ← All Easter & Christmas Messages
            </Link>
          </article>
        </div>
      </PageSection>
    </PageShell>
  );
}
