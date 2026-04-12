import type { Metadata } from "next";
import { PageSection, PageShell } from "@/components/shell/page-shell";
import { FleuronDivider, Latin, SectionLabel } from "@/components/editorial";

export const metadata: Metadata = {
  title: "His Episcopacy",
  description:
    "The missionary apostolate of the Archdiocese of Onitsha under the episcopate of His Grace Most Rev. Valerian Maduka Okeke — evangelisation, prison apostolate, riverine ministry, and education.",
};

type Stat = { figure: string; label: string };

const STATS: Stat[] = [
  { figure: "498", label: "Diocesan and religious priests" },
  { figure: "718", label: "Religious men and women" },
  { figure: "2,185,561", label: "Catholic faithful" },
  { figure: "412", label: "Shanahan University scholarships awarded" },
];

type Apostolate = {
  eyebrow: string;
  title: string;
  scripture?: string;
  paragraphs: string[];
};

const APOSTOLATES: Apostolate[] = [
  {
    eyebrow: "Shanahan University Onitsha",
    title: "Education as Mission",
    paragraphs: [
      "Every year, the Mission Cooperation Plan of the Archdiocese makes an increasing impact — more lives touched, more lives transformed. In 2024 the Archdiocese embarked on a new venture with the establishment of Shanahan University, an institution designed to foster positive change both locally and internationally.",
      "In its first cohort the University proudly awarded full scholarships to over four hundred and twelve meritorious students, equipping them with the tools to thrive in a rapidly changing world and extending the Archdiocese's commitment to education among vulnerable populations.",
    ],
  },
  {
    eyebrow: "The Prison Apostolate",
    title: "\u201CI was in prison and you came to visit me\u201D",
    scripture: "Matthew XXV:36",
    paragraphs: [
      "In response to the Lord's call, the Archdiocese has embraced the prison apostolate as a central work of mercy. Each year His Grace personally celebrates his birthday, Christmas, and Easter within the walls of Onitsha Prison — turning these occasions into memorable events for the inmates. During these celebrations the Archdiocese provides a variety of foodstuffs to sustain the prisoners for days.",
      "Beyond these annual visits, the Archdiocese has transformed Onitsha Prison by establishing an ultra-modern Mega Skill Acquisition Centre. Equipped with computers, tailoring machines, and carpentry tools, the centre empowers inmates with practical skills that will serve them well upon their release. The Archdiocese has further improved the prison's infrastructure by sinking boreholes, renovating cells, tiling floors, painting walls, and upgrading the water system with overhead tanks — a benefit not only to the inmates but to the surrounding community.",
    ],
  },
  {
    eyebrow: "The Riverine Apostolate",
    title: "Grass-root Evangelisation in Difficult Mission Grounds",
    paragraphs: [
      "The Archdiocese faithfully carries out its primary mission of evangelisation by reaching out to communities in the riverine areas — regions that often face challenging conditions such as flood disasters and extreme weather. Every Sunday, during the Archbishop's pastoral visits, special attention is given to rural parishes in these mission grounds. In times of hardship, when community members are displaced or in need, the Archdiocese steps in to provide care, ensuring their welfare and well-being.",
      "In these vulnerable areas, the Archdiocese offers free education and scholarships to all children and supports the community by paying the salaries of local staff. This commitment reflects an ongoing dedication to nurturing the spiritual and material well-being of every child and family in the region.",
    ],
  },
];

const COORDINATORS = [
  {
    name: "Rev. Fr. Ignatius Okonkwo",
    role: "Mission Coordinator",
    phone: "+1 (269) 267-1278",
  },
  {
    name: "Rev. Fr. Patrick Okonkwo",
    role: "Assistant Mission Coordinator",
    phone: "+1 (320) 583-0423",
  },
  {
    name: "Rev. Fr. Vincent Obi",
    role: "Mission Office",
    phone: "+1 (618) 384-1650",
  },
];

