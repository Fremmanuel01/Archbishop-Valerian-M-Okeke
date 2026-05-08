import "server-only";

// Facebook Graph API client — fetches public posts from the Archbishop's
// page for inclusion in the monthly Pastoral Diary newsletter.
//
// PHASE STATUS: implementation is complete but gated on a valid Page Access
// Token. Until FACEBOOK_PAGE_ACCESS_TOKEN and FACEBOOK_PAGE_ID are set in
// the env, fetchPagePosts() throws FacebookNotConfigured — which the cron
// handler catches and converts to an "edition skipped because FB not yet
// available" status on the Edition record.
//
// To unblock production:
//   1. The Office's Meta Developer App must complete App Review for
//      `pages_read_engagement` permission.
//   2. Generate a long-lived (or never-expiring) Page Access Token via
//      System User → Token, scoped to the Archbishop's Page.
//   3. Set FACEBOOK_PAGE_ID + FACEBOOK_PAGE_ACCESS_TOKEN in Vercel envs
//      (production + preview + development) — same pattern we used for the
//      Resend keys.
//
// The Graph API version is pinned to v22.0 (current as of mid-2026).
// When Meta deprecates a version they typically give 2-year notice; bump
// the constant when the deprecation email lands.

const GRAPH_API_VERSION = "v22.0";

export class FacebookNotConfigured extends Error {
  constructor() {
    super("Facebook page credentials not yet provisioned (FACEBOOK_PAGE_ID / FACEBOOK_PAGE_ACCESS_TOKEN missing).");
    this.name = "FacebookNotConfigured";
  }
}

export type FBPost = {
  id: string;
  message: string;
  createdTime: Date;
  permalinkUrl: string;
  /** First image URL on the post. Returned as the original FB CDN URL —
   *  the cron handler at /api/cron/newsletter mirrors it to Vercel Blob
   *  via `lib/blob-mirror.ts` before persisting the edition, so the
   *  long-term archived URL is stable. */
  imageUrl: string | null;
};

type GraphPagePostsResponse = {
  data: Array<{
    id: string;
    message?: string;
    created_time: string;
    permalink_url?: string;
    full_picture?: string;
    attachments?: {
      data?: Array<{
        media?: { image?: { src: string } };
        subattachments?: { data?: Array<{ media?: { image?: { src: string } } }> };
      }>;
    };
  }>;
  paging?: { next?: string };
};

function getCreds() {
  const pageId = process.env.FACEBOOK_PAGE_ID;
  const token = process.env.FACEBOOK_PAGE_ACCESS_TOKEN;
  if (!pageId || !token) throw new FacebookNotConfigured();
  return { pageId, token };
}

/** Fetch all public posts from the configured page within [since, until). */
export async function fetchPagePosts(input: {
  /** Inclusive lower bound. */
  since: Date;
  /** Exclusive upper bound. Defaults to now. */
  until?: Date;
}): Promise<FBPost[]> {
  const { pageId, token } = getCreds();
  const since = Math.floor(input.since.getTime() / 1000);
  const until = Math.floor((input.until ?? new Date()).getTime() / 1000);

  const fields = [
    "id",
    "message",
    "created_time",
    "permalink_url",
    "full_picture",
    "attachments{media{image},subattachments{media{image}}}",
  ].join(",");

  const out: FBPost[] = [];
  let url: string | undefined =
    `https://graph.facebook.com/${GRAPH_API_VERSION}/${pageId}/posts` +
    `?fields=${encodeURIComponent(fields)}&since=${since}&until=${until}&limit=100&access_token=${encodeURIComponent(token)}`;

  // Paginate until exhausted or we hit the safety cap.
  let pages = 0;
  while (url && pages < 10) {
    const res: Response = await fetch(url, { cache: "no-store" });
    if (!res.ok) {
      const body = await res.text().catch(() => "");
      throw new Error(`Facebook Graph API failed (${res.status}): ${body.slice(0, 200)}`);
    }
    const json = (await res.json()) as GraphPagePostsResponse;
    for (const p of json.data ?? []) {
      out.push({
        id: p.id,
        message: p.message ?? "",
        createdTime: new Date(p.created_time),
        permalinkUrl: p.permalink_url ?? `https://www.facebook.com/${p.id}`,
        imageUrl: extractImage(p),
      });
    }
    url = json.paging?.next;
    pages += 1;
  }

  // Chronological (oldest → newest) for newsletter rendering.
  return out.sort((a, b) => a.createdTime.getTime() - b.createdTime.getTime());
}

function extractImage(post: GraphPagePostsResponse["data"][number]): string | null {
  if (post.full_picture) return post.full_picture;
  const att = post.attachments?.data?.[0];
  if (att?.media?.image?.src) return att.media.image.src;
  const sub = att?.subattachments?.data?.[0]?.media?.image?.src;
  return sub ?? null;
}

/** True iff env credentials are present. Lets callers branch without
 *  catching the FacebookNotConfigured throw. */
export function isFacebookConfigured(): boolean {
  return Boolean(process.env.FACEBOOK_PAGE_ID && process.env.FACEBOOK_PAGE_ACCESS_TOKEN);
}
