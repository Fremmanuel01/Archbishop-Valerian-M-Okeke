import type { Metadata } from "next";
import Link from "next/link";
import { PageSection, PageShell } from "@/components/shell/page-shell";
import { EmptyState, Roman } from "@/components/editorial";
import { getHomilies, slugify, yearOf } from "@/lib/cms";

export const metadata: Metadata = {
  title: "Reflections & Homilies",
  description:
    "Homilies and spiritual reflections of His Grace Most Rev. Valerian Maduka Okeke.",
};

export const revalidate = 3600;

export default async function ReflectionsPage() {
  const homilies = await getHomilies();
  const sorted = [...homilies].sort((a, b) => {
    if (!a.date) return 1;
    if (!b.date) return -1;
    return a.date < b.date ? 1 : -1;
  });

  return (
    <PageShell
      eyebrow="Homilies & Reflections"
      title="Spoken from the"
      titleAccent="Cathedra"
      lead="Homilies preached at solemnities, feasts, pastoral visits, and ordinary time — gathered for meditation and study."
    >
      <PageSection>
        {sorted.length === 0 ? (
          <EmptyState
            title="Homilies will return shortly"
            body="The reflections archive is briefly unavailable. Please check back in a few minutes."
          />
        ) : (
        <ul className="divide-y divide-[color:var(--rule)] border-y border-[color:var(--rule)]">
          {sorted.map((h) => {
            const year = yearOf(h.date);
            const slug = `${h.id}-${slugify(h.title)}`;
            return (
              <li key={h.id}>
                <Link
                  href={`/reflections/${slug}`}
                  className="group grid grid-cols-[220px_1fr_auto] items-start gap-12 py-12 max-lg:grid-cols-1 max-lg:gap-3 max-lg:py-9"
                >
                  <div>
                    {h.occasion ? (
                      <p className="font-[family-name:var(--font-ui)] text-[10px] font-semibold uppercase tracking-[2.4px] text-gold-text">
                        {h.occasion}
                      </p>
                    ) : null}
                    {year ? (
                      <p className="mt-2 font-[family-name:var(--font-display)] text-[26px] font-medium italic text-ink">
                        <time dateTime={h.date ?? undefined}>
                          <Roman year={year} />
                        </time>
                      </p>
                    ) : null}
                  </div>
                  <div>
                    <h2 className="font-[family-name:var(--font-display)] text-[32px] font-medium leading-[1.15] text-ink transition-colors group-hover:text-gold-text max-md:text-[24px]">
                      {h.title}
                    </h2>
                    {h.description ? (
                      <p className="mt-4 max-w-[680px] text-[17px] leading-[1.6] text-ink-soft">
                        {h.description}
                      </p>
                    ) : null}
                  </div>
                  <span className="mt-2 whitespace-nowrap border-b border-gold pb-1.5 font-[family-name:var(--font-ui)] text-[10px] font-semibold uppercase tracking-[2px] text-ink max-lg:justify-self-start">
                    Read →
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
        )}
      </PageSection>
    </PageShell>
  );
}
