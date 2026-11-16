import type { CollectionConfig, Access } from 'payload';

// Dual-mode access: authenticated admins see all offers; anonymous callers see
// only published offers (the public catalogue surface).
const adminOrPublished: Access = ({ req: { user } }) => {
  if (user) return true;
  return { status: { equals: 'published' } };
};

export const Offers: CollectionConfig = {
  slug: 'offers',
  labels: { singular: 'Offer', plural: 'Offers' },
  admin: {
    group: 'Content',
    useAsTitle: 'title',
    defaultColumns: ['title', 'status', 'validFrom', 'validTo', 'priceBasis'],
  },
  access: {
    read: adminOrPublished,
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  // CMS-09 automatic expiry is implemented at migration (expired offers flipped to
  // draft when seed is imported). A runtime beforeRead expiry hook is migration-2.
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      index: true,
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'priceBasis',
      type: 'select',
      defaultValue: 'On request',
      admin: {
        description: 'CONT-02: default "On request" - no price invented without a source.',
      },
      options: [
        { label: 'On request', value: 'On request' },
        { label: 'Fixed price', value: 'Fixed' },
        { label: 'From', value: 'From' },
      ],
    },
    {
      name: 'inclusions',
      type: 'textarea',
    },
    {
      name: 'validFrom',
      type: 'date',
      admin: { position: 'sidebar' },
    },
    {
      name: 'validTo',
      type: 'date',
      admin: { position: 'sidebar' },
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'draft',
      index: true,
      admin: { position: 'sidebar' },
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
      ],
    },
    {
      name: 'sortOrder',
      type: 'number',
      defaultValue: 0,
      admin: { position: 'sidebar' },
    },
  ],
  timestamps: true,
};
