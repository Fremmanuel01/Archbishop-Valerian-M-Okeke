import type { Metadata } from "next";
import Image from "next/image";
import { PageSection, PageShell } from "@/components/shell/page-shell";
import { FleuronDivider, Latin } from "@/components/editorial";

export const metadata: Metadata = {
  title: "Coat of Arms",
  description:
    "Explanation of the coat of arms of His Grace Most Rev. Valerian Maduka Okeke, Archbishop of Onitsha.",
};

export default function CoatOfArmsPage() {
  return (
    <PageShell
      eyebrow="Heraldry & Symbol"
      title="The Coat of"
      titleAccent="Arms"
      lead="The Good Shepherd, the gospel of John, and the episcopal motto that has guided the ministry of His Grace."
    >
      <PageSection>
        <div className="grid grid-cols-[1fr_1.3fr] gap-20 max-lg:grid-cols-1 max-lg:gap-14">
          <div className="flex items-start justify-center">
            <Image
              src="/coat-of-arms.png"
              alt="Coat of Arms of His Grace Most Rev. Valerian Maduka Okeke"
              width={500}
              height={500}
              className="h-auto w-auto max-w-[360px] object-contain [filter:drop-shadow(0_30px_60px_rgba(10,27,51,0.15))]"
            />
          </div>

          <article className="space-y-7 font-[family-name:var(--font-body)] text-[19px] leading-[1.8] text-ink">
            <p className="font-[family-name:var(--font-ui)] text-[10px] font-semibold uppercase tracking-[2.4px] text-gold">
              Explanation of the Coat of Arms
            </p>
            <p className="first-letter:float-left first-letter:mr-3 first-letter:font-[family-name:var(--font-display)] first-letter:text-[88px] first-letter:font-medium first-letter:leading-[0.85] first-letter:text-gold">
              The Archbishop&apos;s coat of arms bears a striking image of
              Jesus the Good Shepherd in the shield. The image clearly
              presents Jesus as the Good Shepherd as graphically depicted in
              the Gospel of St. John, chapter 10. The Good Shepherd, according
              to Saint John, is one who truly cares for the sheep and is
              ready to surrender his life in place of his sheep.
            </p>
            <p>
              In other words, the shepherd carries with him the mission of
              giving life to the sheep. The Gospel of giving life is therefore
              central to the mission of Jesus Christ, our Redeemer. This
              mission is summarised in the Lord&apos;s own words — &ldquo;I
              came that they may have life in abundance.&rdquo; It is this
              statement that gave birth to the episcopal motto of the
              Archbishop — <Latin>Ut Vitam Habeant</Latin>.
            </p>

            <blockquote className="my-10 border-l-2 border-gold pl-7 font-[family-name:var(--font-display)] text-[28px] italic leading-[1.35] text-ink">
              &ldquo;Life is the most elementary yet the most fundamental and
              the basis of any other thing we do. This is truly so because
              life itself is God.&rdquo;
              <footer className="mt-4 font-[family-name:var(--font-ui)] text-[10px] font-semibold not-italic uppercase tracking-[2px] text-gold">
                That They May Have Life · Pastoral Letter · 2004
              </footer>
            </blockquote>

            <p>
              Sharing in the priesthood of Jesus, Archbishop Valerian Okeke
              desires to further the mission of Christ the eternal high
              priest. He recognises that life is the most elementary yet the
              most fundamental — the basis of everything else we do. Life
              itself is God (Jn 14:6); life comes from God (Jn 1:14); life has
              infinite value because it came from life itself (Gen 2:7).
            </p>
            <p>
              The Archbishop shares the conviction that if one is to live the
              abundance of life which Christ promised, one must desire to
              live like Christ. It is only to the extent that we actualise
              this modelling to Christ that we are living the life of Christ
              — the true Christian life, which ensures life in abundance.
              This Christ&apos;s life is life to the full; it is not partial
              life, it is life in abundance. Being life in abundance, no
              aspect of life is excluded from its sanctifying influence.
            </p>
          </article>
        </div>
      </PageSection>

      <PageSection className="border-t border-[color:var(--rule)] bg-bone-deep">
        <FleuronDivider className="mx-auto mb-16 max-w-[420px]" />
        <div className="mx-auto max-w-[820px] text-center">
          <p className="font-[family-name:var(--font-ui)] text-[10px] font-semibold uppercase tracking-[3px] text-gold">
            The Episcopal Motto
          </p>
          <p className="mt-8 font-[family-name:var(--font-display)] text-[clamp(48px,6vw,96px)] font-medium italic leading-[1.1] text-ink">
            <Latin>Ut Vitam Habeant</Latin>
          </p>
          <p className="mt-6 font-[family-name:var(--font-display)] text-[26px] italic text-ink-soft">
            — that they may have life, and have it more abundantly.
          </p>
          <p className="mt-4 font-[family-name:var(--font-ui)] text-[11px] font-semibold uppercase tracking-[2.4px] text-gold">
            John X:10
          </p>
        </div>
      </PageSection>
    </PageShell>
  );
}
