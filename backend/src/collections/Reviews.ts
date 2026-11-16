import type { CollectionConfig, Access } from 'payload';

// Dual-mode access on the `published` boolean (Reviews use a boolean gate, not a
// status enum). Authenticated admins see all; anonymous callers see only published.
const adminOrPublished: Access = ({ req: { user } }) => {
  if (user) return true;
  return { published: { equals: true } };
};

export const Reviews: CollectionConfig = {
  slug: 'reviews',
  labels: { singular: 'Review', plural: 'Reviews' },
  admin: {
    group: 'Content',
    useAsTitle: 'authorName',
    defaultColumns: ['authorName', 'published', 'publishedAt', 'tripReference'],
  },
  access: {
    read: adminOrPublished,
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
