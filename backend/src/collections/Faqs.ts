import type { CollectionConfig } from 'payload'

export const Faqs: CollectionConfig = {
  slug: 'faqs',
  admin: {
    group: 'Content',
    useAsTitle: 'question',
    defaultColumns: ['group', 'question', 'sortOrder'],
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    { name: 'group', type: 'text', label: 'Group', required: true, maxLength: 120 },
    { name: 'question', type: 'text', label: 'Question', required: true, maxLength: 300 },
    { name: 'answer', type: 'textarea', label: 'Answer', required: true, maxLength: 1000 },
    { name: 'sortOrder', type: 'number', label: 'Sort Order' },
  ],
}
