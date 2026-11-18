import type { GlobalConfig } from 'payload'

export const Footer: GlobalConfig = {
  slug: 'footer',
  label: 'Footer',
  admin: {
    group: 'Global Content',
    description: 'Footer link columns and legal line rendered site-wide.',
  },
  access: {
    read: () => true,
    update: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      name: 'columns',
      type: 'array',
      label: 'Link Columns',
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Column Title',
          required: true,
          maxLength: 60,
        },
        {
          name: 'links',
          type: 'array',
          label: 'Links',
          fields: [
            {
              name: 'label',
              type: 'text',
              label: 'Label',
              required: true,
              maxLength: 80,
            },
            {
              name: 'href',
              type: 'text',
              label: 'Link',
              required: true,
              maxLength: 200,
            },
          ],
        },
      ],
    },
    {
      name: 'copyright',
      type: 'text',
      label: 'Copyright Line',
      maxLength: 200,
    },
    {
      name: 'privacyNote',
      type: 'textarea',
      label: 'Privacy / Legal Note',
      maxLength: 500,
    },
  ],
}