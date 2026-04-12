import type { Metadata } from "next";
import { PageSection, PageShell } from "@/components/shell/page-shell";
import { Roman } from "@/components/editorial";

export const metadata: Metadata = {
  title: "Pastoral Visits",
  description:
    "A timeline of pastoral visits by His Grace Most Rev. Valerian Maduka Okeke across the Archdiocese of Onitsha.",
};

const VISITS = [
  {
    year: 2026,
    month: "April",
    place: "Basilica of the Most Holy Trinity, Onitsha",
    purpose: "Easter Day Pontifical Mass",
  },
  {
    year: 2026,
    month: "March",
    place: "St Joseph's Seminary, Awka-Etiti",
    purpose: "Pastoral visit and seminarian formation",
  },
  {
    year: 2026,
    month: "March",
    place: "Our Lady's Secondary School, Nnobi",
    purpose: "Confirmation Mass",
  },
  {
    year: 2025,
    month: "December",
    place: "Christ the King Parish, Obosi",
    purpose: "Christmas Vigil Mass",
  },
  {
    year: 2025,
    month: "November",
    place: "St Mary's Parish, Ogbaru",
    purpose: "Parish anniversary and consecration of the new altar",
  },
  {
    year: 2025,
    month: "October",
    place: "Marian Grotto, Nteje",
    purpose: "Diocesan Marian Pilgrimage",
  },
];

export default function PastoralVisitsPage() {
  return (
    <PageShell
      eyebrow="The Ministry of Presence"
      title="Pastoral"
      titleAccent="Visits"
      lead="A chronicle of visitations, confirmations, consecrations, and the quiet rhythm of being among the people of God."
    >
      <PageSection>
        <div className="relative mx-auto max-w-[840px]">
          <div
            aria-hidden
            className="absolute left-[140px] top-0 h-full w-px bg-[color:var(--rule)] max-md:left-4"
          />
          <ol className="space-y-14">
            {VISITS.map((v, i) => (
              <li
                key={i}
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
                    {v.place}
                  </h2>
                  <p className="mt-2 text-[16px] leading-[1.55] text-ink-soft">
                    {v.purpose}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </PageSection>
    </PageShell>
  );
}
