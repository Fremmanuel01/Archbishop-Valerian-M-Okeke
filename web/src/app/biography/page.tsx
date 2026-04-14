import type { Metadata } from "next";
import { PageSection, PageShell } from "@/components/shell/page-shell";
import { FleuronDivider, Roman } from "@/components/editorial";
import { getPastoralLetters, yearOf } from "@/lib/cms";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Biography",
  description:
    "The life and ministry of His Grace Most Rev. Valerian Maduka Okeke, Metropolitan Archbishop of Onitsha.",
};

type Milestone = {
  year: number;
  heading: string;
  body: string;
};

const MILESTONES: Milestone[] = [
  {
    year: 1953,
    heading: "Born in Amesi",
    body: "Born on Tuesday, 20 October 1953 in Amesi, Aguata Local Government Area of Anambra State, Nigeria.",
  },
  {
    year: 1973,
    heading: "All Hallows' Seminary, Onitsha",
    body: "Completed secondary education at All Hallows' Seminary, Onitsha — his studies having been interrupted by the Nigerian Civil War (1967–1970).",
  },
  {
    year: 1981,
    heading: "Priestly Ordination",
    body: "Ordained to the Sacred Priesthood on Saturday, 11 July 1981 by Most Rev. (now Cardinal) Francis Arinze, then Archbishop of Onitsha.",
  },
  {
    year: 1991,
    heading: "Doctorate in Moral Theology",
    body: "Completed doctoral studies in Moral Theology at the Alfonsiana in Rome (1986–1991), also holding diplomas in Italian, French, German, and Journalism.",
  },
  {
    year: 1996,
    heading: "Rector, Bigard Memorial Seminary",
    body: "Appointed Rector of Bigard Memorial Seminary, Enugu (1996–2002), while continuing to teach Moral Theology and Ethics.",
  },
  {
    year: 2001,
    heading: "Appointed Coadjutor Archbishop",
    body: "Appointed Coadjutor Archbishop of Onitsha on Friday, 9 November 2001.",
  },
  {
    year: 2002,
    heading: "Episcopal Consecration",
    body: "Consecrated Coadjutor Archbishop of Onitsha on Saturday, 9 February 2002 by then Apostolic Nuncio to Nigeria, Archbishop Osbaldo Padilla.",
  },
  {
    year: 2003,
    heading: "Metropolitan Archbishop of Onitsha",
    body: "Took over the Metropolitan See of Onitsha on Monday, 1 September 2003.",
  },
];

// Historical pastoral letters not yet in the CMS. Remove as they are added.
const LEGACY_LETTERS: Array<{ year: number; title: string }> = [
  { year: 2004, title: "That They May Have Life" },
  { year: 2005, title: "The Measure of Love" },
  { year: 2005, title: "Our Glorious Heritage" },
  { year: 2006, title: "If Only You Have Faith" },
  { year: 2006, title: "Go Make Disciples of All Nations" },
  { year: 2007, title: "You and the Common Good" },
  { year: 2008, title: "The Family and Human Life" },
  { year: 2009, title: "Our Greatest Legacy" },
  { year: 2010, title: "The Splendour of Prayer" },
  { year: 2011, title: "Gratitude" },
  { year: 2012, title: "The Dignity of Labour" },
  { year: 2013, title: "Living Hope" },
  { year: 2014, title: "Catholic Education and National Development" },
  { year: 2015, title: "Democracy and Christian Values" },
  { year: 2016, title: "Blessed Are the Merciful" },
  { year: 2017, title: "Blessed Are the Peacemakers" },
  { year: 2018, title: "Mary Our Mother" },
  { year: 2019, title: "The Holy Eucharist: Our Strength" },
  { year: 2020, title: "The Sacraments: Our Treasure" },
  { year: 2021, title: "The Priesthood: Gift and Sacrifice" },
  { year: 2022, title: "The Holy Spirit: Man's Helper and Friend" },
];

