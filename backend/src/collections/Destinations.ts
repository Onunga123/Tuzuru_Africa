import type { CollectionConfig } from 'payload'

export const Destinations: CollectionConfig = {
  slug: 'destinations',
  admin: {
    group: 'Content',
    useAsTitle: 'name',
    defaultColumns: ['name', 'country', 'region', 'status'],
  },
  access: {
    read: ({ req: { user } }) => {
      if (user) return true
      return { status: { equals: 'published' } }
    },
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
      admin: { description: 'URL identifier, lowercase and hyphenated, e.g. masai-mara' },
    },
    { name: 'country', type: 'text' },
    { name: 'region', type: 'text' },
    { name: 'image', type: 'upload', relationTo: 'media' },
    { name: 'imageAlt', type: 'text', admin: { description: 'Alt text travels with the record' } },
    { name: 'tagline', type: 'text' },
    { name: 'intro', type: 'textarea' },
    { name: 'description', type: 'richText' },
    {
      name: 'attractions',
      type: 'array',
      fields: [{ name: 'attraction', type: 'text' }],
    },
    { name: 'bestTime', type: 'textarea' },
    { name: 'travelInfo', type: 'textarea' },
    {
      name: 'relatedTours',
      type: 'relationship',
      relationTo: 'tours',
      hasMany: true,
      admin: { description: 'Cross-links to tours for related-tours blocks' },
    },
    {
      name: 'status',
      type: 'select',
      options: ['draft', 'published'],
      defaultValue: 'draft',
      required: true,
      admin: { position: 'sidebar' },
    },
  ],
}
