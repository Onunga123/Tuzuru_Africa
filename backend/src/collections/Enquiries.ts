import type { CollectionConfig, Access } from 'payload';

// MR-03 Enquiry contract. Reference format: TZ-<year>-<4 chars> from an alphabet
// that excludes I, O, 0, 1 (no ambiguous characters). Generated server-side.
const REFERENCE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

function generateReference(): string {
  const year = new Date().getFullYear();
  let chars = '';
  for (let i = 0; i < 4; i++) {
    chars += REFERENCE_ALPHABET[Math.floor(Math.random() * REFERENCE_ALPHABET.length)];
  }
  return `TZ-${year}-${chars}`;
}

// Enquiries carry traveller PII (name, email, phone) - reads/updates/deletes are
// admin-only. create is public so the public enquiry form (submitEnquiry) can post.
const adminOnly: Access = ({ req: { user } }) => Boolean(user);

export const Enquiries: CollectionConfig = {
  slug: 'enquiries',
  labels: { singular: 'Enquiry', plural: 'Enquiries' },
  admin: {
    group: 'Content',
    useAsTitle: 'reference_number',
    defaultColumns: ['reference_number', 'full_name', 'email', 'status', 'enquiry_type'],
  },
  access: {
    read: adminOnly,
    create: () => true, // public form submission (MR-03)
    update: adminOnly,
    delete: adminOnly,
  },
  hooks: {
    beforeChange: [
      ({ data, req }) => {
        const next = { ...data };
        // Server-assigned reference number (PAGE-26 confirmation page).
        if (!next.reference_number) {
          next.reference_number = generateReference();
        }
        // Public submissions always enter as 'new'; staff transitions are admin-side (CMS-13).
        if (!req.user) {
          next.status = next.status ?? 'new';
        }
        return next;
      },
    ],
  },
  fields: [
    // --- Sidebar: identity + workflow ---
    {
      name: 'reference_number',
      type: 'text',
      unique: true,
      index: true,
      label: 'Reference number',
      admin: { position: 'sidebar', readOnly: true },
    },
    {
      name: 'status',
      type: 'select',
      index: true,
      defaultValue: 'new',
      admin: { position: 'sidebar' },
      options: [
        { label: 'New', value: 'new' },
        { label: 'Under review', value: 'under_review' },
        { label: 'Awaiting customer', value: 'awaiting_customer' },
        { label: 'Quotation sent', value: 'quotation_sent' },
        { label: 'Follow up', value: 'follow_up' },
        { label: 'Booking requested', value: 'booking_requested' },
        { label: 'Confirmed', value: 'confirmed' },
        { label: 'Closed', value: 'closed' },
        { label: 'Unserviceable', value: 'unserviceable' },
      ],
    },
    {
      name: 'assigned_to',
      type: 'text',
      admin: { position: 'sidebar' },
    },
    {
      name: 'staff_notes',
      type: 'textarea',
      admin: { position: 'sidebar' },
    },
    // --- Traveller fields (MR-03 contract, 20 fields) ---
    {
      name: 'full_name',
      type: 'text',
      required: true,
    },
    {
      name: 'email',
      type: 'email',
      required: true,
    },
    {
      type: 'row',
      fields: [
        { name: 'phone', type: 'text' },
        { name: 'country', type: 'text', required: true },
      ],
    },
    {
      name: 'destinations',
      type: 'textarea',
      label: 'Destinations of interest',
    },
    {
      name: 'related_tour',
      type: 'text',
      label: 'Related tour',
      admin: {
        description: 'Tour slug or title the enquiry came from. Kept as text per MR-03 contract (form submits a slug, not an id).',
      },
    },
    {
      type: 'row',
      fields: [
        { name: 'travel_dates', type: 'text' },
        { name: 'adults', type: 'number' },
        { name: 'children', type: 'text', admin: { description: 'Number of children and their ages' } },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'duration', type: 'text' },
        { name: 'budget', type: 'text' },
        {
          name: 'currency',
          type: 'select',
          options: ['USD', 'EUR', 'GBP', 'KES', 'ZAR'],
        },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'accommodation_preference', type: 'text' },
        { name: 'travel_style', type: 'text' },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'enquiry_type',
          type: 'select',
          defaultValue: 'General enquiry',
          options: ['General enquiry', 'Quotation request', 'Custom itinerary', 'Booking request'],
        },
        {
          name: 'contact_preference',
          type: 'select',
          defaultValue: 'Email',
          options: ['Email', 'Phone call', 'WhatsApp'],
        },
      ],
    },
    {
      name: 'message',
      type: 'textarea',
      maxLength: 2000,
    },
    {
      name: 'privacy_acknowledged',
      type: 'checkbox',
      defaultValue: false,
      required: true,
      admin: { description: 'Must be true for the enquiry to be accepted.' },
    },
  ],
  timestamps: true,
};
