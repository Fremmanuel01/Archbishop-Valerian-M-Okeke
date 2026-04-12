import type { Metadata } from "next";
import { PageSection, PageShell } from "@/components/shell/page-shell";
import { Roman } from "@/components/editorial";
import { getProgrammeEntries, getProgrammeYear } from "@/lib/programme";
import type {
  ProgrammeCategory,
  ProgrammeEntry,
} from "@/data/pastoral-programme";
import {
  MONTH_NAMES,
  formatDayLabel,
  googleCalendarUrl,
  groupByMonth,
  monthRoman,
} from "@/data/pastoral-programme";

export const metadata: Metadata = {
  title: "Pastoral Diary",
  description:
    "The Pastoral Programme of His Grace Most Rev. Valerian Maduka Okeke — Archbishop of Onitsha.",
};

const CATEGORY_CLASS: Record<ProgrammeCategory, string> = {
  Mass: "border-gold bg-gold/10 text-gold",
  "Pastoral Visit": "border-ink bg-ink/5 text-ink",
  Meeting: "border-ink-soft bg-ink-soft/5 text-ink-soft",
  Ordination: "border-purple bg-purple/10 text-purple",
  Retreat: "border-ink-soft bg-transparent text-ink-soft",
  Special: "border-gold bg-transparent text-gold",
};

export default async function DiaryPage() {
  const [entries, year] = await Promise.all([
    getProgrammeEntries(),
    getProgrammeYear(),
  ]);
  const groups = groupByMonth(entries);

  return (
    <PageShell
      eyebrow="News & Diary"
      title="My Pastoral"
      titleAccent={
        <>
          Programme for <Roman year={year} />
        </>
      }
      lead="Masses, pastoral visits, ordinations, meetings, retreats, and the ordinary life of the Archdiocese — as it unfolds through the liturgical year."
    >
      <PageSection>
        <div className="relative mx-auto max-w-[960px]">
          <div
            aria-hidden
            className="absolute left-[200px] top-0 h-full w-px bg-[color:var(--rule)] max-md:left-[72px]"
          />
          <div className="space-y-20 max-md:space-y-14">
            {groups.map((group, i) => {
              const isNewYear =
                i === 0 || groups[i - 1].year !== group.year;
              return (
                <div key={`${group.year}-${group.monthIndex}`}>
                  {isNewYear ? <YearHeading year={group.year} /> : null}
                  <MonthBlock
                    monthIndex={group.monthIndex}
                    entries={group.entries}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </PageSection>
    </PageShell>
  );
}

function YearHeading({ year }: { year: number }) {
  return (
    <div className="mb-16 text-center max-md:mb-12">
      <p className="font-[family-name:var(--font-display)] text-[clamp(72px,10vw,140px)] font-medium italic leading-none text-gold opacity-40">
        <Roman year={year} arabic={false} />
      </p>
      <p className="mt-3 font-[family-name:var(--font-ui)] text-[11px] font-semibold uppercase tracking-[3px] text-ink-soft">
        Anno Domini {year}
      </p>
    </div>
  );
}

function MonthBlock({
  monthIndex,
  entries,
}: {
  monthIndex: number;
  entries: ProgrammeEntry[];
}) {
  const monthName = MONTH_NAMES[monthIndex];
  const roman = monthRoman(monthIndex);
  return (
    <section aria-labelledby={`month-${monthIndex}-${entries[0]?.start}`}>
      <div className="grid grid-cols-[200px_1fr] items-start gap-10 max-md:grid-cols-[72px_1fr] max-md:gap-6">
        <div className="sticky top-6 text-right max-md:text-left">
          <p
            id={`month-${monthIndex}-${entries[0]?.start}`}
            className="font-[family-name:var(--font-display)] text-[56px] font-medium italic leading-none text-gold max-md:text-[34px]"
          >
            {roman}
          </p>
          <p className="mt-2 font-[family-name:var(--font-ui)] text-[10px] font-semibold uppercase tracking-[2px] text-ink-soft max-md:text-[9px]">
            {monthName}
          </p>
        </div>

        <ol className="space-y-10 max-md:space-y-8">
          {entries.map((entry) => (
            <li key={entry.id} className="relative pl-12 max-md:pl-8">
              <span
                aria-hidden
                className="absolute -left-[5px] top-3 h-2.5 w-2.5 rounded-full bg-gold"
              />
              <EntryCard entry={entry} />
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function EntryCard({ entry }: { entry: ProgrammeEntry }) {
  const day = formatDayLabel(entry);
  return (
    <article className="border-b border-[color:var(--rule)] pb-10 last:border-b-0">
      <p className="font-[family-name:var(--font-ui)] text-[10px] font-semibold uppercase tracking-[2px] text-gold">
        <time dateTime={entry.start}>
          {day} {MONTH_NAMES[Number(entry.start.slice(5, 7)) - 1]}
        </time>
      </p>
      <h3 className="mt-2 font-[family-name:var(--font-display)] text-[26px] font-medium leading-[1.2] text-ink max-md:text-[22px]">
        {entry.title}
      </h3>
      {entry.location ? (
        <p className="mt-2 flex items-start gap-2 font-[family-name:var(--font-body)] text-[15px] italic text-ink-soft">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            aria-hidden
            className="mt-1 h-4 w-4 flex-shrink-0 text-gold"
          >
            <path d="M12 21s-7-6.2-7-12a7 7 0 1 1 14 0c0 5.8-7 12-7 12z" />
            <circle cx="12" cy="9" r="2.5" />
          </svg>
          {entry.location}
        </p>
      ) : null}
      {entry.description ? (
        <p className="mt-3 max-w-[560px] text-[16px] leading-[1.6] text-ink-soft">
          {entry.description}
        </p>
      ) : null}
      <div className="mt-5 flex flex-wrap items-center gap-3">
        <CategoryPill category={entry.category} />
        <a
          href={googleCalendarUrl(entry)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 border border-[color:var(--rule)] bg-bone px-4 py-2 font-[family-name:var(--font-ui)] text-[10px] font-semibold uppercase tracking-[1.6px] text-ink transition-colors hover:border-gold hover:text-gold"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            aria-hidden
            className="h-[14px] w-[14px]"
          >
            <rect x="3" y="5" width="18" height="16" rx="1" />
            <path d="M3 10h18M8 3v4M16 3v4" />
          </svg>
          Add to Calendar
        </a>
      </div>
    </article>
  );
}

function CategoryPill({ category }: { category: ProgrammeCategory }) {
  return (
    <span
      className={`inline-flex items-center border px-3 py-1.5 font-[family-name:var(--font-ui)] text-[9px] font-semibold uppercase tracking-[1.8px] ${CATEGORY_CLASS[category]}`}
    >
      {category}
    </span>
  );
}
