import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { PageSection, PageShell } from "@/components/shell/page-shell";
import { Latin } from "@/components/editorial";
import { ProgrammeImportForm } from "@/components/programme-import-form";
import { ADMIN_ONLY, getAdminUserOr403 } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Programme Import",
  robots: { index: false, follow: false },
};

export default async function ProgrammeImportPage() {
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

  return (
    <PageShell
      eyebrow={<Latin>Instrumenta · Admin</Latin>}
      title="Programme"
      titleAccent="Import"
      lead="Upload a CSV to add or replace pastoral programme entries in bulk. Append is the safe default."
    >
      <PageSection>
        <div className="mx-auto max-w-[760px]">
          <ProgrammeImportForm />

          <details className="mt-12 border border-[color:var(--rule)] bg-bone-deep p-6">
            <summary className="cursor-pointer font-[family-name:var(--font-ui)] text-[11px] font-semibold uppercase tracking-[2px] text-gold">
              CSV format example
            </summary>
            <pre className="mt-4 overflow-x-auto bg-ink p-4 font-mono text-[12px] leading-relaxed text-bone">{`date,title,location,notes
2026-05-10,St Peter's Parish Nnokwa Pastoral Visit,St Peter's Parish Nnokwa,Sixth Sunday of Easter
2026-05-17,Ascension of the Lord,,Solemnity. Seventh Sunday of Easter
2026-05-24,Holy Spirit Parish Ogidi: Church Dedication,Holy Spirit Parish Ogidi,Pentecost Sunday
`}</pre>
            <ul className="mt-4 list-disc space-y-1 pl-5 text-[13px] leading-relaxed text-ink-soft">
              <li>
                <strong>date</strong> and <strong>title</strong> are required. Other columns optional.
              </li>
              <li>
                Empty rows are skipped silently. Rows missing date or title are reported in the result panel.
              </li>
              <li>
                Date is best as <code>YYYY-MM-DD</code>; <code>DD/MM/YYYY</code> is parsed as a fallback.
              </li>
              <li>
                Wrap fields containing commas in quotes, e.g. <code>&quot;Mass, Prison Visit&quot;</code>.
              </li>
            </ul>
          </details>

          <p className="mt-12 text-center font-[family-name:var(--font-ui)] text-[11px] tracking-[1.5px] text-ink-soft">
            <Link href="/admin/globals/programme" className="link-underline hover:text-gold">
              ← Back to the Programme global
            </Link>
          </p>
        </div>
      </PageSection>
    </PageShell>
  );
}
