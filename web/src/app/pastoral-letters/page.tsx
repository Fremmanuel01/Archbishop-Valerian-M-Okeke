import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageSection, PageShell } from "@/components/shell/page-shell";
import { Roman } from "@/components/editorial";
import { getPastoralLetters, slugify, yearOf } from "@/lib/cms";

export const metadata: Metadata = {
  title: "Pastoral Letters",
  description:
    "The pastoral letters of His Grace Most Rev. Valerian Maduka Okeke, Archbishop of Onitsha.",
};

export const revalidate = 3600;

export default async function PastoralLettersPage() {
  const letters = await getPastoralLetters();
  const sorted = [...letters].sort((a, b) => {
    const ya = yearOf(a.date) ?? 0;
    const yb = yearOf(b.date) ?? 0;
    return yb - ya;
  });

  return (
    <PageShell
      eyebrow="The Library"
      title="Pastoral"
      titleAccent="Letters"
      lead="Over twenty years of teaching and shepherding the faithful of the Archdiocese — a living archive of pastoral wisdom."
    >
      <PageSection>
        <div className="grid grid-cols-3 gap-14 max-lg:grid-cols-2 max-lg:gap-10 max-md:grid-cols-1">
          {sorted.map((letter) => {
            const slug = `${letter.id}-${slugify(letter.title)}`;
            const year = yearOf(letter.date);
            const cover = letter.cover_photo_url ?? letter.thumbnail_url;
            return (
              <Link
                key={letter.id}
                href={`/pastoral-letters/${slug}`}
                className="group flex flex-col"
              >
                <div className="relative aspect-[4/5] w-full overflow-hidden bg-stone">
                  {cover ? (
                    <Image
                      src={cover}
                      alt={`Cover of ${letter.title}`}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.03] [filter:drop-shadow(0_20px_60px_rgba(10,27,51,0.2))]"
                    />
                  ) : null}
                </div>
                <p className="mt-7 font-[family-name:var(--font-ui)] text-[10px] font-semibold uppercase tracking-[2.4px] text-gold">
                  Pastoral Letter
                  {year ? (
                    <>
                      {" · "}
                      <Roman year={year} />
                    </>
                  ) : null}
                </p>
                <h2 className="mt-3 font-[family-name:var(--font-display)] text-[28px] font-medium leading-[1.15] text-ink transition-colors group-hover:text-gold">
                  {letter.title}
                </h2>
                {letter.description ? (
                  <p className="mt-3 text-[16px] leading-[1.55] text-ink-soft">
                    {letter.description}
                  </p>
                ) : null}
                <span className="mt-5 inline-flex w-fit border-b border-gold pb-1.5 font-[family-name:var(--font-ui)] text-[10px] font-semibold uppercase tracking-[2px] text-ink">
                  Read the Letter →
                </span>
              </Link>
            );
          })}
        </div>
      </PageSection>
    </PageShell>
  );
}
