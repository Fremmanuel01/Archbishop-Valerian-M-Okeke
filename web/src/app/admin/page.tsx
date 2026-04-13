import type { Metadata } from "next";
import Link from "next/link";
import { PageSection, PageShell } from "@/components/shell/page-shell";
import { Keys } from "@/components/icons";

export const metadata: Metadata = {
  title: "Chancery Admin",
  description:
    "Content management for the website of His Grace Most Rev. Valerian Maduka Okeke, Archbishop of Onitsha.",
  robots: { index: false, follow: false },
};

export default function AdminPlaceholderPage() {
  return (
    <PageShell
      eyebrow="Administration"
      title="Chancery"
      titleAccent="Admin"
      lead="The content management dashboard for the Office of His Grace."
    >
      <PageSection>
        <div className="mx-auto max-w-[640px] border border-[color:var(--rule)] bg-bone p-14 text-center max-md:p-8">
          <Keys
            className="mx-auto h-12 w-12 text-gold-text"
            size={48}
          />
          <h2 className="mt-6 font-[family-name:var(--font-display)] text-[36px] font-medium leading-[1.2] text-ink">
            Dashboard in preparation
          </h2>
          <p className="mx-auto mt-6 max-w-[440px] font-[family-name:var(--font-display)] text-[18px] italic leading-[1.55] text-ink-soft">
            The Chancery admin is being set up. Once provisioned, authorised
            staff will be able to edit pastoral letters, homilies, diary
            entries, and homepage content from this dashboard.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Link
              href="/connect/contact"
              className="btn-outline btn-sweep"
              style={{ ["--sweep-color" as string]: "#0a1b33" }}
            >
              Contact the Webmaster →
            </Link>
            <Link
              href="/"
              className="btn-ink btn-sweep"
              style={{ ["--sweep-color" as string]: "#c9a664" }}
            >
              Return Home →
            </Link>
          </div>
        </div>
      </PageSection>
    </PageShell>
  );
}
