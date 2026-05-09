import type { CollectionConfig } from "payload";
import { sendEmail, resendConfigured } from "@/lib/resend";
import { SITE_URL } from "@/lib/site";

function audienceLabel(a: string): string {
  return a === "laity" ? "Lay Faithful" : "Priests & Religious";
}

function formatLongDate(iso: string): string {
  if (!iso) return "";
  const d = new Date(`${iso.slice(0, 10)}T00:00:00Z`);
  if (Number.isNaN(d.getTime())) return iso;
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(d);
}

export const AppointmentBookings: CollectionConfig = {
  slug: "appointment-bookings",
  access: {
    // Bookings are private — only authenticated admin users can read them.
    read: ({ req }) => Boolean(req.user),
    create: () => true, // booking form posts as the public visitor
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  admin: {
    useAsTitle: "fullName",
    defaultColumns: ["fullName", "audience", "slot", "status", "createdAt"],
    group: "Appointments",
    description:
      "Bookings made through the storefront. To cancel a booking on behalf of the visitor (e.g. when His Grace is travelling), set its status to 'Cancelled' and save. The slot is released and the visitor receives a polite cancellation email automatically.",
  },
  hooks: {
    afterChange: [
      async ({ doc, previousDoc, operation, req }) => {
        if (operation !== "update") return;
        const wasCancelled = previousDoc?.status === "cancelled";
        const nowCancelled = doc.status === "cancelled";
        if (wasCancelled || !nowCancelled) return;

        // 1. Release the slot back to the available pool so a new visitor
        //    can book it.
        const slotId =
          typeof doc.slot === "object" && doc.slot
            ? Number((doc.slot as { id: number | string }).id)
            : Number(doc.slot);
        if (Number.isFinite(slotId)) {
          try {
            await req.payload.update({
              collection: "appointment-slots",
              id: slotId,
              data: { status: "available" },
              overrideAccess: true,
            });
          } catch (err) {
            console.error(
              "[appointment-bookings] failed to release slot:",
              err,
            );
          }
        }

        // 2. Notify the visitor. Wrap in try/catch so an email outage
        //    doesn't roll back the cancellation itself.
        if (!resendConfigured()) return;
        const officeRecipient =
          process.env.APPOINTMENTS_TO || process.env.CONTACT_TO || null;

        const slotData =
          typeof doc.slot === "object" && doc.slot
            ? (doc.slot as {
                date?: string;
                startTime?: string;
                endTime?: string;
              })
            : {};
        const longDate = slotData.date ? formatLongDate(slotData.date) : "";
        const audience = audienceLabel(doc.audience ?? "laity");
        const visitorEmail = typeof doc.email === "string" ? doc.email : "";
        const visitorName =
          typeof doc.fullName === "string" ? doc.fullName : "Friend";
        const cancelUrl = `${SITE_URL}/connect/appointments/confirmed/${doc.confirmationCode}`;

        const visitorBody = [
          `Dear ${visitorName},`,
          "",
          "We're sorry. Your appointment with His Grace Most Rev. Valerian M. Okeke could not be kept on the day you had scheduled:",
          "",
          `  When:  ${longDate} ${slotData.startTime ?? ""}–${slotData.endTime ?? ""}`,
          `  Group: ${audience}`,
          "",
          "Please feel free to book a new slot at your convenience:",
          "",
          `  ${SITE_URL}/appointments`,
          "",
          "If you have any questions, simply reply to this email and the office will get back to you.",
          "",
          "Yours in Christ,",
          "The Office of His Grace",
        ].join("\n");

        try {
          if (visitorEmail) {
            await sendEmail({
              to: visitorEmail,
              subject: `Appointment cancelled · ${longDate}`,
              text: visitorBody,
              replyTo: officeRecipient ?? undefined,
            });
          }
          if (officeRecipient) {
            await sendEmail({
              to: officeRecipient,
              subject: `Cancellation issued · ${visitorName} · ${longDate}`,
              text: [
                "An appointment was cancelled from the admin (or by the visitor).",
                "",
                `  When:  ${longDate} ${slotData.startTime ?? ""}–${slotData.endTime ?? ""}`,
                `  Group: ${audience}`,
                `  Name:  ${visitorName}`,
                `  Email: ${visitorEmail}`,
                "",
                `Confirmation page: ${cancelUrl}`,
              ].join("\n"),
            });
          }
        } catch (err) {
          console.error(
            "[appointment-bookings] cancellation emails failed:",
            err,
          );
        }
      },
    ],
  },
  fields: [
    {
      name: "slot",
      type: "relationship",
      relationTo: "appointment-slots",
      required: true,
      index: true,
      admin: {
        description: "The reserved slot.",
      },
    },
    {
      name: "audience",
      type: "select",
      required: true,
      defaultValue: "laity",
      options: [
        { label: "Lay", value: "laity" },
        { label: "Clergy", value: "clergy" },
      ],
      admin: {
        description: "Auto-set from the slot at booking time.",
        readOnly: true,
      },
    },
    {
      name: "fullName",
      type: "text",
      required: true,
    },
    {
      name: "email",
      type: "email",
      required: true,
    },
    {
      name: "phone",
      type: "text",
    },
    {
      name: "parish",
      type: "text",
      admin: { description: "Parish (lay) or assignment (clergy)." },
    },
    {
      name: "reason",
      type: "textarea",
      required: true,
    },
    {
      name: "status",
      type: "select",
      required: true,
      defaultValue: "confirmed",
      options: [
        { label: "Confirmed", value: "confirmed" },
        { label: "Cancelled", value: "cancelled" },
        { label: "Completed", value: "completed" },
        { label: "No-show", value: "no-show" },
      ],
    },
    {
      name: "confirmationCode",
      type: "text",
      required: true,
      unique: true,
      admin: {
        description: "Random token used in the cancellation link sent to the visitor.",
        readOnly: true,
      },
    },
    {
      name: "internalNotes",
      type: "textarea",
      admin: {
        description: "Office-only notes about the visitor or the meeting. Never shown to the visitor.",
      },
    },
  ],
};
