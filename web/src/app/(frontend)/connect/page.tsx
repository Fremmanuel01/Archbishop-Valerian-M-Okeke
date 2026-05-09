import type { Metadata } from "next";
import Link from "next/link";
import { PageSection, PageShell } from "@/components/shell/page-shell";
import { getLang } from "@/lib/lang";
import { getDict } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Connect",
  description:
    "Ways to reach the Office of His Grace the Archbishop of Onitsha: prayer requests, correspondence, and newsletter.",
};

const ROUTES = [
  {
    href: "/connect/appointment-laity",
    title: "Appointment · Lay Faithful",
    body: "Book a meeting with His Grace on his Tuesday office day. Slots are available on a first-come, first-served basis.",
  },
  {
    href: "/connect/appointment-clergy",
    title: "Appointment · Priests & Religious",
    body: "Priests and religious are received on Wednesdays. Pick a free slot below for instant confirmation.",
  },
  {
    href: "/connect/prayer-requests",
    title: "Prayer Requests",
    body: "Submit an intention to be remembered in the prayers of His Grace and the cathedral community.",
  },
  {
    href: "/connect/contact",
    title: "Contact",
    body: "Write to the Office of His Grace for correspondence, invitations, or pastoral matters.",
  },
  {
    href: "/connect/newsletter",
    title: "Newsletter",
    body: "Receive pastoral letters, reflections, and news from the Archdiocese by email.",
  },
];

export default async function ConnectPage() {
  const lang = await getLang();
  const t = getDict(lang);
  return (
    <PageShell
      eyebrow={t.pages.connect.eyebrow}
      title={t.pages.connect.title}
      titleAccent={t.pages.connect.titleAccent}
      lead={t.pages.connect.lead}
    >
      <PageSection>
        <div className="grid grid-cols-3 gap-10 max-lg:grid-cols-2 max-md:grid-cols-1">
          {ROUTES.map((r) => (
            <Link
              key={r.href}
              href={r.href}
              className="group flex flex-col justify-between border border-[color:var(--rule)] bg-bone p-10 transition-colors hover:border-gold hover:bg-bone-deep"
            >
              <div>
                <h2 className="font-[family-name:var(--font-display)] text-[34px] font-medium leading-[1.1] text-ink transition-colors group-hover:text-gold">
                  {r.title}
                </h2>
                <p className="mt-5 text-[16px] leading-[1.6] text-ink-soft">
                  {r.body}
                </p>
              </div>
              <span className="mt-10 inline-flex w-fit border-b border-gold pb-1.5 font-[family-name:var(--font-ui)] text-[10px] font-semibold uppercase tracking-[2px] text-ink">
                Continue →
              </span>
            </Link>
          ))}
        </div>
      </PageSection>
    </PageShell>
  );
}
