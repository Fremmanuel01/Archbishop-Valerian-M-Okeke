import type { Metadata } from "next";
import Link from "next/link";
import { PageSection, PageShell } from "@/components/shell/page-shell";
import { Latin, toRoman } from "@/components/editorial";
import { getSentEditions } from "@/lib/newsletter-archive";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Pastoral Diary · Newsletter Archive",
  description:
    "Past editions of the monthly Pastoral Diary newsletter from the Office of His Grace.",
};

const MONTH_NAMES_UPPER = [
  "JANUARY",
  "FEBRUARY",
  "MARCH",
  "APRIL",
  "MAY",
  "JUNE",
  "JULY",
  "AUGUST",
  "SEPTEMBER",
  "OCTOBER",
  "NOVEMBER",
  "DECEMBER",
];

function formatRomanDateLabel(iso: string): {
  monthLabel: string;
  romanYear: string;
  year: number;
} {
  const d = new Date(iso);
  const monthLabel = MONTH_NAMES_UPPER[d.getUTCMonth()] ?? "";
  const year = d.getUTCFullYear();
  return { monthLabel, romanYear: toRoman(year), year };
}

export default async function NewsletterArchivePage() {
  const editions = await getSentEditions();

  return (
    <PageShell
      eyebrow={<Latin>Pastoral Diary · Archive</Latin>}
      title="From the Page"
      titleAccent="of His Grace"
      lead="Past editions of the monthly Pastoral Diary — pastoral letters, reflections, and seasonal messages, as they were sent to subscribers."
    >
      <PageSection>
        <div className="mx-auto max-w-[880px]">
          {editions.length === 0 ? (
            <div className="border border-[color:var(--rule)] bg-bone-deep p-12 text-center max-md:p-6">
              <p className="font-[family-name:var(--font-ui)] text-[10px] font-semibold uppercase tracking-[3px] text-gold-text">
                The archive is opening
              </p>
              <p className="mt-4 font-[family-name:var(--font-body)] text-[18px] italic leading-[1.6] text-ink-soft">
                No editions have been published yet. Subscribe below to
                receive the first one as it is sent.
              </p>
              <div className="mt-8">
                <Link
                  href="/connect/newsletter"
                  className="link-underline font-[family-name:var(--font-ui)] text-[11px] uppercase tracking-[1.5px] text-ink"
                >
                  Subscribe to the newsletter →
                </Link>
              </div>
            </div>
          ) : (
            <ol className="divide-y divide-[color:var(--rule)]">
              {editions.map((e) => {
                const { monthLabel, romanYear, year } = formatRomanDateLabel(
                  e.editionDate,
                );
                return (
                  <li key={String(e.id)} className="py-10 max-md:py-7">
                    <Link
                      href={`/diary/newsletter/${e.slug}`}
                      className="group block"
                    >
                      <p className="font-[family-name:var(--font-ui)] text-[10px] font-semibold uppercase tracking-[3px] text-gold-text">
                        <span aria-hidden>{monthLabel}</span>{" "}
                        <abbr title={String(year)}>{romanYear}</abbr>
                        {e.postsCount > 0 ? (
                          <>
                            {" · "}
                            {e.postsCount} {e.postsCount === 1 ? "entry" : "entries"}
                          </>
                        ) : null}
                      </p>
                      <h2 className="mt-3 font-[family-name:var(--font-display)] text-[32px] font-medium leading-[1.2] text-ink group-hover:text-gold-text max-md:text-[24px]">
                        {e.subjectLine}
                      </h2>
                      {e.lead ? (
                        <p className="mt-3 max-w-[640px] font-[family-name:var(--font-body)] text-[17px] italic leading-[1.6] text-ink-soft">
                          {e.lead}
                        </p>
                      ) : null}
                      <p className="mt-5 font-[family-name:var(--font-ui)] text-[11px] font-semibold uppercase tracking-[1.6px] text-ink">
                        Read this edition <span aria-hidden>→</span>
                      </p>
                    </Link>
                  </li>
                );
              })}
            </ol>
          )}
        </div>
      </PageSection>
    </PageShell>
  );
}
