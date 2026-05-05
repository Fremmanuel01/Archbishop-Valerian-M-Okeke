import type { Metadata } from "next";
import Link from "next/link";
import { PageSection, PageShell } from "@/components/shell/page-shell";
import { EmptyState, Roman } from "@/components/editorial";
import { plainExcerpt } from "@/components/prose";
import { getAddressesAndInterviews, slugify, yearOf } from "@/lib/cms";
import { Stagger, StaggerItem } from "@/components/motion";
import { getLang } from "@/lib/lang";
import { getDict } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Other Teachings",
  description:
    "Writings, addresses, and occasional teachings of His Grace Most Rev. Valerian Maduka Okeke.",
};

export const revalidate = 3600;

export default async function OtherTeachingsPage() {
  const [writings, lang] = await Promise.all([
    getAddressesAndInterviews(),
    getLang(),
  ]);
  const t = getDict(lang);
  const sorted = [...writings].sort((a, b) => {
    if (!a.date) return 1;
    if (!b.date) return -1;
    return a.date < b.date ? 1 : -1;
  });

  return (
    <PageShell
      eyebrow={t.pages.otherTeachings.eyebrow}
      title={t.pages.otherTeachings.title}
      titleAccent={t.pages.otherTeachings.titleAccent}
      lead={t.pages.otherTeachings.lead}
    >
      <PageSection>
        {sorted.length === 0 ? (
          <EmptyState
            title={t.empty.writingsTitle}
            body={t.empty.writingsBody}
          />
        ) : (
        <Stagger className="grid grid-cols-2 gap-10 max-md:grid-cols-1" amount={0.05}>
          {sorted.map((w) => {
            const year = yearOf(w.date);
            const href = `/other-teachings/${w.id}-${slugify(w.title)}`;
            const hasReadable = Boolean(w.body && w.body.trim().length > 0);
            return (
              <StaggerItem key={w.id} className="flex">
              <Link
                href={href}
                className="group flex flex-1 flex-col border border-[color:var(--rule)] bg-bone p-10 transition-colors hover:border-gold max-md:p-7"
              >
                <p className="font-[family-name:var(--font-ui)] text-[10px] font-semibold uppercase tracking-[2.4px] text-gold">
                  {w.category ?? "Writing"}
                  {year ? (
                    <>
                      {" · "}
                      <Roman year={year} />
                    </>
                  ) : null}
                </p>
                <h2 className="mt-4 font-[family-name:var(--font-display)] text-[28px] font-medium leading-[1.2] text-ink transition-colors group-hover:text-gold max-md:text-2xl">
                  {w.title}
                </h2>
                {w.occasion ? (
                  <p className="mt-3 font-[family-name:var(--font-display)] text-[17px] italic text-ink-soft">
                    {w.occasion}
                  </p>
                ) : null}
                {w.body ? (
                  <p className="mt-4 text-[16px] leading-[1.6] text-ink-soft">
                    {plainExcerpt(w.body, 180)}
                  </p>
                ) : null}
                <span className="mt-6 inline-flex w-fit border-b border-gold pb-1.5 font-[family-name:var(--font-ui)] text-[10px] font-semibold uppercase tracking-[2px] text-ink">
                  {hasReadable ? t.cta.readTheTeaching : t.cta.open}
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
