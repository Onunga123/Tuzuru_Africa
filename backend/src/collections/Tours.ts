import type { CollectionConfig } from 'payload'

export const Tours: CollectionConfig = {
  slug: 'tours',
  admin: {
    group: 'Content',
    useAsTitle: 'title',
    defaultColumns: ['title', 'featured', 'days', 'status'],
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
    { name: 'title', type: 'text', required: true },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: { description: 'URL identifier, lowercase and hyphenated, e.g. 7-day-masai-mara-safari' },
    },
    {
      name: 'destination',
      type: 'relationship',
      relationTo: 'destinations',
      admin: { description: 'Primary destination this tour belongs to' },
    },
    {
      name: 'destinationLabel',
      type: 'text',
      admin: { description: 'Display string kept separately from the relationship' },
    },
    { name: 'duration', type: 'text', admin: { description: 'Human-readable duration, e.g. 7 days / 6 nights' } },
    { name: 'days', type: 'number' },
    { name: 'image', type: 'upload', relationTo: 'media' },
    { name: 'imageAlt', type: 'text' },
    {
      name: 'experiences',
      type: 'relationship',
      relationTo: 'experiences',
      hasMany: true,
    },
    { name: 'featured', type: 'checkbox', defaultValue: false },
    { name: 'overview', type: 'textarea' },
    {
      name: 'highlights',
      type: 'array',
      fields: [{ name: 'highlight', type: 'text' }],
    },
    {
      name: 'itinerary',
      type: 'array',
      fields: [
        { name: 'day', type: 'text' },
        { name: 'title', type: 'text' },
        { name: 'detail', type: 'textarea' },
      ],
    },
    { name: 'accommodation', type: 'textarea' },
    { name: 'transport', type: 'textarea' },
    {
      name: 'inclusions',
      type: 'array',
      fields: [{ name: 'inclusion', type: 'text' }],
    },
    {
      name: 'exclusions',
      type: 'array',
      fields: [{ name: 'exclusion', type: 'text' }],
    },
    { name: 'important', type: 'textarea' },
    {
      name: 'priceBasis',
      type: 'text',
      defaultValue: 'On request',
      admin: { description: 'No prices exist in the seed data (CONT-02) - tours show a price basis instead' },
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
