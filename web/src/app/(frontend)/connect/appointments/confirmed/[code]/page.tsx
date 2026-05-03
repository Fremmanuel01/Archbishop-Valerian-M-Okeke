import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageSection, PageShell } from "@/components/shell/page-shell";
import { Latin, Roman } from "@/components/editorial";
import { getBookingByCode } from "@/lib/appointments";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Appointment confirmed",
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

export default async function ConfirmedPage({
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
  const year = dateIso ? Number(dateIso.slice(0, 4)) : null;
  const cancelled = booking.status === "cancelled";

  return (
    <PageShell
      eyebrow={<Latin>Audientia Confirmata</Latin>}
      title={cancelled ? "Appointment" : "Appointment"}
      titleAccent={cancelled ? "Cancelled" : "Confirmed"}
      lead={
        cancelled
          ? "This appointment is cancelled. The slot has been released."
          : "Your meeting with His Grace is on the calendar. A confirmation email has been sent."
      }
    >
      <PageSection>
        <div className="mx-auto max-w-[640px] border border-[color:var(--rule)] bg-bone-deep p-10 max-md:p-6">
          <dl className="space-y-6 font-[family-name:var(--font-body)] text-[16px] leading-[1.6] text-ink">
            <div>
              <dt className="font-[family-name:var(--font-ui)] text-[10px] font-semibold uppercase tracking-[2px] text-gold">
                When
              </dt>
              <dd className="mt-1 font-[family-name:var(--font-display)] text-[24px] font-medium italic">
                {longDate}
                {year ? (
                  <>
                    {" · "}
                    <Roman year={year} />
                  </>
                ) : null}
              </dd>
              {slot.startTime ? (
                <dd className="mt-1 text-[18px]">
                  {slot.startTime} – {slot.endTime}{" "}
                  <span className="text-ink-soft">(West Africa Time)</span>
                </dd>
              ) : null}
            </div>

            <div>
              <dt className="font-[family-name:var(--font-ui)] text-[10px] font-semibold uppercase tracking-[2px] text-gold">
                Where
              </dt>
              <dd className="mt-1 text-[16px]">
                The Archbishop&apos;s House, Onitsha, Anambra State.
              </dd>
            </div>

            <div>
              <dt className="font-[family-name:var(--font-ui)] text-[10px] font-semibold uppercase tracking-[2px] text-gold">
                For
              </dt>
              <dd className="mt-1 text-[16px]">
                {booking.fullName} ·{" "}
                {booking.audience === "laity"
                  ? "Lay Faithful"
                  : "Priests & Religious"}
              </dd>
            </div>
          </dl>

          {!cancelled ? (
            <div className="mt-10 border-t border-[color:var(--rule)] pt-6">
              <p className="font-[family-name:var(--font-ui)] text-[11px] uppercase tracking-[1.5px] text-ink-soft">
                Need to cancel?
              </p>
              <p className="mt-2 text-[14px] leading-[1.55] text-ink-soft">
                Use the link from your confirmation email, or visit{" "}
                <Link
                  href={`/connect/appointments/cancel/${code}`}
                  className="link-underline text-ink"
                >
                  this cancellation page
                </Link>
                . The slot will be released to another visitor.
              </p>
            </div>
          ) : null}
        </div>

        <p className="mt-12 text-center font-[family-name:var(--font-ui)] text-[11px] tracking-[1.5px] text-ink-soft">
          <Link href="/" className="link-underline hover:text-gold">
            Return to the home page
          </Link>
        </p>
      </PageSection>
    </PageShell>
  );
}
