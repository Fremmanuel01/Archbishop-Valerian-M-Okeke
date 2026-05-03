import type { CollectionConfig } from "payload";

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
      "Bookings made through the storefront. Each booking links to a specific slot. Cancel a booking here to release its slot back to the available pool.",
  },
  fields: [
    {
      name: "slot",
      type: "relationship",
      relationTo: "appointment-slots",
      required: true,
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
        description: "Office-only — notes about the visitor or the meeting. Never shown to the visitor.",
      },
    },
  ],
};
