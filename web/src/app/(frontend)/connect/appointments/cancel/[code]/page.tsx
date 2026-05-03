import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { PageSection, PageShell } from "@/components/shell/page-shell";
import { Latin } from "@/components/editorial";
import {
  cancelAppointment,
} from "@/app/(frontend)/connect/appointments/actions";
import { getBookingByCode } from "@/lib/appointments";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Cancel appointment",
  robots: { index: false, follow: false },
};

function formatLongDate(iso: string): string {
  const d = new Date(`${iso}T00:00:00Z`);
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(d);
}

export default async function CancelPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const booking = await getBookingByCode(code);
  if (!booking) notFound();

  const slot =
    typeof booking.slot === "object" && booking.slot
      ? (booking.slot as {
          date?: string;
          startTime?: string;
          endTime?: string;
        })
      : {};
  const dateIso = slot.date?.slice(0, 10) ?? "";
  const longDate = dateIso ? formatLongDate(dateIso) : "";

  if (booking.status === "cancelled") {
    redirect(`/connect/appointments/confirmed/${code}`);
  }

  async function confirmCancel() {
    "use server";
    await cancelAppointment(code);
    redirect(`/connect/appointments/confirmed/${code}`);
  }

  return (
    <PageShell
      eyebrow={<Latin>Audientia · Cancellation</Latin>}
      title="Cancel This"
      titleAccent="Appointment"
      lead="Confirm to release the slot back to other visitors. You can always book again later."
    >
      <PageSection>
        <div className="mx-auto max-w-[600px] border border-[color:var(--rule)] bg-bone-deep p-10 max-md:p-6">
          <dl className="space-y-5 font-[family-name:var(--font-body)] text-[16px] text-ink">
            <div>
              <dt className="font-[family-name:var(--font-ui)] text-[10px] font-semibold uppercase tracking-[2px] text-gold">
                When
              </dt>
              <dd className="mt-1 font-[family-name:var(--font-display)] text-[20px] font-medium italic">
                {longDate}
              </dd>
              {slot.startTime ? (
                <dd className="mt-1">
                  {slot.startTime} – {slot.endTime}
                </dd>
              ) : null}
            </div>
            <div>
              <dt className="font-[family-name:var(--font-ui)] text-[10px] font-semibold uppercase tracking-[2px] text-gold">
                For
              </dt>
              <dd className="mt-1">{booking.fullName}</dd>
            </div>
          </dl>

          <form action={confirmCancel} className="mt-10 flex flex-wrap items-center gap-4">
            <button
              type="submit"
              className="border border-red-400 bg-red-50 px-6 py-3 font-[family-name:var(--font-ui)] text-[12px] font-semibold uppercase tracking-[1.6px] text-red-900 transition-colors hover:bg-red-100"
            >
              Cancel Appointment
            </button>
            <Link
              href={`/connect/appointments/confirmed/${code}`}
              className="link-underline font-[family-name:var(--font-ui)] text-[11px] uppercase tracking-[1.5px] text-ink"
            >
              Keep it
            </Link>
          </form>
        </div>
      </PageSection>
    </PageShell>
  );
}
