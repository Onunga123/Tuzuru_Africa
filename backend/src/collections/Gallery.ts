import type { CollectionConfig } from 'payload'

export const Gallery: CollectionConfig = {
  slug: 'gallery',
  admin: {
    group: 'Content',
    useAsTitle: 'caption',
    defaultColumns: ['image', 'caption', 'category', 'licenceStatus'],
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    { name: 'image', type: 'upload', relationTo: 'media', required: true },
    { name: 'alt', type: 'text', admin: { description: 'Alt text travels with the record' } },
    { name: 'caption', type: 'text' },
    {
      name: 'category',
      type: 'select',
      options: ['Safari & Wildlife', 'Beach & Coast', 'Nature & Landscapes', 'Adventure', 'City & Food', 'Culture & Community'],
      required: true,
    },
    {
      name: 'destination',
      type: 'relationship',
      relationTo: 'destinations',
    },
    { name: 'credit', type: 'text' },
    {
      name: 'licenceStatus',
      type: 'select',
      options: ['owner-approved-interim', 'licensed', 'permission'],
      required: true,
      admin: { description: 'Imagery licence governance (DL-009) - no default by design' },
    },
    {
      name: 'permission',
      type: 'textarea',
      admin: { description: 'Licence/permission note kept with the record (DL-009)' },
    },
  ],
}
