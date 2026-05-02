import "server-only";
import manifest from "./gallery.json";
import { getPayloadClient } from "./payload";

export type GalleryPhoto = {
  file: string;
  src: string;
  alt: string;
  caption: string;
  slug: string;
  date: string | null;
  category?: string;
};

const RAW = manifest as Array<{
  file: string;
  alt: string;
  title: string;
  slug: string;
  date: string | null;
  url: string | null;
}>;

function toCaption(alt: string, title: string): string {
  if (alt && alt.trim().length > 0) return alt.trim();
  return title;
}

function slugFromCaption(caption: string, fallbackId: string): string {
  const slug = caption
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);
  return slug || `gallery-${fallbackId}`;
}

const FALLBACK_PHOTOS: GalleryPhoto[] = RAW.map((p) => ({
  file: p.file,
  src: `/gallery/${p.file}`,
  alt: toCaption(p.alt, p.title),
  caption: toCaption(p.alt, p.title),
  slug: p.slug,
  date: p.date,
}));

export async function getGalleryPhotos(): Promise<GalleryPhoto[]> {
  try {
    const payload = await getPayloadClient();
    const result = await payload.find({
      collection: "gallery-images",
      sort: "order",
      limit: 200,
      depth: 1,
    });
    if (!result.docs.length) return FALLBACK_PHOTOS;
    const photos: GalleryPhoto[] = [];
    for (const doc of result.docs) {
      const caption = typeof doc.caption === "string" ? doc.caption : "";
      const image = doc.image;
      if (
        !image ||
        typeof image !== "object" ||
        !("url" in image) ||
        typeof image.url !== "string" ||
        image.url.length === 0
      ) {
        continue;
      }
      const id = String(doc.id);
      const filename =
        "filename" in image && typeof image.filename === "string"
          ? image.filename
          : id;
      const altFromImage =
        "alt" in image && typeof image.alt === "string" ? image.alt : "";
      photos.push({
        file: filename,
        src: image.url,
        alt: altFromImage || caption || "Photograph from the gallery",
        caption: caption || altFromImage || "",
        slug: slugFromCaption(caption || altFromImage, id),
        date: null,
        category:
          typeof doc.category === "string" ? doc.category : undefined,
      });
    }
    return photos.length > 0 ? photos : FALLBACK_PHOTOS;
  } catch (error) {
    console.error("[gallery] payload read failed, using fallback:", error);
    return FALLBACK_PHOTOS;
  }
}
