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
    <section className="relative h-[100svh] min-h-[720px] w-full overflow-hidden text-ink">
      <Image
        src="/hero.avif"
        alt="His Grace Archbishop Valerian M. Okeke celebrating Holy Mass"
        fill
        priority
        sizes="100vw"
        quality={92}
        className="scale-[1.01] object-cover object-[center_30%] [filter:brightness(1.02)_contrast(1.02)_saturate(1.03)]"
      />

      {/* Scrim stack — warm bone wash with deliberate bottom-left anchor */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background: `
            linear-gradient(180deg, rgba(247,244,238,0.78) 0%, rgba(247,244,238,0.45) 12%, transparent 28%),
            radial-gradient(ellipse 90% 100% at 16% 100%, rgba(247,244,238,0.95) 0%, rgba(247,244,238,0.8) 28%, rgba(247,244,238,0.4) 55%, transparent 78%),
            linear-gradient(0deg, rgba(247,244,238,0.65) 0%, rgba(247,244,238,0.2) 22%, transparent 48%)
          `,
        }}
      />

      <SiteHeader />

      <div className="absolute inset-x-14 bottom-24 max-w-[680px] max-lg:inset-x-8 max-lg:bottom-20 max-md:inset-x-6 max-md:bottom-32">
        <p className="mb-6 flex items-center gap-[18px] font-[family-name:var(--font-ui)] text-[11px] font-semibold uppercase tracking-[3px] text-gold-text max-md:mb-4">
          <span aria-hidden className="block h-px w-12 bg-gold" />
          His Grace · Most Reverend
        </p>
        <h1 className="mb-6 font-[family-name:var(--font-display)] text-[clamp(48px,5.5vw,96px)] font-medium leading-[0.98] tracking-[-0.02em] text-ink max-md:mb-5 max-md:text-[48px] max-md:leading-[1.05]">
          Valerian Maduka
          <br />
          <span className="italic font-normal text-gold">Okeke</span>
        </h1>
        <div aria-hidden className="mb-6 h-px w-16 bg-gold max-md:mb-5" />
        <p className="mb-9 max-w-[520px] font-[family-name:var(--font-display)] text-[20px] italic leading-[1.55] text-ink-soft max-md:mb-7 max-md:max-w-none max-md:text-[17px]">
          Metropolitan Archbishop of Onitsha · Servant of the Lord&apos;s
          vineyard since the year of Our Lord <Roman year={2003} />.
        </p>
        <div className="flex items-center gap-4 max-md:flex-col max-md:items-start max-md:gap-3.5">
          <Link
            href={latestHref}
            className="inline-flex min-h-12 items-center gap-3 bg-ink px-8 py-4 font-[family-name:var(--font-ui)] text-[11px] font-semibold uppercase tracking-[2px] text-white transition-colors hover:bg-ink-soft focus-visible:bg-ink-soft"
          >
            Read the Pastoral Letter →
          </Link>
          <Link
            href="/biography"
            className="inline-flex min-h-11 items-center gap-2.5 border-b border-ink/40 px-0.5 pb-1.5 font-[family-name:var(--font-ui)] text-[11px] font-medium uppercase tracking-[2px] text-ink transition-colors hover:border-gold hover:text-gold-text focus-visible:border-gold focus-visible:text-gold-text"
          >
            Meet His Grace
          </Link>
        </div>
      </div>

      <div
        aria-label="Today in the liturgical calendar"
        className="absolute bottom-10 right-14 inline-flex items-center gap-3 font-[family-name:var(--font-ui)] text-[10px] font-semibold uppercase tracking-[2.4px] text-ink/70 max-lg:right-8 max-md:hidden"
      >
        <span className="font-[family-name:var(--font-display)] text-[13px] italic normal-case tracking-normal text-gold-text">
          Easter Tuesday
        </span>
        <span aria-hidden className="block h-px w-8 bg-gold/60" />
        <span>
          <Roman year={2} arabic={false} /> Week of Easter ·{" "}
          <Roman year={2026} arabic={false} />
        </span>
      </div>
    </section>
  );
}
