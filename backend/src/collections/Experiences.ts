import type { CollectionConfig } from 'payload'

export const Experiences: CollectionConfig = {
  slug: 'experiences',
  admin: {
    group: 'Content',
    useAsTitle: 'name',
    defaultColumns: ['name', 'icon', 'sortOrder', 'image'],
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: { description: 'URL identifier, lowercase and hyphenated, e.g. gorilla-trekking' },
    },
    { name: 'icon', type: 'text', admin: { description: 'Icon key rendered by the frontend experience categories grid' } },
    { name: 'image', type: 'upload', relationTo: 'media' },
    { name: 'blurb', type: 'textarea' },
    { name: 'detail', type: 'textarea' },
    { name: 'sortOrder', type: 'number', defaultValue: 0 },
  ],
}
