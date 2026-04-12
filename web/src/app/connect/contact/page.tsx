import type { Metadata } from "next";
import { PageSection, PageShell } from "@/components/shell/page-shell";
import { FormField, SubmitButton, TextArea } from "@/components/form";
import { Latin } from "@/components/editorial";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Write to the Office of His Grace Most Rev. Valerian Maduka Okeke, Metropolitan Archbishop of Onitsha.",
};

export default function ContactPage() {
  return (
    <PageShell
      eyebrow={<Latin>Domus Episcopalis</Latin>}
      title="Write to the"
      titleAccent="Office of His Grace"
      lead="Correspondence regarding invitations, pastoral matters, interviews, or communication with the Archbishop."
    >
      <PageSection>
        <div className="grid grid-cols-[1fr_1.3fr] gap-20 max-lg:grid-cols-1 max-lg:gap-14">
          <aside className="space-y-10">
            <div>
              <h2 className="font-[family-name:var(--font-ui)] text-[10px] font-semibold uppercase tracking-[2.4px] text-gold">
                Archbishop&apos;s House
              </h2>
              <p className="mt-4 font-[family-name:var(--font-display)] text-[22px] leading-[1.4] text-ink">
                Domus Episcopalis
                <br />
                Archdiocese of Onitsha
                <br />
                Anambra State, Nigeria
              </p>
            </div>
            <div>
              <h2 className="font-[family-name:var(--font-ui)] text-[10px] font-semibold uppercase tracking-[2.4px] text-gold">
                Chancery
              </h2>
              <p className="mt-4 font-[family-name:var(--font-body)] text-[17px] leading-[1.7] text-ink">
                For administrative correspondence, please address the Chancery
                of the Archdiocese of Onitsha directly.
              </p>
            </div>
            <div>
              <h2 className="font-[family-name:var(--font-ui)] text-[10px] font-semibold uppercase tracking-[2.4px] text-gold">
                Media & Press
              </h2>
              <p className="mt-4 font-[family-name:var(--font-body)] text-[17px] leading-[1.7] text-ink">
                Interview requests and press inquiries are handled by the
                Archdiocesan Directorate of Social Communications.
              </p>
            </div>
          </aside>

          <form
            action="mailto:chancery@archbishopvalokeke.org"
            method="post"
            encType="text/plain"
            className="space-y-7"
          >
            <div className="grid grid-cols-2 gap-6 max-md:grid-cols-1">
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
              />
            </div>
            <FormField id="subject" label="Subject" required />
            <TextArea id="message" label="Message" rows={8} required />
            <SubmitButton>Send Message →</SubmitButton>
            <p className="text-[13px] italic leading-[1.5] text-ink-soft">
              This form will open your email client with the message
              pre-filled. A dedicated submission backend is being prepared by
              the Chancery.
            </p>
          </form>
        </div>
      </PageSection>
    </PageShell>
  );
}