export default async function BiographyPage() {
  const cmsLetters = await getPastoralLetters();
  const cmsEntries = cmsLetters
    .map((l) => ({ year: yearOf(l.date) ?? 0, title: l.title }))
    .filter((l) => l.year > 0);
  const seenYearTitles = new Set(
    cmsEntries.map((l) => `${l.year}-${l.title.toLowerCase()}`),
  );
  const legacyEntries = LEGACY_LETTERS.filter(
    (l) => !seenYearTitles.has(`${l.year}-${l.title.toLowerCase()}`),
  );
  const allLetters = [...cmsEntries, ...legacyEntries].sort(
    (a, b) => a.year - b.year,
  );

  return (
    <PageShell
      eyebrow="About His Grace"
      title="A Life in the"
      titleAccent="Lord's Vineyard"
      lead="Shepherd, teacher, and servant of the Church of Onitsha — a ministry formed by scripture, prayer, and the lived faith of his people."
      heroPortrait={{
        src: "/archbishop-portrait.jpg",
        alt: "His Grace Most Rev. Valerian Maduka Okeke",
      }}
    >
      <PageSection>
        <div className="grid grid-cols-[2fr_1fr] gap-20 max-lg:grid-cols-1 max-lg:gap-14">
          <div className="space-y-7 font-[family-name:var(--font-body)] text-[19px] leading-[1.75] text-ink">
            <p className="first-letter:float-left first-letter:mr-3 first-letter:font-[family-name:var(--font-display)] first-letter:text-[88px] first-letter:font-medium first-letter:leading-[0.85] first-letter:text-gold">
              His Grace Most Reverend Valerian Maduka Okeke is the fifth
              Metropolitan Archbishop of Onitsha, one of the oldest and most
              venerable local Churches in Nigeria. Born on the twentieth day
              of October in the year of Our Lord <Roman year={1953} /> in
              Amesi, Aguata Local Government Area of Anambra State, his life
              and ministry have been shaped by a deep love for the Eucharist
              and for the faithful of the Church.
            </p>
            <p>
              His early education began at St. Anthony&apos;s Catholic School,
              Umudioka, and St. Gabriel&apos;s Catholic School, Ifitedunu
              (1959–1966). Secondary schooling at Christ the King College,
              Onitsha was interrupted by the Nigerian Civil War. Through the
              inspiration of then Monsignor Emmanuel Otteh — later Emeritus
              Bishop of Issele-Uku — he continued his studies at All
              Hallows&apos; Seminary, Onitsha.
            </p>
            <p>
              He pursued Philosophical Studies (1975–1977) and Theological
              Studies (1977–1981) at Bigard Memorial Seminary, Enugu and Ikot
              Ekpene respectively. He was ordained to the Sacred Priesthood on
              11 July <Roman year={1981} /> by Most Rev. (now Cardinal)
              Francis Arinze, then Archbishop of Onitsha, and served as
              Assistant Priest of Holy Trinity Cathedral, Onitsha (1981–1982)
              and Parish Priest of Umuoji (1983–1986).
            </p>
            <p>
              From 1986 to 1991 he pursued further studies at the Alfonsiana
              in Rome, where he earned a doctorate in Moral Theology. He also
              holds diplomas in Italian, French, and German, as well as a
              Diploma in Journalism. On his return he taught Moral Theology
              and Ethics at Bigard Memorial Seminary, Enugu, and served as
              its Rector from 1996 until his episcopal appointment.
            </p>
            <p>
              Appointed Coadjutor Archbishop of Onitsha on 9 November{" "}
              <Roman year={2001} />, he was consecrated on 9 February{" "}
              <Roman year={2002} /> by the Apostolic Nuncio to Nigeria,
              Archbishop Osbaldo Padilla. He took over the Metropolitan See
              of Onitsha on 1 September <Roman year={2003} />, and has since
              led the Archdiocese with a pastoral ministry marked by annual
              pastoral letters, renewed emphasis on vocations, catechesis,
              and the dignity of the family.
            </p>
          </div>

          <aside className="space-y-7 border-l border-[color:var(--rule)] pl-10 max-lg:border-l-0 max-lg:border-t max-lg:pl-0 max-lg:pt-8">
            <h2 className="font-[family-name:var(--font-ui)] text-[10px] font-semibold uppercase tracking-[3px] text-gold">
              Key Milestones
            </h2>
            <ol className="space-y-7">
              {MILESTONES.map((m) => (
                <li key={`${m.year}-${m.heading}`}>
                  <p className="font-[family-name:var(--font-display)] text-[26px] font-medium italic text-ink">
                    <Roman year={m.year} arabic={false} />
                    <span className="ml-2 font-[family-name:var(--font-ui)] text-[11px] font-semibold not-italic tracking-[1.5px] text-ink-soft opacity-70">
                      {m.year}
                    </span>
                  </p>
                  <p className="mt-1 font-[family-name:var(--font-display)] text-lg font-medium text-ink">
                    {m.heading}
                  </p>
                  <p className="mt-1 text-[15px] leading-[1.6] text-ink-soft">
                    {m.body}
                  </p>
                </li>
              ))}
            </ol>
          </aside>
        </div>
      </PageSection>

      <PageSection className="border-t border-[color:var(--rule)] bg-bone-deep">
        <FleuronDivider className="mx-auto mb-16 max-w-[420px]" />
        <h2 className="font-[family-name:var(--font-ui)] text-[10px] font-semibold uppercase tracking-[3px] text-gold-text">
          Pastoral Letters
        </h2>
        <p className="mt-6 font-[family-name:var(--font-display)] text-[clamp(36px,4vw,56px)] font-medium leading-[1.1] text-ink">
          A letter each year, since <Roman year={2004} />.
        </p>
        <p className="mt-4 max-w-[640px] font-[family-name:var(--font-display)] text-[20px] italic leading-[1.55] text-ink-soft">
          His Grace has written a pastoral letter every year of his
          episcopate, addressing the faithful on the virtues, the sacraments,
          marriage, and the pressing questions of Christian life.
        </p>
        <ul className="mt-14 grid grid-cols-3 gap-x-12 gap-y-6 max-lg:grid-cols-2 max-md:grid-cols-1">
          {allLetters.map((l) => (
            <li
              key={`${l.year}-${l.title}`}
              className="flex items-baseline gap-6 border-b border-[color:var(--rule)] pb-4 font-[family-name:var(--font-body)]"
            >
              <span className="font-[family-name:var(--font-display)] text-[22px] italic text-gold">
                <Roman year={l.year} />
              </span>
              <span className="text-[17px] leading-[1.4] text-ink">
                {l.title}
              </span>
            </li>
          ))}
        </ul>
      </PageSection>
    </PageShell>
  );
}
