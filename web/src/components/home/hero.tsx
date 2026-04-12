import Image from "next/image";
import Link from "next/link";
import { Roman } from "@/components/editorial";
import { getPastoralLetters, slugify, yearOf } from "@/lib/cms";
import { SiteHeader } from "./site-header";

export async function Hero() {
  const letters = await getPastoralLetters();
  const latest = [...letters].sort((a, b) => {
    const ya = yearOf(a.date) ?? 0;
    const yb = yearOf(b.date) ?? 0;
    return yb - ya;
  })[0];
  const latestHref = latest
    ? `/pastoral-letters/${latest.id}-${slugify(latest.title)}`
    : "/pastoral-letters";
  return (
    <section className="relative h-[100svh] min-h-[720px] w-full overflow-hidden text-white">
      <Image
        src="/hero.avif"
        alt="His Grace Archbishop Valerian M. Okeke celebrating Holy Mass"
        fill
        priority
        sizes="100vw"
        quality={92}
        className="scale-[1.01] object-cover object-[center_30%] [filter:brightness(0.96)_contrast(1.06)_saturate(1.05)]"
      />

      {/* Scrim stack — deliberate darkness bottom-left for headline block */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background: `
            linear-gradient(180deg, rgba(10,27,51,0.55) 0%, rgba(10,27,51,0.25) 12%, transparent 26%),
            radial-gradient(ellipse 85% 95% at 18% 100%, rgba(10,27,51,0.9) 0%, rgba(10,27,51,0.6) 32%, rgba(10,27,51,0.2) 58%, transparent 78%),
            linear-gradient(0deg, rgba(10,27,51,0.45) 0%, rgba(10,27,51,0.12) 22%, transparent 45%)
          `,
        }}
      />

      <SiteHeader />

      <div className="absolute inset-x-14 bottom-24 max-w-[680px] max-lg:inset-x-8 max-lg:bottom-20 max-md:inset-x-6 max-md:bottom-32">
        <p className="mb-6 flex items-center gap-[18px] font-[family-name:var(--font-ui)] text-[11px] uppercase tracking-[3px] text-gold-soft max-md:mb-4">
          <span aria-hidden className="block h-px w-12 bg-gold-soft" />
          His Grace · Most Reverend
        </p>
        <h1 className="mb-6 font-[family-name:var(--font-display)] text-[clamp(48px,5.5vw,96px)] font-medium leading-[0.98] tracking-[-0.02em] max-md:mb-5 max-md:text-[48px] max-md:leading-[1.05]">
          Valerian Maduka
          <br />
          <span className="italic font-normal text-gold-soft">Okeke</span>
        </h1>
        <div
          aria-hidden
          className="mb-6 h-px w-16 bg-gold-soft/50 max-md:mb-5"
        />
        <p className="mb-9 max-w-[520px] font-[family-name:var(--font-display)] text-[20px] italic leading-[1.55] opacity-90 max-md:mb-7 max-md:max-w-none max-md:text-[17px]">
          Metropolitan Archbishop of Onitsha · Servant of the Lord&apos;s
          vineyard since the year of Our Lord <Roman year={2003} />.
        </p>
        <div className="flex items-center gap-4 max-md:flex-col max-md:items-start max-md:gap-3.5">
          <Link
            href={latestHref}
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
        className="absolute bottom-10 right-14 inline-flex items-center gap-3 font-[family-name:var(--font-ui)] text-[10px] uppercase tracking-[2.4px] text-white/70 max-lg:right-8 max-md:hidden"
      >
        <span className="font-[family-name:var(--font-display)] text-[13px] italic normal-case tracking-normal text-gold-soft">
          Easter Tuesday
        </span>
        <span aria-hidden className="block h-px w-8 bg-gold-soft/60" />
        <span>
          <Roman year={2} arabic={false} /> Week of Easter ·{" "}
          <Roman year={2026} arabic={false} />
        </span>
      </div>
    </section>
  );
}
