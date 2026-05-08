import type { CollectionConfig } from "payload";
import { revalidatePath } from "next/cache";

export const AppointmentSlots: CollectionConfig = {
  slug: "appointment-slots",
  access: { read: () => true },
  admin: {
    useAsTitle: "label",
    defaultColumns: ["date", "startTime", "endTime", "audience", "status"],
    group: "Appointments",
    description:
      "Each row is a single bookable time window. Lay faithful book Tuesday slots; priests & religious book Wednesday slots. Set status to 'blocked' to hide a slot without deleting it (e.g. when His Grace is travelling).",
  },
  hooks: {
    afterChange: [
      () => {
        // Wrap in try/catch — when this hook runs inside a bulk-update
        // operation, Payload may have started a transaction and a throw
        // here would roll the whole update back, leaving the storefront
        // looking like the update never happened.
        try {
          revalidatePath("/connect/appointment-laity");
          revalidatePath("/connect/appointment-clergy");
        } catch (err) {
          console.warn("[appointment-slots] revalidatePath failed:", err);
        }
      },
    ],
    afterDelete: [
      () => {
        try {
          revalidatePath("/connect/appointment-laity");
          revalidatePath("/connect/appointment-clergy");
        } catch (err) {
          console.warn("[appointment-slots] revalidatePath failed:", err);
        }
      },
    ],
    beforeChange: [
      ({ data }) => {
        // Cosmetic label so the admin row reads well in the list view.
        const date = typeof data.date === "string" ? data.date.slice(0, 10) : "";
        const start = typeof data.startTime === "string" ? data.startTime : "";
        const end = typeof data.endTime === "string" ? data.endTime : "";
        const audience =
          typeof data.audience === "string" ? data.audience : "";
        return {
          ...data,
          label: `${date} · ${start}–${end} · ${audience}`,
        };
      },
    ],
  },
  fields: [
    {
      name: "label",
      type: "text",
      admin: { hidden: true },
    },
    {
      name: "date",
      type: "date",
      required: true,
      admin: {
        description:
          "Tuesday for lay faithful, Wednesday for priests & religious.",
      },
    },
    {
      name: "startTime",
      type: "text",
      required: true,
      admin: {
        description: "24-hour, HH:MM format (e.g. 09:00).",
        placeholder: "09:00",
      },
    },
    {
      name: "endTime",
      type: "text",
      required: true,
      admin: {
        description: "24-hour, HH:MM format (e.g. 09:30).",
        placeholder: "09:30",
      },
    },
    {
      name: "audience",
      type: "select",
      required: true,
      defaultValue: "laity",
      options: [
        { label: "Lay Faithful (Tuesdays)", value: "laity" },
        { label: "Priests & Religious (Wednesdays)", value: "clergy" },
      ],
    },
    {
      name: "status",
      type: "select",
      required: true,
      defaultValue: "available",
      options: [
        { label: "Available", value: "available" },
        { label: "Booked", value: "booked" },
        { label: "Blocked", value: "blocked" },
      ],
      admin: {
        description:
          "'Available' means visitors can book it. 'Booked' is set automatically when a booking is made. 'Blocked' hides the slot from visitors without removing it.",
      },
    },
  ],
};
