import "server-only";
import { getPayloadClient } from "@/lib/payload";

export type NewsletterArchiveEntry = {
  id: string | number;
  slug: string;
  editionDate: string;
  subjectLine: string;
  eyebrow: string | null;
  lead: string | null;
  sentAt: string | null;
  postsCount: number;
};

export type NewsletterArchiveDetail = NewsletterArchiveEntry & {
  htmlSnapshot: string | null;
};

// Public archive lists only editions that were actually broadcast. Drafts,
// failed editions, and skipped months stay out of the public view.
export async function getSentEditions(): Promise<NewsletterArchiveEntry[]> {
  const payload = await getPayloadClient();
  const result = await payload.find({
    collection: "newsletter-editions",
    where: { status: { equals: "sent" } },
    sort: "-editionDate",
    limit: 200,
  });
  return result.docs.map((d) => {
    const doc = d as unknown as {
      id: string | number;
      slug: string;
      editionDate: string;
      subjectLine: string;
      eyebrow?: string | null;
      lead?: string | null;
      sentAt?: string | null;
      posts?: unknown[] | null;
    };
    return {
      id: doc.id,
      slug: doc.slug,
      editionDate: doc.editionDate,
      subjectLine: doc.subjectLine,
      eyebrow: doc.eyebrow ?? null,
      lead: doc.lead ?? null,
      sentAt: doc.sentAt ?? null,
      postsCount: Array.isArray(doc.posts) ? doc.posts.length : 0,
    };
  });
}

export async function getSentEditionBySlug(
  slug: string,
): Promise<NewsletterArchiveDetail | null> {
  const payload = await getPayloadClient();
  const result = await payload.find({
    collection: "newsletter-editions",
    where: {
      and: [{ slug: { equals: slug } }, { status: { equals: "sent" } }],
    },
    limit: 1,
  });
  const doc = result.docs[0] as unknown as
    | (NewsletterArchiveDetail & {
        eyebrow?: string | null;
        lead?: string | null;
        sentAt?: string | null;
        htmlSnapshot?: string | null;
        posts?: unknown[] | null;
      })
    | undefined;
  if (!doc) return null;
  return {
    id: doc.id,
    slug: doc.slug,
    editionDate: doc.editionDate,
    subjectLine: doc.subjectLine,
    eyebrow: doc.eyebrow ?? null,
    lead: doc.lead ?? null,
    sentAt: doc.sentAt ?? null,
    htmlSnapshot: doc.htmlSnapshot ?? null,
    postsCount: Array.isArray(doc.posts) ? doc.posts.length : 0,
  };
}
