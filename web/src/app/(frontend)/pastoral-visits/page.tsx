import type { Metadata } from "next";
import { PageSection, PageShell } from "@/components/shell/page-shell";
import { Roman } from "@/components/editorial";
import { getPastoralVisits } from "@/lib/visits";
import { getLang } from "@/lib/lang";
import { getDict } from "@/lib/i18n";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Pastoral Visits",
  description:
    "A timeline of pastoral visits by His Grace Most Rev. Valerian Maduka Okeke across the Archdiocese of Onitsha.",
};

export default async function PastoralVisitsPage() {
  const [visits, lang] = await Promise.all([getPastoralVisits(), getLang()]);
  const t = getDict(lang);

  return (
    <PageShell
      eyebrow={t.pages.pastoralVisits.eyebrow}
      title={t.pages.pastoralVisits.title}
      titleAccent={t.pages.pastoralVisits.titleAccent}
      lead={t.pages.pastoralVisits.lead}
    >
      <PageSection>
        {visits.length === 0 ? (
          <p className="mx-auto max-w-[640px] text-center font-[family-name:var(--font-display)] text-[20px] italic leading-[1.55] text-ink-soft">
            The chronicle is being prepared. Visits will appear here as they are
            recorded.
          </p>
        ) : (
          <div className="relative mx-auto max-w-[840px]">
            <div
              aria-hidden
              className="absolute left-[140px] top-0 h-full w-px bg-[color:var(--rule)] max-md:left-4"
            />
            <ol className="space-y-14">
              {visits.map((v) => (
                <li
                  key={v.id}
                  className="relative grid grid-cols-[140px_1fr] items-start gap-12 max-md:grid-cols-[40px_1fr] max-md:gap-5"
                >
                  <div className="text-right max-md:text-left">
                    <p className="font-[family-name:var(--font-display)] text-[26px] font-medium italic text-ink">
                      <Roman year={v.year} />
                    </p>
                    <p className="mt-1 font-[family-name:var(--font-ui)] text-[10px] font-semibold uppercase tracking-[2px] text-gold">
                      {v.month}
                    </p>
                  </div>
                  <div className="relative pl-10 max-md:pl-6">
                    <span
                      aria-hidden
                      className="absolute -left-[5px] top-2 h-2.5 w-2.5 rounded-full bg-gold"
                    />
                    <h2 className="font-[family-name:var(--font-display)] text-[26px] font-medium leading-[1.2] text-ink">
                      {v.title}
                    </h2>
                    {v.parish ? (
                      <p className="mt-1 font-[family-name:var(--font-ui)] text-[11px] font-semibold uppercase tracking-[2px] text-ink-soft">
                        {v.parish}
                        {v.deanery ? ` · ${v.deanery}` : null}
                      </p>
                    ) : null}
                    {v.summary ? (
                      <p className="mt-2 text-[16px] leading-[1.55] text-ink-soft">
                        {v.summary}
                      </p>
                    ) : null}
                  </div>
                </li>
              ))}
            </ol>
          </div>
        )}
      </PageSection>
    </PageShell>
  );
}
