import { AppHeader } from "./app-header";
import { SiteFooter } from "@/components/home/site-footer";
import { SectionLabel } from "@/components/editorial";

export function PageShell({
  eyebrow,
  title,
  titleAccent,
  lead,
  children,
}: {
  eyebrow?: React.ReactNode;
  title: React.ReactNode;
  titleAccent?: React.ReactNode;
  lead?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <>
      <AppHeader />
      <main id="main">
        <header className="relative overflow-hidden border-b border-[color:var(--rule)] bg-bone px-14 pb-24 pt-28 max-lg:px-8 max-md:px-6 max-md:pb-16 max-md:pt-20">
          <div className="relative mx-auto max-w-[1240px]">
            {eyebrow ? <SectionLabel>{eyebrow}</SectionLabel> : null}
            <h1 className="mt-6 font-[family-name:var(--font-display)] text-[clamp(48px,5.5vw,88px)] font-medium leading-[1.05] tracking-[-0.015em] text-ink">
              {title}
              {titleAccent ? (
                <>
                  <br />
                  <em className="italic text-gold">{titleAccent}</em>
                </>
              ) : null}
            </h1>
            {lead ? (
              <p className="mt-6 max-w-[720px] font-[family-name:var(--font-display)] text-[22px] italic leading-[1.55] text-ink-soft">
                {lead}
              </p>
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
