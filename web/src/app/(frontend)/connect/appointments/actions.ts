"use server";

import { randomBytes } from "node:crypto";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getPayloadClient } from "@/lib/payload";
import { sendEmail, resendConfigured } from "@/lib/resend";
import { SITE_URL } from "@/lib/site";
import { getBookingByCode } from "@/lib/appointments";
import type { Audience } from "@/lib/appointments";
import type { BookingState } from "./types";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function getRecipient(): string | null {
  return (
    process.env.APPOINTMENTS_TO ||
    process.env.CONTACT_TO ||
    null
  );
}

function audienceLabel(a: Audience) {
  return a === "laity" ? "Lay Faithful" : "Priests & Religious";
}

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

export async function bookAppointment(
  _prev: BookingState,
  formData: FormData,
): Promise<BookingState> {
  // Honeypot — silently succeed for bots
  if (formData.get("hp_field")) {
    return { ok: true, error: null };
  }

  const slotIdRaw = formData.get("slotId")?.toString().trim() ?? "";
  const fullName = formData.get("fullName")?.toString().trim() ?? "";
  const email = formData.get("email")?.toString().trim().toLowerCase() ?? "";
  const phone = formData.get("phone")?.toString().trim() ?? "";
  const parish = formData.get("parish")?.toString().trim() ?? "";
  const reason = formData.get("reason")?.toString().trim() ?? "";

  if (!slotIdRaw) {
    return { ok: false, error: "Please pick a slot before submitting." };
  }
  const slotId = Number(slotIdRaw);
  if (!Number.isFinite(slotId)) {
    return { ok: false, error: "Invalid slot reference." };
  }
  if (fullName.length < 2) {
    return { ok: false, error: "Please enter your full name." };
  }
  if (!EMAIL_RE.test(email)) {
    return { ok: false, error: "Please enter a valid email address." };
  }
  if (reason.length < 10) {
    return {
      ok: false,
      error: "Please share a short note about why you would like to meet (at least 10 characters).",
    };
  }

  if (!getRecipient()) {
    console.error("[appointments] APPOINTMENTS_TO / CONTACT_TO not set");
    return {
      ok: false,
      error: "The booking system is temporarily unavailable. Please try again later.",
    };
  }

  const payload = await getPayloadClient();

  // Read the slot first so the form can give a precise reason if the
  // booking can't proceed (slot deleted, slot blocked by admin, slot
  // already booked by someone else). Without this pre-check the only
  // visible error is "slot just taken", which is misleading when the
  // real cause is a deleted/blocked slot or a stale form id.
  const slotRecord = await payload
    .findByID({ collection: "appointment-slots", id: slotId })
    .catch(() => null);

  if (!slotRecord) {
    console.warn(`[appointments] slot ${slotId} not found at booking time`);
    return {
      ok: false,
      error:
        "We couldn't find that slot — it may have been removed. Please refresh the page and pick a different time.",
    };
  }

  const currentStatus =
    typeof slotRecord.status === "string" ? slotRecord.status : "unknown";

  if (currentStatus === "booked") {
    return {
      ok: false,
      error:
        "This slot has already been booked. Please refresh the page and pick a different time.",
    };
  }
  if (currentStatus === "blocked") {
    return {
      ok: false,
      error:
        "His Grace is unavailable for that slot. Please refresh and pick a different time.",
    };
  }
  if (currentStatus !== "available") {
    return {
      ok: false,
      error: `That slot is currently ${currentStatus} and cannot be booked. Please pick a different time.`,
    };
  }

  // Atomic claim: only flip status if it is still 'available'. If
  // another visitor genuinely raced us between the read above and this
  // write, the where clause matches 0 rows and we report "just taken".
  const claim = await payload.update({
    collection: "appointment-slots",
    where: {
      and: [
        { id: { equals: slotId } },
        { status: { equals: "available" } },
      ],
    },
    data: { status: "booked" },
  });

  // Some Payload bulk-update paths can return an empty `docs` array even
  // when the underlying SQL succeeded — re-read the slot to confirm the
  // status flipped before deciding it's a race.
  let slot = claim.docs[0];
  if (!slot) {
    const reread = await payload
      .findByID({ collection: "appointment-slots", id: slotId })
      .catch(() => null);
    if (reread && (reread as { status?: string }).status === "booked") {
      // Status is booked. Either we just did it or another visitor did.
      // Disambiguate by checking for an existing confirmed booking.
      const conflicting = await payload.find({
        collection: "appointment-bookings",
        where: {
          and: [
            { slot: { equals: slotId } },
            { status: { equals: "confirmed" } },
          ],
        },
        limit: 1,
        depth: 0,
      });
      if (conflicting.docs.length > 0) {
        return {
          ok: false,
          error:
            "This slot was just taken by another visitor. Please refresh the page and pick a different time.",
        };
      }
      slot = reread;
    } else {
      console.warn(
        `[appointments] claim returned no docs for slot ${slotId}; reread status=${
          reread ? (reread as { status?: string }).status : "missing"
        }`,
      );
      return {
        ok: false,
        error:
          "We couldn't reserve that slot. Please refresh the page and try again.",
      };
    }
  }

  const audience = (slot.audience as Audience) ?? "laity";
  const slotDate =
    typeof slot.date === "string" ? slot.date.slice(0, 10) : "";
  const slotStart = typeof slot.startTime === "string" ? slot.startTime : "";
  const slotEnd = typeof slot.endTime === "string" ? slot.endTime : "";
  const confirmationCode = randomBytes(16).toString("hex");

  let booking;
  try {
    booking = await payload.create({
      collection: "appointment-bookings",
      data: {
        slot: slot.id,
        audience,
        fullName,
        email,
        phone: phone || undefined,
        parish: parish || undefined,
        reason,
        confirmationCode,
        status: "confirmed",
      },
    });
  } catch (err) {
    // Roll the slot back to available so it isn't permanently lost.
    await payload
      .update({
        collection: "appointment-slots",
        id: slot.id,
        data: { status: "available" },
      })
      .catch(() => {});
    console.error("[appointments] booking create failed:", err);
    return {
      ok: false,
      error: "We couldn't save your booking. Please try again.",
    };
  }

  const longDate = formatLongDate(slotDate);
  const cancelUrl = `${SITE_URL}/connect/appointments/cancel/${confirmationCode}`;

  if (resendConfigured()) {
    const officeRecipient = getRecipient()!;
    const visitorBody = [
      `Dear ${fullName},`,
      "",
      `Your appointment with His Grace Most Rev. Valerian M. Okeke is confirmed.`,
      "",
      `  When:    ${longDate}`,
      `           ${slotStart} – ${slotEnd} (West Africa Time)`,
      `  Group:   ${audienceLabel(audience)}`,
      "",
      "Please plan to arrive at the Archbishop's House, Onitsha, ten minutes before your slot.",
      "",
      "If you can no longer make this meeting, kindly cancel using the link below so the slot can be released to another visitor:",
      "",
      `  ${cancelUrl}`,
      "",
      "May God bless you.",
      "",
      "— The Office of His Grace",
    ].join("\n");

    const officeBody = [
      `New appointment booked.`,
      "",
      `  When:    ${longDate}`,
      `           ${slotStart} – ${slotEnd}`,
      `  Group:   ${audienceLabel(audience)}`,
      "",
      `  Name:    ${fullName}`,
      `  Email:   ${email}`,
      phone ? `  Phone:   ${phone}` : null,
      parish
        ? `  ${audience === "laity" ? "Parish" : "Assignment"}: ${parish}`
        : null,
      "",
      "  Reason:",
      reason
        .split("\n")
        .map((line) => `    ${line}`)
        .join("\n"),
      "",
      `Cancel link (in case of follow-up): ${cancelUrl}`,
    ]
      .filter(Boolean)
      .join("\n");

    try {
      await Promise.all([
        sendEmail({
          to: email,
          subject: `Appointment confirmed · ${longDate} at ${slotStart}`,
          text: visitorBody,
          replyTo: officeRecipient,
        }),
        sendEmail({
          to: officeRecipient,
          subject: `Booking · ${audienceLabel(audience)} · ${longDate} ${slotStart}`,
          text: officeBody,
          replyTo: email,
        }),
      ]);
    } catch (err) {
      // Email failures shouldn't roll back the booking — the office can see
      // the record in Payload and the visitor can return to the cancel link.
      console.error("[appointments] email send failed:", err);
    }
  }

  // Refresh the listing so the just-booked slot disappears for the next visitor.
  revalidatePath(`/connect/appointment-${audience === "laity" ? "laity" : "clergy"}`);

  redirect(`/connect/appointments/confirmed/${confirmationCode}`);
}

