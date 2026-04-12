import type { Metadata } from "next";
import { PageSection, PageShell } from "@/components/shell/page-shell";
import { FormField, SubmitButton, TextArea } from "@/components/form";
import { Latin } from "@/components/editorial";

export const metadata: Metadata = {
  title: "Prayer Requests",
  description:
    "Submit a prayer intention to be remembered in the prayers of His Grace the Archbishop of Onitsha.",
};

export default function PrayerRequestsPage() {
  return (
    <PageShell
      eyebrow={<Latin>Orate pro invicem</Latin>}
      title="Prayer"
      titleAccent="Requests"
      lead="The Office of His Grace receives prayer intentions from the faithful around the world. Each intention is offered at the cathedral altar."
    >
      <PageSection>
        <div className="grid grid-cols-[1fr_1.3fr] gap-20 max-lg:grid-cols-1 max-lg:gap-14">
          <div>
            <h2 className="font-[family-name:var(--font-display)] text-[32px] font-medium italic leading-[1.25] text-ink">
              &ldquo;The prayer of a righteous person has great power.&rdquo;
            </h2>
            <p className="mt-4 font-[family-name:var(--font-ui)] text-[10px] font-semibold uppercase tracking-[2px] text-gold">
              James V:16
            </p>
            <p className="mt-8 text-[17px] leading-[1.7] text-ink-soft">
              Intentions submitted here are read privately by the chaplain to
              the Archbishop and remembered at the daily Mass. Names and
              personal details are kept in confidence.
            </p>
          </div>

          <form
            action="mailto:prayers@archbishopvalokeke.org"
            method="post"
            encType="text/plain"
            className="space-y-7"
          >
            <FormField
              id="name"
              label="Your Name"
              required
              autoComplete="name"
            />
            <FormField
              id="email"
              label="Email Address"
              type="email"
              required
              autoComplete="email"
              helper="We will send a brief acknowledgement when your intention is received."
            />
            <TextArea
              id="intention"
              label="Your Intention"
              rows={7}
              required
              placeholder="Please remember in prayer…"
            />
            <SubmitButton>Submit Intention →</SubmitButton>
            <p className="text-[13px] italic leading-[1.5] text-ink-soft">
              This form will open your email client with your intention
              pre-filled. A dedicated submission backend is being prepared by
              the Chancery.
            </p>
          </form>
        </div>
      </PageSection>
    </PageShell>
  );
}
