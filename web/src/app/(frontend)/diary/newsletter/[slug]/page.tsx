import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageSection, PageShell } from "@/components/shell/page-shell";
import { Latin, toRoman } from "@/components/editorial";
import { NewsletterIframe } from "@/components/newsletter-iframe";
import { getSentEditionBySlug } from "@/lib/newsletter-archive";
import {
  renderNewsletterHtml,
  type NewsletterPost,
} from "@/lib/newsletter-template";
import { getPayloadClient } from "@/lib/payload";
import { SITE_URL } from "@/lib/site";

export const revalidate = 3600;

const MONTH_NAMES_UPPER = [
  "JANUARY",
  "FEBRUARY",
  "MARCH",
  "APRIL",
  "MAY",
  "JUNE",
  "JULY",
  "AUGUST",
  "SEPTEMBER",
  "OCTOBER",
  "NOVEMBER",
  "DECEMBER",
];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const edition = await getSentEditionBySlug(slug);
  if (!edition) {
    return { title: "Newsletter edition" };
  }
  const description =
    edition.lead ?? "An edition of the monthly Pastoral Diary newsletter.";
  return {
    title: `${edition.subjectLine} · Pastoral Diary`,
    description,
    alternates: { canonical: `/diary/newsletter/${slug}` },
    openGraph: {
      title: `${edition.subjectLine} · Pastoral Diary`,
      description,
      type: "article",
      url: `/diary/newsletter/${slug}`,
    },
  };
}

// Re-render the email HTML for archive viewing if the snapshot is missing
// (older editions sent before htmlSnapshot was captured). For editions with
// a snapshot, return it after rewriting the broadcast-only Resend merge tag
// so anonymous archive readers get a working manage-subscription link
// instead of the literal `{{{RESEND_UNSUBSCRIBE_URL}}}` placeholder.
async function getEditionHtml(slug: string): Promise<string | null> {
  const edition = await getSentEditionBySlug(slug);
  if (!edition) return null;
  const manualUnsubscribeUrl = `${SITE_URL}/connect/newsletter/unsubscribe`;
  if (edition.htmlSnapshot && edition.htmlSnapshot.length > 0) {
    return edition.htmlSnapshot.replaceAll(
      "{{{RESEND_UNSUBSCRIBE_URL}}}",
      manualUnsubscribeUrl,
    );
  }
  // Fallback: re-render from the stored posts.
  const payload = await getPayloadClient();
  const result = await payload.find({
    collection: "newsletter-editions",
    where: { slug: { equals: slug } },
    limit: 1,
  });
  const doc = result.docs[0] as unknown as
    | {
        editionDate: string;
        subjectLine: string;
        eyebrow?: string | null;
        lead?: string | null;
        posts?: Array<{
          message?: string | null;
          imageUrl?: string | null;
          permalinkUrl?: string | null;
          createdTime: string;
        }> | null;
      }
    | undefined;
  if (!doc) return null;
  const posts: NewsletterPost[] = (doc.posts ?? []).map((p) => ({
    message: p.message ?? "",
    imageUrl: p.imageUrl ?? null,
    permalinkUrl: p.permalinkUrl ?? null,
    createdTime: new Date(p.createdTime),
  }));
  return renderNewsletterHtml({
    editionDate: new Date(doc.editionDate),
    subjectLine: doc.subjectLine,
    eyebrow: doc.eyebrow ?? undefined,
    lead: doc.lead ?? undefined,
    posts,
    unsubscribeUrl: `${SITE_URL}/connect/newsletter/unsubscribe`,
  });
}

export default async function NewsletterEditionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const edition = await getSentEditionBySlug(slug);
  if (!edition) notFound();
  const html = await getEditionHtml(slug);

  const d = new Date(edition.editionDate);
  const monthLabel = MONTH_NAMES_UPPER[d.getUTCMonth()] ?? "";
  const year = d.getUTCFullYear();
  const romanYear = toRoman(year);

  return (
    <PageShell
      eyebrow={
        <Latin>
          Pastoral Diary · {monthLabel} <abbr title={String(year)}>{romanYear}</abbr>
        </Latin>
      }
      title={edition.subjectLine}
      lead={edition.lead ?? undefined}
    >
      <PageSection>
        <div className="mx-auto max-w-[760px]">
          <div className="mb-6 flex items-center justify-between border-b border-[color:var(--rule)] pb-4 font-[family-name:var(--font-ui)] text-[10px] font-semibold uppercase tracking-[2px] text-ink-soft">
            <Link
              href="/diary/newsletter"
              className="link-underline text-ink"
            >
              ← All editions
            </Link>
            {edition.sentAt ? (
              <span>
                Sent{" "}
                {new Date(edition.sentAt).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                  timeZone: "UTC",
                })}
              </span>
            ) : null}
          </div>

          {html ? (
            <NewsletterIframe html={html} title={edition.subjectLine} />
          ) : (
            <p className="border border-[color:var(--rule)] bg-bone-deep p-10 text-center font-[family-name:var(--font-body)] italic text-ink-soft">
              The body of this edition could not be rendered.
            </p>
          )}
        </div>
      </PageSection>
    </PageShell>
  );
}
