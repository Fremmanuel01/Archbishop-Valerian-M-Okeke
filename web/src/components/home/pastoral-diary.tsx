import Image from "next/image";
import { Roman, SectionLabel } from "@/components/editorial";

type Entry = {
  date: string;
  iso: string;
  year: number;
  title: string;
  summary: string;
};

const ENTRIES: Entry[] = [
  {
    date: "06 April",
    iso: "2026-04-06",
    year: 2026,
    title: "Easter Day Sermon at the Basilica of the Most Holy Trinity",
    summary:
      "The Risen Christ is not a memory we visit but a Presence we receive.",
  },
  {
    date: "28 March",
    iso: "2026-03-28",
    year: 2026,
    title: "Pastoral Visit to St Joseph's Seminary, Awka-Etiti",
    summary:
      "An afternoon of formation, prayer, and counsel with the seminarians.",
  },
  {
    date: "14 March",
    iso: "2026-03-14",
    year: 2026,
    title: "Confirmation Mass at Our Lady's Secondary School, Nnobi",
    summary:
      "Sealed with the gift of the Spirit, eighty-four young women received Confirmation.",
  },
];

export function PastoralDiary() {
  return (
    <section
      id="diary"
      aria-labelledby="diary-title"
      className="bg-bone-deep px-14 py-[140px] max-lg:px-8 max-md:px-6 max-md:py-24"
    >
      <div className="mx-auto max-w-[1240px]">
        <SectionLabel>Pastoral Diary</SectionLabel>
        <h2
          id="diary-title"
          className="mb-4 mt-6 font-[family-name:var(--font-display)] text-[clamp(40px,4.5vw,72px)] font-medium leading-[1.05] tracking-[-0.015em]"
        >
          Recent <em className="italic text-gold">Engagements</em>
        </h2>
        <p className="max-w-[680px] font-[family-name:var(--font-display)] text-[22px] italic leading-[1.55] text-ink-soft">
          Among the people of God — homilies, pastoral visits, ordinations, and
          ministries across the Archdiocese.
        </p>

        <div className="mt-20 grid grid-cols-2 items-center gap-20 max-lg:grid-cols-1 max-lg:gap-12 max-lg:mt-14">
          <div className="relative border border-[color:var(--rule)] bg-bone p-[18px]">
            <span
              aria-hidden
              className="absolute -left-px -top-px h-7 w-7 border-l-2 border-t-2 border-gold"
            />
            <span
              aria-hidden
              className="absolute -bottom-px -right-px h-7 w-7 border-b-2 border-r-2 border-gold"
            />
            <div className="relative aspect-[4/5] w-full bg-stone max-lg:aspect-[3/2]">
              <Image
                src="/hero.avif"
                alt="His Grace during a recent pastoral visit"
                fill
                sizes="(max-width: 1024px) 100vw, 560px"
                className="object-cover"
              />
            </div>
          </div>

          <div>
            {ENTRIES.map((entry) => (
              <article
                key={entry.iso}
                className="border-b border-stone py-7 last:border-b-0"
              >
                <p className="mb-2 font-[family-name:var(--font-ui)] text-[10px] font-semibold uppercase tracking-[2px] text-gold">
                  <time dateTime={entry.iso}>
                    {entry.date} · <Roman year={entry.year} />
                  </time>
                </p>
                <h3 className="mb-2 font-[family-name:var(--font-display)] text-2xl font-medium leading-[1.3] text-ink">
                  {entry.title}
                </h3>
                <p className="text-[15px] leading-[1.6] text-ink-soft opacity-85">
                  {entry.summary}
                </p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
