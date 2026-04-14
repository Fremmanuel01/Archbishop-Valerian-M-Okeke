import type { Metadata } from "next";
import { PageSection, PageShell } from "@/components/shell/page-shell";
import { NewsletterForm } from "@/components/connect-forms";

export const metadata: Metadata = {
  title: "Newsletter",
  description:
    "Receive pastoral letters, reflections, and news from His Grace the Archbishop of Onitsha by email.",
};

export default function NewsletterPage() {
  return (
    <PageShell
      eyebrow="Join the Archdiocesan Newsletter"
      title="Letters from"
      titleAccent="Onitsha"
      lead="New pastoral letters, homilies, and occasional reflections — delivered to your inbox a few times a month, never more."
    >
      <PageSection>
        <div className="mx-auto max-w-[640px] text-center">
          <h2 className="font-[family-name:var(--font-display)] text-[36px] font-medium italic leading-[1.2] text-ink">
            A quiet subscription — a few letters, a few reflections, and the
            rhythm of the liturgical year.
          </h2>
          <NewsletterForm />
        </div>
      </PageSection>
    </PageShell>
  );
}
