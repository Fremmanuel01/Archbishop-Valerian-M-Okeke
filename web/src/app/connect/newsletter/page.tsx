import type { Metadata } from "next";
import { PageSection, PageShell } from "@/components/shell/page-shell";
import { FormField, SubmitButton } from "@/components/form";

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
          <form className="mt-12 flex flex-col items-stretch gap-5 text-left">
            <FormField
              id="name"
              label="Your Name"
              required
              autoComplete="name"
            />
            <FormField
              id="email"
              label="Email"
              type="email"
              required
              autoComplete="email"
              helper="We will send an email to confirm your subscription."
            />
            <div className="mt-2 flex justify-center">
              <SubmitButton>Subscribe →</SubmitButton>
            </div>
            <p className="mt-6 text-center text-[13px] leading-[1.6] text-ink-soft">
              Your email is kept in confidence. You may unsubscribe at any
              time — the link is included in every message.
            </p>
          </form>
        </div>
      </PageSection>
    </PageShell>
  );
}
