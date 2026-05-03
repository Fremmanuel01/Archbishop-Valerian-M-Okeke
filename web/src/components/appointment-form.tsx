"use client";

import { useState } from "react";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { FormField, TextArea } from "@/components/form";
import { bookAppointment } from "@/app/(frontend)/connect/appointments/actions";
import { initialBookingState } from "@/app/(frontend)/connect/appointments/types";
import type {
  Audience,
  AvailableSlot,
  SlotsByDate,
} from "@/lib/appointments";

function Honeypot() {
  return (
    <div
      aria-hidden
      style={{
        position: "absolute",
        left: "-9999px",
        height: 0,
        overflow: "hidden",
      }}
    >
      <label>
        Please leave this empty
        <input
          type="text"
          name="hp_field"
          tabIndex={-1}
          autoComplete="off"
        />
      </label>
    </div>
  );
}

function StatusButton({
  hasSlot,
  children,
}: {
  hasSlot: boolean;
  children: React.ReactNode;
}) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending || !hasSlot}
      style={{ ["--sweep-color" as string]: "#c9a664" }}
      className="btn-ink btn-sweep disabled:cursor-not-allowed disabled:opacity-50"
    >
      {pending
        ? "Confirming…"
        : hasSlot
          ? children
          : "Pick a time slot above"}
    </button>
  );
}

export function AppointmentForm({
  audience,
  slotsByDate,
}: {
  audience: Audience;
  slotsByDate: SlotsByDate[];
}) {
  const [selectedSlot, setSelectedSlot] = useState<AvailableSlot | null>(null);
  const [state, formAction] = useActionState(
    bookAppointment,
    initialBookingState,
  );

  const hasSlots = slotsByDate.length > 0;
  const parishLabel =
    audience === "laity" ? "Parish" : "Assignment / Order";

  return (
    <div className="space-y-16">
      {/* Slot picker */}
      <section aria-label="Available slots">
        <h2 className="font-[family-name:var(--font-ui)] text-[10px] font-semibold uppercase tracking-[3px] text-gold">
          Available Slots
        </h2>
        <p className="mt-3 max-w-[600px] font-[family-name:var(--font-display)] text-[20px] italic leading-[1.55] text-ink-soft">
          {hasSlots
            ? "Tap a time below to select it. Slots are released as bookings are cancelled."
            : "No slots are open at the moment. Please check back in a few days, or contact the office directly."}
        </p>

        {hasSlots ? (
          <div className="mt-10 space-y-10">
            {slotsByDate.map((group) => (
              <div key={group.date}>
                <p className="mb-4 font-[family-name:var(--font-display)] text-[24px] font-medium italic leading-[1.2] text-ink">
                  {group.longDate}
                </p>
                <ul className="flex flex-wrap gap-3">
                  {group.slots.map((slot) => {
                    const isSelected = selectedSlot?.id === slot.id;
                    return (
                      <li key={slot.id}>
                        <button
                          type="button"
                          onClick={() => setSelectedSlot(slot)}
                          className={[
                            "min-h-[44px] border px-5 py-3 font-[family-name:var(--font-ui)] text-[12px] font-semibold uppercase tracking-[1.6px] transition-colors",
                            isSelected
                              ? "border-gold bg-ink text-bone"
                              : "border-[color:var(--rule)] bg-bone text-ink hover:border-gold hover:text-gold",
                          ].join(" ")}
                          aria-pressed={isSelected}
                        >
                          {slot.startTime} – {slot.endTime}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        ) : null}
      </section>

      {/* Booking form */}
      {hasSlots ? (
        <section aria-label="Your details">
          <h2 className="font-[family-name:var(--font-ui)] text-[10px] font-semibold uppercase tracking-[3px] text-gold">
            Your Details
          </h2>
          <p className="mt-3 font-[family-name:var(--font-display)] text-[20px] italic leading-[1.55] text-ink-soft">
            {selectedSlot ? (
              <>
                Booking for{" "}
                <strong className="not-italic text-ink">
                  {slotsByDate.find((g) =>
                    g.slots.some((s) => s.id === selectedSlot.id),
                  )?.longDate}{" "}
                  · {selectedSlot.startTime}–{selectedSlot.endTime}
                </strong>
              </>
            ) : (
              "Pick a time slot above to enable the form."
            )}
          </p>

          <form action={formAction} className="mt-10 space-y-7">
            <Honeypot />
            <input
              type="hidden"
              name="slotId"
              value={selectedSlot?.id ?? ""}
            />

            <div className="grid grid-cols-2 gap-7 max-md:grid-cols-1 max-md:gap-5">
              <FormField
                id="fullName"
                label="Full Name"
                required
                autoComplete="name"
              />
              <FormField
                id="email"
                label="Email Address"
                type="email"
                required
                autoComplete="email"
              />
              <FormField
                id="phone"
                label="Phone (optional)"
                type="tel"
                autoComplete="tel"
              />
              <FormField
                id="parish"
                label={parishLabel}
                autoComplete="organization"
              />
            </div>

            <TextArea
              id="reason"
              label="Reason for the meeting"
              required
              rows={5}
              helper="A brief note helps the office prepare. Treat as confidential."
            />

            {state.error ? (
              <p
                role="alert"
                className="border-l-2 border-red-400 bg-red-50 px-4 py-3 font-[family-name:var(--font-ui)] text-[13px] text-red-900"
              >
                {state.error}
              </p>
            ) : null}

            <div className="flex flex-wrap items-center gap-4">
              <StatusButton hasSlot={Boolean(selectedSlot)}>
                Confirm Appointment
              </StatusButton>
              <p className="font-[family-name:var(--font-ui)] text-[11px] text-ink-soft">
                You&apos;ll receive an email with the details immediately.
              </p>
            </div>
          </form>
        </section>
      ) : null}
    </div>
  );
}
