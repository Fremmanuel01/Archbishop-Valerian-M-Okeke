import Image from "next/image";
import { AppHeader } from "./app-header";
import { SiteFooter } from "@/components/home/site-footer";
import { SectionLabel } from "@/components/editorial";
import { Reveal } from "@/components/reveal";

export function PageShell({
  eyebrow,
  title,
  titleAccent,
  lead,
  heroImage,
  heroPortrait,
  children,
}: {
  eyebrow?: React.ReactNode;
  title: React.ReactNode;
  titleAccent?: React.ReactNode;
  lead?: React.ReactNode;
  heroImage?: { src: string; alt: string };
  heroPortrait?: { src: string; alt: string };
  children: React.ReactNode;
}) {
  return (
    <>
      <AppHeader />
      <main id="main">
        <header className="relative overflow-hidden border-b border-[color:var(--rule)] bg-bone px-14 pb-24 pt-28 max-lg:px-8 max-md:px-6 max-md:pb-16 max-md:pt-20">
          {heroImage ? (
            <>
              <svg
                aria-hidden
                width="0"
                height="0"
                className="absolute"
                style={{ position: "absolute" }}
              >
                <defs>
                  <filter id="ink-splatter" x="-10%" y="-10%" width="120%" height="120%">
                    <feTurbulence
                      type="fractalNoise"
                      baseFrequency="0.018 0.028"
                      numOctaves="2"
                      seed="7"
                      result="noise"
                    />
                    <feDisplacementMap
                      in="SourceGraphic"
                      in2="noise"
                      scale="10"
                      xChannelSelector="R"
                      yChannelSelector="G"
                    />
                  </filter>
                </defs>
              </svg>
              <div
                aria-hidden
                className="pointer-events-none absolute inset-y-0 right-0 w-[52%] max-lg:w-[66%] max-md:w-full max-md:opacity-30"
              >
                <Image
                  src={heroImage.src}
                  alt=""
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 52vw"
                  className="object-cover object-center [filter:grayscale(100%)_contrast(1.15)_brightness(0.92)] [mask-image:linear-gradient(to_right,transparent_0%,black_55%,black_90%,transparent_100%)] [-webkit-mask-image:linear-gradient(to_right,transparent_0%,black_55%,black_90%,transparent_100%)]"
                />
                <div
                  className="absolute inset-0 [mix-blend-mode:color] [mask-image:linear-gradient(to_right,transparent_0%,black_55%,black_90%,transparent_100%)] [-webkit-mask-image:linear-gradient(to_right,transparent_0%,black_55%,black_90%,transparent_100%)]"
                  style={{ backgroundColor: "#0A1B33" }}
                />
              </div>
            </>
          ) : null}
          <div className="relative mx-auto max-w-[1240px]">
            {heroPortrait ? (
              <div
                aria-hidden
                className="pointer-events-none absolute bottom-[-96px] right-0 hidden h-[calc(100%+120px)] w-[38%] lg:block"
              >
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "radial-gradient(ellipse 70% 60% at 55% 68%, rgba(176,136,64,0.10), transparent 70%)",
                  }}
                />
                <span
                  aria-hidden
                  className="absolute left-[6%] top-[10%] font-[family-name:var(--font-display)] text-[180px] italic leading-none text-gold/10 select-none"
                >
                  V
                </span>
                <Image
                  src={heroPortrait.src}
                  alt=""
                  fill
                  priority
                  sizes="38vw"
                  className="object-contain object-bottom [filter:grayscale(0.15)_contrast(1.02)] [mix-blend-mode:multiply] [mask-image:linear-gradient(to_bottom,black_85%,transparent_100%)] [-webkit-mask-image:linear-gradient(to_bottom,black_85%,transparent_100%)]"
                />
              </div>
            ) : null}
            <div className={heroPortrait ? "relative lg:max-w-[62%]" : "relative"}>
              {eyebrow ? (
                <Reveal>
                  <SectionLabel>{eyebrow}</SectionLabel>
                </Reveal>
              ) : null}
              <Reveal delay={120}>
                <h1 className="mt-6 font-[family-name:var(--font-display)] text-[clamp(48px,5.5vw,88px)] font-medium leading-[1.05] tracking-[-0.015em] text-ink">
                  {title}
                  {titleAccent ? (
                    <>
                      <br />
                      <em className="italic text-gold">{titleAccent}</em>
                    </>
                  ) : null}
                </h1>
              </Reveal>
              {lead ? (
                <Reveal delay={240}>
                  <p className="mt-6 max-w-[720px] font-[family-name:var(--font-display)] text-[22px] italic leading-[1.55] text-ink-soft">
                    {lead}
                  </p>
                </Reveal>
              ) : null}
            </div>
          </div>
        </header>
        {children}
      </main>
      <SiteFooter />
    </>
  );
}

export function PageSection({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`px-14 py-24 max-lg:px-8 max-md:px-6 max-md:py-16 ${className}`}
    >
      <div className="mx-auto max-w-[1240px]">{children}</div>
    </section>
  );
}
