import type { CollectionConfig } from 'payload'

export const Guides: CollectionConfig = {
  slug: 'guides',
  admin: {
    group: 'Content',
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'status', 'date'],
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
    { name: 'slug', type: 'text', required: true, unique: true, index: true, admin: { description: 'Frontend route identifier - /travel-guides/:slug' } },
    { name: 'title', type: 'text', required: true },
    {
      name: 'category',
      type: 'select',
      options: ['Seasonal planning', 'Destinations', 'Practical advice'],
      required: true,
    },
    { name: 'image', type: 'upload', relationTo: 'media', required: true },
    { name: 'imageAlt', type: 'text', admin: { description: 'Alt text travels with the record' } },
    { name: 'date', type: 'date', required: true, admin: { description: 'Editorial date shown on the guide page' } },
    { name: 'lastUpdated', type: 'date', admin: { description: 'PAGE-19 editorial last-updated date - mapping lists guide updatedAt' } },
    { name: 'readingTime', type: 'text', admin: { description: 'Mapping: text now, computed later - decision pending' } },
    { name: 'excerpt', type: 'textarea', required: true },
    { name: 'content', type: 'richText', required: true },
    { name: 'socialImage', type: 'upload', relationTo: 'media', admin: { description: 'PAGE-19 sharing image - falls back to image' } },
    { name: 'relatedDestinations', type: 'relationship', relationTo: 'destinations', hasMany: true },
    {
      name: 'status',
      type: 'select',
      options: ['draft', 'published'],
      defaultValue: 'draft',
      required: true,
    },
  ],
}




