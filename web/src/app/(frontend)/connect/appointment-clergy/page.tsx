import type { Metadata } from "next";
import Link from "next/link";
import { PageSection, PageShell } from "@/components/shell/page-shell";
import { Latin } from "@/components/editorial";
import { AppointmentForm } from "@/components/appointment-form";
import {
  audienceCopy,
  getAvailableSlots,
} from "@/lib/appointments";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Schedule a Meeting · Priests & Religious",
  description:
    "Book an appointment with His Grace Most Rev. Valerian M. Okeke. Priests and religious are received on Wednesdays.",
};

export default async function AppointmentClergyPage() {
  const slots = await getAvailableSlots("clergy");
  const copy = audienceCopy("clergy");

  return (
    <PageShell
      eyebrow={<Latin>Audientia · Priests & Religious</Latin>}
      title={copy.heading}
      titleAccent={copy.accent}
      lead={copy.lead}
    >
      <PageSection>
        <div className="mx-auto max-w-[860px]">
          <AppointmentForm audience="clergy" slotsByDate={slots} />
          <p className="mt-16 border-t border-[color:var(--rule)] pt-6 text-center font-[family-name:var(--font-ui)] text-[11px] tracking-[1.5px] text-ink-soft">
            <Link
              href={copy.otherHref}
              className="link-underline hover:text-gold"
            >
              {copy.otherLabel}
            </Link>
          </p>
        </div>
      </PageSection>
    </PageShell>
  );
}
