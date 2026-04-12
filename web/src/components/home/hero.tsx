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
      {/* ── Layer 1: full-bleed photo ──────────────────────── */}
      <Image
        src="/hero.avif"
        alt="His Grace Archbishop Valerian M. Okeke celebrating Holy Mass"
        fill
        priority
        sizes="100vw"
        quality={92}
        className="object-cover object-[center_20%] [filter:brightness(1.02)_contrast(1.04)_saturate(1.05)]"
      />

      {/* ── Layer 2: horizontal bone fade into photo ───────── */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(90deg, var(--bone) 0%, var(--bone) 34%, rgba(247,244,238,0.95) 44%, rgba(247,244,238,0.55) 56%, rgba(247,244,238,0.15) 68%, transparent 80%)",
        }}
      />

      {/* ── Layer 3: editorial pattern on the bone side ────── */}
      <div
        aria-hidden
        className="absolute inset-0 max-lg:hidden"
        style={{
          background: [
            // Vertical liturgical column rules
            "repeating-linear-gradient(90deg, rgba(176,136,64,0.055) 0px, rgba(176,136,64,0.055) 1px, transparent 1px, transparent 72px)",
            // Horizontal whisper rules
            "repeating-linear-gradient(0deg, rgba(10,27,51,0.025) 0px, rgba(10,27,51,0.025) 1px, transparent 1px, transparent 72px)",
            // Fade the pattern itself toward the photo
            "linear-gradient(90deg, #000 0%, #000 30%, transparent 58%)",
          ].join(", "),
          WebkitMaskImage:
            "linear-gradient(90deg, #000 0%, #000 30%, transparent 58%)",
          maskImage:
            "linear-gradient(90deg, #000 0%, #000 30%, transparent 58%)",
        }}
      />

      {/* ── Layer 4: large editorial Roman numeral watermark ─ */}
      <span
        aria-hidden
        className="pointer-events-none absolute -bottom-16 left-0 select-none font-[family-name:var(--font-display)] text-[clamp(240px,28vw,460px)] font-semibold leading-none tracking-[-0.04em] text-gold opacity-[0.07] max-lg:hidden"
        style={{ left: "3%" }}
      >
        MMXXVI
      </span>

      <SiteHeader />

      {/* ── Layer 5: content block ─────────────────────────── */}
      <div className="relative z-10 grid h-full min-h-[100svh] grid-cols-[5fr_7fr] max-lg:min-h-0 max-lg:grid-cols-1">
        <div className="flex flex-col justify-end px-14 pb-24 pt-40 max-lg:order-2 max-lg:bg-bone max-lg:pb-20 max-lg:pt-20 max-md:px-6">
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

        {/* Mobile photo slot — only renders on small viewports */}
        <div className="relative hidden aspect-[4/3] overflow-hidden max-lg:order-1 max-lg:block max-md:aspect-[3/2]">
          {/* The full-bleed Image above handles desktop; on mobile we need a visible block for the layout */}
        </div>
      </div>
    </section>
  );
}
