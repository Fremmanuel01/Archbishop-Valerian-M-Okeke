import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageSection, PageShell } from "@/components/shell/page-shell";
import { EmptyState, Roman } from "@/components/editorial";
import { getPastoralLetters, slugify, yearOf } from "@/lib/cms";
import { plainExcerpt } from "@/components/prose";
import { Stagger, StaggerItem } from "@/components/motion";
import { getLang } from "@/lib/lang";
import { getDict } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Pastoral Letters",
  description:
    "The pastoral letters of His Grace Most Rev. Valerian Maduka Okeke, Archbishop of Onitsha.",
};

export const revalidate = 3600;

export default async function PastoralLettersPage() {
  const [letters, lang] = await Promise.all([getPastoralLetters(), getLang()]);
  const t = getDict(lang);
  const sorted = [...letters].sort((a, b) => {
    const ya = yearOf(a.date) ?? 0;
    const yb = yearOf(b.date) ?? 0;
    return yb - ya;
  });

  return (
    <PageShell
      eyebrow={t.pages.pastoralLetters.eyebrow}
      title={t.pages.pastoralLetters.title}
      titleAccent={t.pages.pastoralLetters.titleAccent}
      lead={t.pages.pastoralLetters.lead}
    >
      <PageSection containerClassName="!max-w-[1520px]">
        {sorted.length === 0 ? (
          <EmptyState
            title={t.empty.pastoralLettersTitle}
            body={t.empty.pastoralLettersBody}
          />
        ) : (
        <Stagger className="grid grid-cols-3 gap-14 max-lg:grid-cols-2 max-lg:gap-10 max-md:grid-cols-1 2xl:grid-cols-4" amount={0.05}>
          {sorted.map((letter) => {
            const slug = `${letter.id}-${slugify(letter.title)}`;
            const year = yearOf(letter.date);
            const cover = letter.cover_photo_url ?? letter.thumbnail_url;
            return (
              <StaggerItem key={letter.id} className="flex">
              <Link
                href={`/pastoral-letters/${slug}`}
                className="group flex flex-1 flex-col"
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
                  {t.panel.libraryTitle}
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
                    {plainExcerpt(letter.description, 160)}
                  </p>
                ) : null}
                <span className="mt-5 inline-flex w-fit border-b border-gold pb-1.5 font-[family-name:var(--font-ui)] text-[10px] font-semibold uppercase tracking-[2px] text-ink">
                  {t.cta.readTheLetter}
                </span>
              </Link>
              </StaggerItem>
            );
          })}
        </Stagger>
        )}
      </PageSection>
    </PageShell>
  );
}
