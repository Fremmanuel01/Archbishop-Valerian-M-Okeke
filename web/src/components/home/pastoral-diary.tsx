import Image from "next/image";
import { Roman, SectionLabel } from "@/components/editorial";
import { getUpcomingEngagements, type DiaryEntry } from "@/lib/diary";

const TIMEZONE = "Africa/Lagos";

function formatDayMonth(iso: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "long",
    timeZone: TIMEZONE,
  }).format(d);
}

function yearOf(iso: string): number {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? new Date().getFullYear() : d.getFullYear();
}

export async function PastoralDiary() {
  const entries = await getUpcomingEngagements(3);
  if (entries.length === 0) return null;

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
          Upcoming <em className="italic text-gold">Engagements</em>
        </h2>
        <p className="max-w-[680px] font-[family-name:var(--font-display)] text-[22px] italic leading-[1.55] text-ink-soft">
          Coming soon among the people of God — Masses, pastoral visits,
          ordinations, and ministries scheduled across the Archdiocese.
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
            <div className="relative aspect-[4/5] w-full bg-stone max-lg:aspect-[4/3]">
              <Image
                src={entries[0]?.coverImageUrl ?? "/hero.avif"}
                alt={
                  entries[0]?.coverImageUrl
                    ? entries[0].title
                    : "His Grace during a recent pastoral visit"
                }
                fill
                sizes="(max-width: 1024px) 100vw, 560px"
                className="object-cover"
              />
            </div>
          </div>

          <div>
            {entries.map((entry: DiaryEntry) => (
              <article
                key={entry.id}
                className="border-b border-stone py-7 last:border-b-0"
              >
                <p className="mb-2 font-[family-name:var(--font-ui)] text-[10px] font-semibold uppercase tracking-[2px] text-gold">
                  <time dateTime={entry.date}>
                    {formatDayMonth(entry.date)} ·{" "}
                    <Roman year={yearOf(entry.date)} />
                  </time>
                  {entry.location ? (
                    <>
                      <span className="mx-2 opacity-50">·</span>
                      {entry.location}
                    </>
                  ) : null}
                </p>
                <h3 className="mb-2 font-[family-name:var(--font-display)] text-2xl font-medium leading-[1.3] text-ink">
                  {entry.title}
                </h3>
                {entry.excerpt ? (
                  <p className="text-[15px] leading-[1.6] text-ink-soft opacity-85">
                    {entry.excerpt}
                  </p>
                ) : null}
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