export async function cancelAppointment(
  code: string,
): Promise<{ ok: boolean; error: string | null }> {
  const booking = await getBookingByCode(code);
  if (!booking) {
    return { ok: false, error: "We couldn't find that booking." };
  }
  if (booking.status === "cancelled") {
    return { ok: true, error: null };
  }

  const payload = await getPayloadClient();
  try {
    await payload.update({
      collection: "appointment-bookings",
      id: booking.id,
      data: { status: "cancelled" },
      overrideAccess: true,
    });
    const slotId =
      typeof booking.slot === "object" && booking.slot
        ? Number((booking.slot as { id: number | string }).id)
        : Number(booking.slot);
    if (Number.isFinite(slotId)) {
      await payload.update({
        collection: "appointment-slots",
        id: slotId,
        data: { status: "available" },
        overrideAccess: true,
      });
    }
  } catch (err) {
    console.error("[appointments] cancellation failed:", err);
    return {
      ok: false,
      error: "We couldn't cancel that booking. Please email the office.",
    };
  }

  // Notify office
  const officeRecipient = getRecipient();
  if (resendConfigured() && officeRecipient) {
    const slotData =
      typeof booking.slot === "object" && booking.slot
        ? (booking.slot as { date?: string; startTime?: string; endTime?: string })
        : {};
    const longDate = slotData.date ? formatLongDate(slotData.date.slice(0, 10)) : "";
    try {
      await sendEmail({
        to: officeRecipient,
        subject: `Appointment cancelled · ${booking.fullName ?? ""}`,
        text: [
          "An appointment has been cancelled by the visitor.",
          "",
          `  When:  ${longDate} ${slotData.startTime ?? ""}–${slotData.endTime ?? ""}`,
          `  Name:  ${booking.fullName ?? ""}`,
          `  Email: ${booking.email ?? ""}`,
        ].join("\n"),
      });
    } catch (err) {
      console.error("[appointments] cancellation email failed:", err);
    }
  }

  revalidatePath(`/connect/appointment-laity`);
  revalidatePath(`/connect/appointment-clergy`);
  return { ok: true, error: null };
}
