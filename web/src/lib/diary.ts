import "server-only";
import { getPayloadClient } from "./payload";
import { FALLBACK_DIARY, type DiaryEntry } from "@/data/diary";

type CoverImage = { url?: string | null } | string | number | null | undefined;

function coverUrl(cover: CoverImage): string | undefined {
  if (cover && typeof cover === "object" && "url" in cover && cover.url) {
    return cover.url;
  }
  return undefined;
}

export async function getRecentDiary(limit = 3): Promise<DiaryEntry[]> {
  try {
    const payload = await getPayloadClient();
    const result = await payload.find({
      collection: "diary-entries",
      sort: "-date",
      limit,
      depth: 1,
    });
    if (!result.docs.length) return FALLBACK_DIARY.slice(0, limit);
    return result.docs.map((doc) => ({
      id: String(doc.id),
      title: String(doc.title ?? ""),
      date: String(doc.date ?? ""),
      excerpt: String(doc.excerpt ?? ""),
      location:
        doc.location && typeof doc.location === "string"
          ? doc.location
          : undefined,
      coverImageUrl: coverUrl(doc.coverImage as CoverImage),
    }));
  } catch (error) {
    console.error("[diary] payload read failed, using fallback:", error);
    return FALLBACK_DIARY.slice(0, limit);
  }
}

export type { DiaryEntry } from "@/data/diary";
