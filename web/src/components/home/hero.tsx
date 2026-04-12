import Image from "next/image";
import Link from "next/link";
import { Roman } from "@/components/editorial";
import { SiteHeader } from "./site-header";

export function Hero() {
  return (
    <section className="relative h-[100svh] min-h-[720px] w-full overflow-hidden text-white">
      <Image
        src="/hero.png"
        alt="His Grace Archbishop Valerian M. Okeke elevating the Book of Gospels"
        fill
        priority
        sizes="100vw"
        quality={90}
        className="scale-[1.02] object-cover object-[center_30%] [filter:brightness(1)_contrast(1.05)_saturate(1.08)]"
      />

      <SiteHeader />

      <div className="absolute inset-x-14 bottom-20 max-w-[920px] max-lg:inset-x-8 max-md:inset-x-6 max-md:bottom-36">
        <p className="mb-7 flex items-center gap-[18px] font-[family-name:var(--font-ui)] text-[11px] uppercase tracking-[3px] text-gold-soft max-md:mb-5">
          <span aria-hidden className="block h-px w-12 bg-gold-soft" />
          His Grace · Most Reverend
        </p>
        <h1 className="mb-6 font-[family-name:var(--font-display)] text-[clamp(44px,6vw,112px)] font-medium leading-[1] tracking-[-0.02em] max-md:mb-5 max-md:leading-[1.05]">
          Valerian Maduka
          <br />
          <span className="italic font-normal text-gold-soft">Okeke</span>
        </h1>
        <p className="mb-10 max-w-[580px] font-[family-name:var(--font-display)] text-[22px] italic leading-[1.5] opacity-90 max-md:mb-7 max-md:max-w-none max-md:text-lg">
          Metropolitan Archbishop of Onitsha · Servant of the Lord&apos;s
          vineyard since the year of Our Lord <Roman year={2003} />.
        </p>
        <div className="flex items-center gap-4 max-md:flex-col max-md:items-start max-md:gap-3.5">
          <Link
            href="/pastoral-letters/on-virtues-and-capital-sins"
            className="inline-flex min-h-12 items-center gap-3 bg-gold-soft px-8 py-4 font-[family-name:var(--font-ui)] text-[11px] font-semibold uppercase tracking-[2px] text-ink transition-colors hover:bg-white focus-visible:bg-white"
          >
            Read the Pastoral Letter →
          </Link>
          <Link
            href="/biography"
            className="inline-flex min-h-11 items-center gap-2.5 border-b border-white/40 px-0.5 pb-1.5 font-[family-name:var(--font-ui)] text-[11px] font-medium uppercase tracking-[2px] text-white transition-colors hover:border-gold-soft hover:text-gold-soft focus-visible:border-gold-soft focus-visible:text-gold-soft"
          >
            Meet His Grace
          </Link>
        </div>
      </div>

      <div
        aria-label="Today in the liturgical calendar"
        className="absolute bottom-20 right-14 border-l border-gold-soft pl-[18px] text-right font-[family-name:var(--font-ui)] text-[10px] uppercase tracking-[2px] opacity-80 max-lg:right-8 max-md:left-6 max-md:right-auto max-md:bottom-8 max-md:border-l-0 max-md:border-t max-md:pl-0 max-md:pt-3.5 max-md:text-left"
      >
        <strong className="mb-1.5 block font-[family-name:var(--font-display)] text-base font-medium italic normal-case tracking-normal text-gold-soft">
          Easter Tuesday
        </strong>
        <Roman year={2} /> Week of Easter · <Roman year={2026} />
      </div>
    </section>
  );
}
