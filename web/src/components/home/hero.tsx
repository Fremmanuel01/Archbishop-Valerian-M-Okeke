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
      {/* ── Pattern on the bone side, masked well before photo ── */}
      <div
        aria-hidden
        className="absolute inset-y-0 left-0 w-[38%] max-lg:hidden"
        style={{
          background: [
            "repeating-linear-gradient(90deg, rgba(176,136,64,0.06) 0px, rgba(176,136,64,0.06) 1px, transparent 1px, transparent 72px)",
            "repeating-linear-gradient(0deg, rgba(10,27,51,0.03) 0px, rgba(10,27,51,0.03) 1px, transparent 1px, transparent 72px)",
          ].join(", "),
          WebkitMaskImage:
            "linear-gradient(90deg, #000 0%, #000 70%, transparent 100%)",
          maskImage:
            "linear-gradient(90deg, #000 0%, #000 70%, transparent 100%)",
        }}
      />

      {/* ── Photo anchored right, with its own inner bone fade ── */}
      <div className="absolute inset-y-0 right-0 w-[62%] overflow-hidden max-lg:inset-x-0 max-lg:inset-y-auto max-lg:top-0 max-lg:h-[58svh] max-lg:w-full">
        <Image
          src="/hero.avif"
          alt="His Grace Archbishop Valerian M. Okeke with episcopal crozier"
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 62vw"
          quality={92}
          className="scale-[1.15] object-cover object-[60%_12%] [filter:brightness(1.04)_contrast(1.05)_saturate(1.05)]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 w-[40%] max-lg:hidden"
          style={{
            background:
              "linear-gradient(90deg, var(--bone) 0%, rgba(247,244,238,0.9) 35%, rgba(247,244,238,0.45) 65%, transparent 100%)",
          }}
        />
      </div>

      {/* ── Small MMXXVI mark in the bottom corner of the photo ── */}
      <span
        aria-hidden
        className="pointer-events-none absolute bottom-8 right-14 select-none font-[family-name:var(--font-display)] text-[18px] font-semibold uppercase tracking-[3px] text-white/80 max-lg:hidden"
      >
        Anno Domini MMXXVI
      </span>

      <SiteHeader />

      {/* ── Content ─────────────────────────────────────────── */}
      <div className="relative z-10 flex min-h-[100svh] items-center px-14 pb-20 pt-40 max-lg:min-h-0 max-lg:items-start max-lg:bg-bone max-lg:pb-20 max-lg:pt-[58svh] max-md:px-6 max-md:pt-[55svh]">
        <div className="max-w-[560px]">
          <p className="mb-8 flex items-center gap-[18px] font-[family-name:var(--font-ui)] text-[11px] font-semibold uppercase tracking-[3px] text-gold-text max-md:mb-6">
            <span aria-hidden className="block h-px w-12 bg-gold" />
            His Grace · Most Reverend
          </p>
          <h1 className="mb-8 font-[family-name:var(--font-display)] text-[clamp(56px,5.2vw,96px)] font-medium leading-[0.98] tracking-[-0.02em] text-ink max-md:mb-6 max-md:text-[52px] max-md:leading-[1.05]">
            <span className="block italic font-normal text-gold">
              Valerian Maduka
            </span>
            Okeke
          </h1>
          <div aria-hidden className="mb-8 h-px w-16 bg-gold max-md:mb-6" />
          <p className="mb-10 max-w-[480px] font-[family-name:var(--font-display)] text-[20px] italic leading-[1.55] text-ink-soft max-md:mb-8 max-md:max-w-none max-md:text-[17px]">
            Metropolitan Archbishop of Onitsha · Servant of the Lord&apos;s
            vineyard since the year of Our Lord <Roman year={2003} />.
          </p>
          <div className="flex flex-wrap items-center gap-4 max-md:gap-3">
            <Link
              href={latestHref}
              style={{ color: "#ffffff" }}
              className="inline-flex min-h-12 items-center gap-3 bg-ink px-8 py-4 font-[family-name:var(--font-ui)] text-[11px] font-semibold uppercase tracking-[2px] text-white transition-colors hover:bg-ink-soft focus-visible:bg-ink-soft"
            >
              Read the Pastoral Letter →
            </Link>
            <Link
              href="/biography"
              className="inline-flex min-h-12 items-center gap-3 border border-ink/25 bg-transparent px-8 py-4 font-[family-name:var(--font-ui)] text-[11px] font-semibold uppercase tracking-[2px] text-ink transition-colors hover:border-gold hover:text-gold-text focus-visible:border-gold focus-visible:text-gold-text"
            >
              Meet His Grace
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
