import type { CollectionConfig } from 'payload'

export const WildlifeCalendar: CollectionConfig = {
  slug: 'wildlife-calendar',
  admin: {
    group: 'Content',
    useAsTitle: 'species',
    defaultColumns: ['species', 'when', 'image'],
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    { name: 'species', type: 'text', label: 'Species', required: true, maxLength: 120 },
    { name: 'where', type: 'text', label: 'Where', maxLength: 300 },
    { name: 'when', type: 'text', label: 'When', maxLength: 300 },
    { name: 'note', type: 'textarea', label: 'Note', maxLength: 600 },
    { name: 'image', type: 'upload', relationTo: 'media', required: true },
  ],
}
