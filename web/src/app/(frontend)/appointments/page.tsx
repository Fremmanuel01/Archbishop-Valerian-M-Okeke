import type { Metadata } from "next";
import Link from "next/link";
import { PageSection, PageShell } from "@/components/shell/page-shell";
import { Latin } from "@/components/editorial";
import { getLang } from "@/lib/lang";
import { getDict } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Appointments",
  description:
    "Schedule a meeting with His Grace Most Rev. Valerian M. Okeke. Tuesdays for the lay faithful, Wednesdays for priests and religious.",
};

const OPTIONS = [
  {
    href: "/connect/appointment-laity",
    eyebrow: "Lay Faithful",
    title: "Tuesdays",
    body:
      "His Grace receives the lay faithful on Tuesdays at the Archbishop's House, Onitsha. Pick a free slot below and book it directly; confirmation arrives by email.",
    cta: "Book a Tuesday →",
  },
  {
    href: "/connect/appointment-clergy",
    eyebrow: "Priests & Religious",
    title: "Wednesdays",
    body:
      "Priests and religious are received on Wednesdays. Pick a free slot below for instant confirmation.",
    cta: "Book a Wednesday →",
  },
];

export default async function AppointmentsLandingPage() {
  const lang = await getLang();
  const t = getDict(lang);
  return (
    <PageShell
      eyebrow={<Latin>Audientia · Schedule</Latin>}
      title={t.pages.appointments.title}
      titleAccent={t.pages.appointments.titleAccent}
      lead={t.pages.appointments.lead}
    >
      <PageSection>
        <div className="grid grid-cols-2 gap-10 max-md:grid-cols-1 max-md:gap-6">
          {OPTIONS.map((opt) => (
            <Link
              key={opt.href}
              href={opt.href}
              className="group relative flex flex-col justify-between border border-[color:var(--rule)] bg-bone p-12 transition-colors hover:border-gold hover:bg-bone-deep max-md:p-8"
            >
              <span
                aria-hidden
                className="absolute -left-px -top-px h-6 w-6 border-l-2 border-t-2 border-gold opacity-0 transition-opacity group-hover:opacity-100"
              />
              <span
                aria-hidden
                className="absolute -bottom-px -right-px h-6 w-6 border-b-2 border-r-2 border-gold opacity-0 transition-opacity group-hover:opacity-100"
              />
              <div>
                <p className="font-[family-name:var(--font-ui)] text-[10px] font-semibold uppercase tracking-[2.4px] text-gold">
                  {opt.eyebrow}
                </p>
                <h2 className="mt-4 font-[family-name:var(--font-display)] text-[clamp(40px,4.5vw,64px)] font-medium leading-[1.05] text-ink transition-colors group-hover:text-gold">
                  <em className="italic">{opt.title}</em>
                </h2>
                <p className="mt-6 max-w-[420px] font-[family-name:var(--font-display)] text-[18px] italic leading-[1.55] text-ink-soft">
                  {opt.body}
                </p>
              </div>
              <span className="mt-12 inline-flex w-fit border-b border-gold pb-1.5 font-[family-name:var(--font-ui)] text-[11px] font-semibold uppercase tracking-[2px] text-ink">
                {opt.cta}
              </span>
            </Link>
          ))}
        </div>

        <p className="mt-16 border-t border-[color:var(--rule)] pt-6 text-center text-[14px] leading-[1.6] text-ink-soft">
          Need to write to the office about anything other than a meeting?{" "}
          <Link href="/connect/contact" className="link-underline text-ink">
            Use the contact form
          </Link>
          .
        </p>
      </PageSection>
    </PageShell>
  );
}
