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
    <section className="relative min-h-[100svh] overflow-hidden bg-bone text-ink">
      {/* ── Layer 1: editorial pattern across the bone side ── */}
      <div
        aria-hidden
        className="absolute inset-0 max-lg:hidden"
        style={{
          background: [
            "repeating-linear-gradient(90deg, rgba(176,136,64,0.06) 0px, rgba(176,136,64,0.06) 1px, transparent 1px, transparent 72px)",
            "repeating-linear-gradient(0deg, rgba(10,27,51,0.03) 0px, rgba(10,27,51,0.03) 1px, transparent 1px, transparent 72px)",
          ].join(", "),
          WebkitMaskImage:
            "linear-gradient(90deg, #000 0%, #000 28%, transparent 50%)",
          maskImage:
            "linear-gradient(90deg, #000 0%, #000 28%, transparent 50%)",
        }}
      />

      {/* ── Layer 2: big editorial Roman numeral watermark ── */}
      <span
        aria-hidden
        className="pointer-events-none absolute -bottom-16 select-none font-[family-name:var(--font-display)] text-[clamp(240px,28vw,460px)] font-semibold leading-none tracking-[-0.04em] text-gold opacity-[0.07] max-lg:hidden"
        style={{ left: "3%" }}
      >
        MMXXVI
      </span>

      {/* ── Layer 3: photo anchored to the right ───────────── */}
      <div className="absolute inset-y-0 right-0 w-[62%] overflow-hidden max-lg:inset-x-0 max-lg:inset-y-auto max-lg:top-0 max-lg:h-[58svh] max-lg:w-full">
        <Image
          src="/hero.avif"
          alt="His Grace Archbishop Valerian M. Okeke with episcopal crozier"
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 62vw"
          quality={92}
          className="object-cover object-[center_18%] [filter:brightness(1.03)_contrast(1.04)_saturate(1.04)]"
        />
        {/* Fade bone into the photo on its left edge */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 w-[45%] max-lg:hidden"
          style={{
            background:
              "linear-gradient(90deg, var(--bone) 0%, rgba(247,244,238,0.92) 30%, rgba(247,244,238,0.55) 55%, rgba(247,244,238,0.2) 78%, transparent 100%)",
          }}
        />
      </div>

      <SiteHeader />

      {/* ── Layer 4: content ───────────────────────────────── */}
      <div className="relative z-10 flex min-h-[100svh] items-end px-14 pb-24 pt-40 max-lg:min-h-0 max-lg:bg-bone max-lg:pb-20 max-lg:pt-[58svh] max-md:px-6 max-md:pt-[55svh]">
        <div className="max-w-[560px]">
          <p className="mb-7 flex items-center gap-[18px] font-[family-name:var(--font-ui)] text-[11px] font-semibold uppercase tracking-[3px] text-gold-text max-md:mb-5">
            <span aria-hidden className="block h-px w-12 bg-gold" />
            His Grace · Most Reverend
          </p>
          <h1 className="mb-6 font-[family-name:var(--font-display)] text-[clamp(52px,5vw,88px)] font-medium leading-[0.98] tracking-[-0.02em] text-ink max-md:mb-5 max-md:text-[48px] max-md:leading-[1.05]">
            Valerian Maduka
            <br />
            <span className="italic font-normal text-gold">Okeke</span>
          </h1>
          <div aria-hidden className="mb-6 h-px w-16 bg-gold max-md:mb-5" />
          <p className="mb-10 max-w-[480px] font-[family-name:var(--font-display)] text-[20px] italic leading-[1.55] text-ink-soft max-md:mb-8 max-md:max-w-none max-md:text-[17px]">
            Metropolitan Archbishop of Onitsha · Servant of the Lord&apos;s
            vineyard since the year of Our Lord <Roman year={2003} />.
          </p>
          <div className="mb-14 flex items-center gap-4 max-md:mb-10 max-md:flex-col max-md:items-start max-md:gap-3.5">
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

          <div
            aria-label="Today in the liturgical calendar"
            className="flex items-center gap-3 border-t border-[color:var(--rule)] pt-6 font-[family-name:var(--font-ui)] text-[10px] font-semibold uppercase tracking-[2.4px] text-ink-soft"
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
        </div>
      </div>
    </section>
  );
}
