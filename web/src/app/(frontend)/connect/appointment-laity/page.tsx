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
  title: "Schedule a Meeting · Lay Faithful",
  description:
    "Book an appointment with His Grace Most Rev. Valerian M. Okeke. Lay faithful are received on Tuesdays.",
};

export default async function AppointmentLaityPage() {
  const slots = await getAvailableSlots("laity");
  const copy = audienceCopy("laity");

  return (
    <PageShell
      eyebrow={<Latin>Audientia · Lay Faithful</Latin>}
      title={copy.heading}
      titleAccent={copy.accent}
      lead={copy.lead}
    >
      <PageSection>
        <div className="mx-auto max-w-[860px]">
          <AppointmentForm audience="laity" slotsByDate={slots} />
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
