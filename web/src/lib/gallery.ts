import manifest from "./gallery.json";

export type GalleryPhoto = {
  file: string;
  src: string;
  alt: string;
  caption: string;
  slug: string;
  date: string | null;
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

export function getGalleryPhotos(): GalleryPhoto[] {
  return RAW.map((p) => ({
    file: p.file,
    src: `/gallery/${p.file}`,
    alt: toCaption(p.alt, p.title),
    caption: toCaption(p.alt, p.title),
    slug: p.slug,
    date: p.date,
  }));
}
