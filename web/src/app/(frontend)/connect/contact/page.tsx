import type { Metadata } from "next";
import { PageSection, PageShell } from "@/components/shell/page-shell";
import { ContactForm } from "@/components/connect-forms";
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
              <dl className="mt-4 grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 font-[family-name:var(--font-body)] text-[17px] leading-[1.55] text-ink">
                <dt className="font-[family-name:var(--font-ui)] text-[10px] font-semibold uppercase tracking-[2px] text-gold-text">
                  Telephone
                </dt>
                <dd>
                  <a
                    href="tel:+2348176804048"
                    className="link-underline tabular-nums text-ink"
                  >
                    +234 817 680 4048
                  </a>
                </dd>
                <dt className="font-[family-name:var(--font-ui)] text-[10px] font-semibold uppercase tracking-[2px] text-gold-text">
                  Email
                </dt>
                <dd>
                  <a
                    href="mailto:secretariat@onitsha-archdiocese.org"
                    className="link-underline text-ink"
                  >
                    secretariat@onitsha-archdiocese.org
                  </a>
                </dd>
              </dl>
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

          <ContactForm />
        </div>
      </PageSection>
    </PageShell>
  );
}
