import type { CollectionConfig } from 'payload'

export const TravelSeasons: CollectionConfig = {
  slug: 'travel-seasons',
  admin: {
    group: 'Content',
    useAsTitle: 'name',
    defaultColumns: ['name', 'months', 'crowdLevel', 'priceBand'],
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    { name: 'name', type: 'text', label: 'Season Name', required: true, maxLength: 120 },
    { name: 'months', type: 'text', label: 'Months', maxLength: 60 },
    { name: 'description', type: 'textarea', label: 'Description', maxLength: 1000 },
    { name: 'highlights', type: 'textarea', label: 'Highlights', maxLength: 500 },
    { name: 'weather', type: 'textarea', label: 'Weather', maxLength: 500 },
    { name: 'bestFor', type: 'text', label: 'Best For', maxLength: 300 },
    {
      name: 'crowdLevel',
      type: 'select',
      label: 'Crowd Level',
      options: ['quiet', 'moderate', 'busy'],
      required: true,
    },
    {
      name: 'priceBand',
      type: 'select',
      label: 'Price Band',
      options: ['Best value', 'Mid season', 'Premium'],
      required: true,
    },
    { name: 'image', type: 'upload', relationTo: 'media', required: true },
    { name: 'sortOrder', type: 'number', label: 'Sort Order' },
  ],
}
