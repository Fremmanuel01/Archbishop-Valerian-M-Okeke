import "server-only";
import { put } from "@vercel/blob";

// Mirrors third-party image URLs (typically Facebook CDN) to Vercel Blob
// so the newsletter has a stable image URL that survives:
//   • FB CDN signed URL expiry (their `?_nc_` URLs rotate aggressively)
//   • The original FB post being deleted or made private
//   • Quotation in the public archive months/years after sending
//
// Without this mirror, a sent edition's images break within weeks and the
// public archive at /diary/newsletter/[slug] turns into a wall of broken
// `<img>` tags.

const VERCEL_BLOB_HOST_RE = /\.public\.blob\.vercel-storage\.com\//;

export function blobMirrorConfigured(): boolean {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

function extensionFromContentType(contentType: string): string {
  const lower = contentType.toLowerCase();
  if (lower.includes("png")) return "png";
  if (lower.includes("webp")) return "webp";
  if (lower.includes("gif")) return "gif";
  if (lower.includes("svg")) return "svg";
  return "jpg";
}

export type MirrorInput = {
  /** Original third-party URL to mirror. */
  sourceUrl: string;
  /** Logical filename within the blob store, without extension. The mirror
   *  appends a content-type-derived suffix and a random hash so re-uploads
   *  never collide with cached old copies. */
  pathname: string;
};

export type MirrorResult =
  | { ok: true; url: string; mirrored: boolean }
  | { ok: false; reason: string };

/**
 * Download a remote image and re-publish it under public.blob.vercel-storage.com.
 *
 * - Returns the *original* URL untouched if it's already on Vercel Blob (no-op).
 * - Returns the *original* URL untouched if the blob token isn't configured —
 *   callers can branch on `result.mirrored` to know whether the URL is
 *   actually stable.
 * - Returns `{ ok: false }` on download / upload failure so callers can
 *   gracefully fall back to the source URL with full visibility into the
 *   failure reason.
 */
export async function mirrorImageToBlob(
  input: MirrorInput,
): Promise<MirrorResult> {
  const { sourceUrl, pathname } = input;
  if (!sourceUrl) return { ok: false, reason: "empty source url" };
  if (VERCEL_BLOB_HOST_RE.test(sourceUrl)) {
    return { ok: true, url: sourceUrl, mirrored: false };
  }
  if (!blobMirrorConfigured()) {
    return { ok: true, url: sourceUrl, mirrored: false };
  }

  let response: Response;
  try {
    response = await fetch(sourceUrl, { cache: "no-store" });
  } catch (err) {
    return {
      ok: false,
      reason: `fetch failed: ${err instanceof Error ? err.message : String(err)}`,
    };
  }
  if (!response.ok) {
    return { ok: false, reason: `source returned ${response.status}` };
  }
  const contentType = response.headers.get("content-type") ?? "image/jpeg";
  if (!contentType.startsWith("image/")) {
    return { ok: false, reason: `non-image content-type: ${contentType}` };
  }

  const buffer = Buffer.from(await response.arrayBuffer());
  // Cap at 25 MB. FB images are usually <5MB; anything larger is suspicious
  // and not worth pulling into long-term storage.
  if (buffer.byteLength > 25 * 1024 * 1024) {
    return { ok: false, reason: `image too large (${buffer.byteLength} bytes)` };
  }

  const ext = extensionFromContentType(contentType);
  const finalPathname = pathname.endsWith(`.${ext}`)
    ? pathname
    : `${pathname}.${ext}`;

  try {
    const blob = await put(finalPathname, buffer, {
      access: "public",
      contentType,
      token: process.env.BLOB_READ_WRITE_TOKEN,
      addRandomSuffix: true,
    });
    return { ok: true, url: blob.url, mirrored: true };
  } catch (err) {
    return {
      ok: false,
      reason: `blob put failed: ${err instanceof Error ? err.message : String(err)}`,
    };
  }
}
