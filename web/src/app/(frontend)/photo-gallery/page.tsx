import type { Metadata } from "next";
import Image from "next/image";
import { PageSection, PageShell } from "@/components/shell/page-shell";
import { Latin } from "@/components/editorial";
import { getGalleryPhotos } from "@/lib/gallery";

export const metadata: Metadata = {
  title: "Photo Gallery",
  description:
    "A pastoral archive in photographs — feasts, visitations, ordinations, and the daily life of the Metropolitan See of Onitsha.",
};

export default function PhotoGalleryPage() {
  const photos = getGalleryPhotos();

  return (
    <PageShell
      eyebrow={<Latin>Imagines Pastoris</Latin>}
      title="Photo"
      titleAccent="Gallery"
      lead="Feasts, visitations, ordinations, and the quiet work of the shepherd — a pastoral archive of the Metropolitan See."
    >
      <PageSection>
        {photos.length === 0 ? (
          <p className="text-[17px] leading-[1.7] text-ink-soft">
            The gallery is being prepared.
          </p>
        ) : (
          <ul className="grid grid-cols-3 gap-8 max-lg:grid-cols-2 max-md:grid-cols-1 max-md:gap-6">
            {photos.map((photo, idx) => (
              <li key={photo.file} className="flex flex-col">
                <figure className="group flex flex-col">
                  <div className="relative aspect-[4/3] overflow-hidden border border-stone bg-bone-deep">
                    <Image
                      src={photo.src}
                      alt={photo.alt}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      loading={idx < 6 ? "eager" : "lazy"}
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                    />
                  </div>
                  <figcaption className="mt-4 border-t border-[color:var(--rule)] pt-3 font-[family-name:var(--font-body)] text-[15px] leading-[1.55] text-ink-soft">
                    {photo.caption}
                  </figcaption>
                </figure>
              </li>
            ))}
          </ul>
        )}
      </PageSection>
    </PageShell>
  );
}
