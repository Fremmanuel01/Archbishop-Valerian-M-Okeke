"use client";

function AnimatedText({
  text,
  startDelay = 0,
  charDelay = 35,
  className = "",
}: {
  text: string;
  startDelay?: number;
  charDelay?: number;
  className?: string;
}) {
  return (
    <span className={className} aria-label={text}>
      {text.split("").map((char, i) => (
        <span
          key={`${char}-${i}`}
          aria-hidden
          className="inline-block"
          style={{
            animation: `char-reveal 700ms cubic-bezier(0.22, 1, 0.36, 1) ${
              startDelay + i * charDelay
            }ms both`,
          }}
        >
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </span>
  );
}

export function AnimatedName() {
  return (
    <h1 className="mb-8 font-[family-name:var(--font-display)] text-[clamp(56px,5.2vw,96px)] font-medium leading-[0.98] tracking-[-0.02em] text-ink max-md:mb-6 max-md:text-[52px] max-md:leading-[1.05]">
      <AnimatedText
        text="Valerian Maduka"
        startDelay={200}
        className="block italic font-normal text-gold"
      />
      <AnimatedText text="Okeke" startDelay={900} />
    </h1>
  );
}