export default function HisEpiscopacyPage() {
  return (
    <PageShell
      eyebrow="The Missionary Apostolate"
      title="His"
      titleAccent="Episcopacy"
      lead="The Catholic Archdiocese of Onitsha embraces the fundamental understanding that the Church is missionary by nature — as affirmed in Ad Gentes — and carries the Gospel across borders and cultures under the motto Ut Vitam Habeant."
    >
      {/* ── Opening statement ─────────────────────────── */}
      <PageSection>
        <div className="grid grid-cols-[1.2fr_1fr] items-start gap-20 max-lg:grid-cols-1 max-lg:gap-14">
          <div className="space-y-7 font-[family-name:var(--font-body)] text-[19px] leading-[1.8] text-ink">
            <p className="first-letter:float-left first-letter:mr-3 first-letter:font-[family-name:var(--font-display)] first-letter:text-[88px] first-letter:font-medium first-letter:leading-[0.85] first-letter:text-gold">
              Guided by the pastoral motto of His Grace — &ldquo;
              <Latin>Ut Vitam Habeant</Latin>&rdquo;, that they may have life
              (John X:10) — the Archdiocese of Onitsha is committed to
              fulfilling the mission of spreading the Gospel with truth and
              conviction, reaching across borders and cultures to bring the
              message of Christ&apos;s love and salvation to all people.
            </p>
            <p>
              The Archdiocese is home to a vibrant community of the faithful,
              ministered to by a presbyterate of diocesan and religious
              priests and by religious men and women living the consecrated
              life. In a unique economic and social context, the mission of
              the local Church is both a challenge and a call to bear
              authentic, practical, and life-changing witness to Jesus
              Christ.
            </p>
            <p>
              Its efforts span the vital works of catechesis, feeding the
              hungry, providing medical services, and ensuring quality
              education for youth — particularly among vulnerable
              populations. God&apos;s blessings are evident in the growing
              number of young men and women embracing priestly and religious
              vocations, and many of the Archdiocesan priests are pursuing
              further studies abroad, enriching the presbyterate with fresh
              ministerial insights.
            </p>
          </div>

          <aside className="space-y-10 border-l border-[color:var(--rule)] pl-10 max-lg:border-l-0 max-lg:border-t max-lg:pl-0 max-lg:pt-8">
            <h2 className="font-[family-name:var(--font-ui)] text-[10px] font-semibold uppercase tracking-[3px] text-gold-text">
              The Archdiocese in Numbers
            </h2>
            <dl className="space-y-8">
              {STATS.map((stat) => (
                <div key={stat.label}>
                  <dt className="font-[family-name:var(--font-display)] text-[48px] font-medium leading-none text-ink max-md:text-[40px]">
                    {stat.figure}
                  </dt>
                  <dd className="mt-2 text-[15px] leading-[1.5] text-ink-soft">
                    {stat.label}
                  </dd>
                </div>
              ))}
            </dl>
            <p className="pt-4 text-[12px] italic leading-[1.5] text-ink-soft opacity-70">
              Figures as published by the Archdiocese of Onitsha Mission
              Office. Current approximate totals — updated periodically.
            </p>
          </aside>
        </div>
      </PageSection>

      {/* ── Apostolates ────────────────────────────────── */}
      {APOSTOLATES.map((apostolate, i) => (
        <PageSection
          key={apostolate.eyebrow}
          className={
            i % 2 === 0
              ? "border-t border-[color:var(--rule)] bg-bone-deep"
              : "border-t border-[color:var(--rule)]"
          }
        >
          <div className="grid grid-cols-[1fr_2fr] items-start gap-20 max-lg:grid-cols-1 max-lg:gap-10">
            <div>
              <SectionLabel>{apostolate.eyebrow}</SectionLabel>
              <h2 className="mt-6 font-[family-name:var(--font-display)] text-[clamp(40px,4.5vw,64px)] font-medium leading-[1.1] tracking-[-0.015em] text-ink">
                {apostolate.title}
              </h2>
              {apostolate.scripture ? (
                <p className="mt-4 font-[family-name:var(--font-ui)] text-[10px] font-semibold uppercase tracking-[2.4px] text-gold">
                  {apostolate.scripture}
                </p>
              ) : null}
            </div>
            <div className="space-y-6 font-[family-name:var(--font-body)] text-[18px] leading-[1.75] text-ink">
              {apostolate.paragraphs.map((p, idx) => (
                <p key={idx}>{p}</p>
              ))}
            </div>
          </div>
        </PageSection>
      ))}

      {/* ── Call to action ─────────────────────────────── */}
      <PageSection className="border-t border-[color:var(--rule)] bg-bone">
        <FleuronDivider className="mx-auto mb-16 max-w-[420px]" />
        <div className="mx-auto max-w-[820px] text-center">
          <SectionLabel className="justify-center">
            Spreading Faith & Building Bridges
          </SectionLabel>
          <p className="mt-8 font-[family-name:var(--font-display)] text-[clamp(32px,3.5vw,48px)] font-medium italic leading-[1.2] text-ink">
            We extend an invitation for your generous support and cooperation
            in advancing this divine mission.
          </p>
          <p className="mt-6 max-w-[620px] mx-auto text-[17px] leading-[1.7] text-ink-soft">
            Together, let us proclaim the Gospel, serve the vulnerable, and
            spread the light of Christ&apos;s love to the ends of the earth —
            sharing the fruits of our labour with dioceses in Nigeria,
            Africa, Europe, Asia, and the United States.
          </p>
        </div>
      </PageSection>

      {/* ── Contact the Mission Office ─────────────────── */}
      <PageSection className="border-t border-[color:var(--rule)] bg-bone-deep">
        <SectionLabel>Contact the Mission Office</SectionLabel>
        <h2 className="mt-6 font-[family-name:var(--font-display)] text-[clamp(36px,4vw,56px)] font-medium leading-[1.1] text-ink">
          Mission Coordinators
        </h2>

        <div className="mt-14 grid grid-cols-3 gap-10 max-lg:grid-cols-1">
          {COORDINATORS.map((c) => (
            <article
              key={c.name}
              className="border border-[color:var(--rule)] bg-bone p-10"
            >
              <p className="font-[family-name:var(--font-ui)] text-[10px] font-semibold uppercase tracking-[2.4px] text-gold">
                {c.role}
              </p>
              <h3 className="mt-4 font-[family-name:var(--font-display)] text-[26px] font-medium leading-[1.2] text-ink">
                {c.name}
              </h3>
              <p className="mt-5 font-[family-name:var(--font-body)] text-[18px] text-ink">
                <a
                  href={`tel:${c.phone.replace(/[^+\d]/g, "")}`}
                  className="hover:text-gold"
                >
                  {c.phone}
                </a>
              </p>
            </article>
          ))}
        </div>

        <div className="mt-14 border-t border-[color:var(--rule)] pt-10 font-[family-name:var(--font-body)] text-[17px] leading-[1.7] text-ink-soft">
          <p className="font-[family-name:var(--font-ui)] text-[10px] font-semibold uppercase tracking-[2.4px] text-gold">
            Mission Mailing Address
          </p>
          <p className="mt-3 font-[family-name:var(--font-display)] text-[22px] leading-[1.4] text-ink">
            20403 Encino Ledge, Suite 59193
            <br />
            San Antonio, Texas 78259
            <br />
            United States of America
          </p>
        </div>
      </PageSection>
    </PageShell>
  );
}
