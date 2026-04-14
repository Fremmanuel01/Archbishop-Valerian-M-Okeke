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
  children,
}: {
  eyebrow?: React.ReactNode;
  title: React.ReactNode;
  titleAccent?: React.ReactNode;
  lead?: React.ReactNode;
  heroImage?: { src: string; alt: string };
  children: React.ReactNode;
}) {
  return (
    <>
      <AppHeader />
      <main id="main">
        <header className="relative overflow-hidden border-b border-[color:var(--rule)] bg-bone px-14 pb-24 pt-28 max-lg:px-8 max-md:px-6 max-md:pb-16 max-md:pt-20">
          {heroImage ? (
            <div
              aria-hidden
              className="pointer-events-none absolute inset-y-0 right-0 w-[58%] max-lg:w-[72%] max-md:w-full max-md:opacity-25"
            >
              <Image
                src={heroImage.src}
                alt=""
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 58vw"
                className="object-cover object-center [filter:grayscale(100%)_contrast(1.15)_brightness(0.92)] [mix-blend-mode:multiply] [mask-image:radial-gradient(ellipse_110%_95%_at_65%_50%,black_38%,transparent_85%)] [-webkit-mask-image:radial-gradient(ellipse_110%_95%_at_65%_50%,black_38%,transparent_85%)]"
              />
              <div
                className="absolute inset-0 [mix-blend-mode:color] [mask-image:radial-gradient(ellipse_110%_95%_at_65%_50%,black_38%,transparent_85%)] [-webkit-mask-image:radial-gradient(ellipse_110%_95%_at_65%_50%,black_38%,transparent_85%)]"
                style={{ backgroundColor: "#0A1B33" }}
              />
            </div>
          ) : null}
          <div className="relative mx-auto max-w-[1240px]">
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
