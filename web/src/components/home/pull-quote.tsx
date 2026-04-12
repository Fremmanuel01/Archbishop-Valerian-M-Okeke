export function PullQuote() {
  return (
    <section
      aria-label="Pull quote"
      className="px-14 py-[180px] text-center max-lg:px-8 max-md:px-6 max-md:py-32"
    >
      <div
        aria-hidden
        className="font-[family-name:var(--font-display)] text-[160px] leading-[0.5] text-gold opacity-30"
      >
        &ldquo;
      </div>
      <blockquote className="mx-auto max-w-[940px] font-[family-name:var(--font-display)] text-[clamp(32px,3.5vw,54px)] font-medium italic leading-[1.3] text-ink">
        The Eucharist is not a doctrine we defend but a fire we receive,
        <br />
        and into which we are continually drawn.
      </blockquote>
      <p className="mt-10 font-[family-name:var(--font-ui)] text-[11px] font-semibold uppercase tracking-[3px] text-gold">
        — Most Rev. Valerian M. Okeke
      </p>
    </section>
  );
}
