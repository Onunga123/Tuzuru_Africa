import type { CollectionConfig } from 'payload';
import { adminOrApproved } from '../access/adminOrApproved'


export const Reviews: CollectionConfig = {
  slug: 'reviews',
  labels: { singular: 'Review', plural: 'Reviews' },
  admin: {
    group: 'Content',
    useAsTitle: 'authorName',
    defaultColumns: ['authorName', 'published', 'publishedAt', 'tripReference'],
  },
  access: {
    read: adminOrApproved,
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      name: 'authorName',
      type: 'text',
      required: true,
    },
    {
      name: 'quote',
      type: 'textarea',
      required: true,
    },
    {
      name: 'tripReference',
      type: 'relationship',
      relationTo: 'tours',
      admin: {
        description: 'The tour this review is about (optional).',
      },
    },
    {
      name: 'consentRef',
      type: 'text',
      required: true,
      admin: {
        description: 'Consent record reference. CONT-02: no review may be invented without consent.',
      },
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: { position: 'sidebar' },
    },
    {
      name: 'published',
      type: 'checkbox',
      defaultValue: false,
      index: true,
      admin: { position: 'sidebar' },
    },
  ],
  timestamps: true,
};
