import type { Metadata } from "next";
import { PageSection, PageShell } from "@/components/shell/page-shell";
import { EmptyState, Roman } from "@/components/editorial";
import { getAddressesAndInterviews, yearOf } from "@/lib/cms";

export const metadata: Metadata = {
  title: "Other Teachings",
  description:
    "Writings, addresses, and occasional teachings of His Grace Most Rev. Valerian Maduka Okeke.",
};

export const revalidate = 3600;

export default async function OtherTeachingsPage() {
  const writings = await getAddressesAndInterviews();
  const sorted = [...writings].sort((a, b) => {
    if (!a.date) return 1;
    if (!b.date) return -1;
    return a.date < b.date ? 1 : -1;
  });

  return (
    <PageShell
      eyebrow="Writings & Addresses"
      title="Other"
      titleAccent="Teachings"
      lead="Lectures, conference addresses, essays, and occasional writings beyond the formal pastoral letters."
    >
      <PageSection>
        {sorted.length === 0 ? (
          <EmptyState
            title="Writings will return shortly"
            body="The archive is briefly unavailable. Please check back in a few minutes."
          />
        ) : (
        <div className="grid grid-cols-2 gap-10 max-md:grid-cols-1">
          {sorted.map((w) => {
            const year = yearOf(w.date);
            return (
              <article
                key={w.id}
                className="group flex flex-col border border-[color:var(--rule)] bg-bone p-10 transition-colors hover:border-gold max-md:p-7"
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
                <h2 className="mt-4 font-[family-name:var(--font-display)] text-[28px] font-medium leading-[1.2] text-ink max-md:text-2xl">
                  {w.title}
                </h2>
                {w.occasion ? (
                  <p className="mt-3 font-[family-name:var(--font-display)] text-[17px] italic text-ink-soft">
                    {w.occasion}
                  </p>
                ) : null}
                {w.body ? (
                  <p className="mt-4 text-[16px] leading-[1.6] text-ink-soft">
                    {w.body}
                  </p>
                ) : null}
                {w.pdf_url ? (
                  <a
                    href={w.pdf_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6 inline-flex w-fit border-b border-gold pb-1.5 font-[family-name:var(--font-ui)] text-[10px] font-semibold uppercase tracking-[2px] text-ink"
                  >
                    Read in Full →
                  </a>
                ) : (
                  <p className="mt-6 font-[family-name:var(--font-ui)] text-[10px] font-semibold uppercase tracking-[2px] text-ink-soft opacity-60">
                    Coming Soon
                  </p>
                )}
              </article>
            );
          })}
        </div>
        )}
      </PageSection>
    </PageShell>
  );
}
