import "server-only";
import { getPayloadClient } from "./payload";
import {
  PASTORAL_VIDEOS,
  type PastoralVideo,
} from "./featured-videos";

export type { PastoralVideo } from "./featured-videos";

function formatDate(iso: string): string {
  const trimmed = iso.slice(0, 10);
  const d = new Date(trimmed);
  if (Number.isNaN(d.getTime())) return iso;
  return new Intl.DateTimeFormat("en-GB", {
    month: "long",
    year: "numeric",
  }).format(d);
}

export async function getPastoralVideos(): Promise<PastoralVideo[]> {
  try {
    const payload = await getPayloadClient();
    const result = await payload.find({
      collection: "featured-videos",
      sort: "order",
      limit: 9,
      depth: 0,
    });
    if (!result.docs.length) return PASTORAL_VIDEOS;
    return result.docs
      .map((doc): PastoralVideo | null => {
        const id =
          typeof doc.youtubeId === "string" ? doc.youtubeId.trim() : "";
        const title = typeof doc.title === "string" ? doc.title.trim() : "";
        if (!id || !title) return null;
        const dateRaw =
          typeof doc.date === "string" && doc.date.length > 0
            ? doc.date
            : null;
        return {
          id,
          title,
          occasion:
            typeof doc.occasion === "string" && doc.occasion.length > 0
              ? doc.occasion
              : undefined,
          date: dateRaw ? formatDate(dateRaw) : undefined,
          iso: dateRaw ? dateRaw.slice(0, 10) : undefined,
          duration:
            typeof doc.duration === "string" && doc.duration.length > 0
              ? doc.duration
              : undefined,
        };
      })
      .filter((v): v is PastoralVideo => v !== null);
  } catch (error) {
    console.error("[videos] payload read failed, using fallback:", error);
    return PASTORAL_VIDEOS;
  }
}
