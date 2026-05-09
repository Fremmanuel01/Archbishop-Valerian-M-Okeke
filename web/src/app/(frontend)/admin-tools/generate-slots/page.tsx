import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { PageSection, PageShell } from "@/components/shell/page-shell";
import { Latin } from "@/components/editorial";
import { GenerateSlotsForm } from "@/components/generate-slots-form";
import { ADMIN_ONLY, getAdminUserOr403 } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Generate Appointment Slots",
  robots: { index: false, follow: false },
};

export default async function GenerateSlotsPage() {
  const auth = await getAdminUserOr403(ADMIN_ONLY);
  if (!auth.user) {
    if (auth.reason === "unauthenticated") redirect("/admin");
    return (
      <PageShell
        eyebrow={<Latin>Instrumenta · Admin</Latin>}
        title="Not"
        titleAccent="Authorised"
        lead="This page requires the admin role."
      >
        <PageSection>
          <div className="mx-auto max-w-[600px] border border-[color:var(--rule)] bg-bone-deep p-8 text-center">
            <Link
              href="/admin"
              className="link-underline font-[family-name:var(--font-ui)] text-[11px] uppercase tracking-[1.5px] text-ink"
            >
              Return to Payload admin
            </Link>
          </div>
        </PageSection>
      </PageShell>
    );
  }

  const currentYear = new Date().getFullYear();

  return (
    <PageShell
      eyebrow={<Latin>Instrumenta · Admin</Latin>}
      title="Appointment Slots"
      titleAccent="Generator"
      lead="Pre-populate every Tuesday and Wednesday for a year with the default office-hours slots. Re-run any time; it only creates what's missing."
    >
      <PageSection>
        <div className="mx-auto max-w-[760px]">
          <GenerateSlotsForm defaultYear={currentYear} />

          <details className="mt-12 border border-[color:var(--rule)] bg-bone-deep p-6">
            <summary className="cursor-pointer font-[family-name:var(--font-ui)] text-[11px] font-semibold uppercase tracking-[2px] text-gold">
              How this works
            </summary>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-[14px] leading-relaxed text-ink-soft">
              <li>
                <strong>Lay faithful</strong> get six 30-minute slots every <strong>Tuesday</strong>: 09:00, 09:30, 10:00, 10:30, 11:00, 11:30.
              </li>
              <li>
                <strong>Priests &amp; religious</strong> get the same six slots every <strong>Wednesday</strong>.
              </li>
              <li>
                The generator is <strong>idempotent</strong>. Slots that already exist (whether from a previous run, manual creation, or a booking) are left untouched. Re-running is always safe.
              </li>
              <li>
                Past dates are skipped, so you can pick the current year without worrying about phantom slots in January.
              </li>
              <li>
                To <strong>block</strong> a specific Tuesday or Wednesday (e.g. when His Grace is travelling), open the affected slots in the <Link href="/admin/collections/appointment-slots" className="link-underline text-ink">Appointment Slots collection</Link> and set their status to <code>blocked</code>. They&apos;ll be hidden from visitors but preserved in the database.
              </li>
              <li>
                To change the default office hours or add a third weekday, edit <code>SCHEDULE</code> in <code>web/src/app/(frontend)/admin-tools/generate-slots/actions.ts</code> and redeploy.
              </li>
            </ul>
          </details>

          <p className="mt-12 text-center font-[family-name:var(--font-ui)] text-[11px] tracking-[1.5px] text-ink-soft">
            <Link
              href="/admin/collections/appointment-slots"
              className="link-underline hover:text-gold"
            >
              ← Back to Appointment Slots
            </Link>
          </p>
        </div>
      </PageSection>
    </PageShell>
  );
}
