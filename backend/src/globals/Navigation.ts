import type { GlobalConfig } from 'payload'

export const Navigation: GlobalConfig = {
  slug: 'navigation',
  label: 'Navigation',
  admin: {
    group: 'Global Content',
    description: 'Main menu items rendered in the site header.',
  },
  access: {
    read: () => true,
    update: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      name: 'items',
      type: 'array',
      label: 'Menu Items',
      fields: [
        {
          name: 'label',
          type: 'text',
          label: 'Label',
          required: true,
          maxLength: 60,
        },
        {
          name: 'href',
          type: 'text',
          label: 'Link',
          required: true,
          maxLength: 200,
          admin: {
            description: 'Internal path like /experiences or a full URL.',
          },
        },
        {
          name: 'openInNewTab',
          type: 'checkbox',
          label: 'Open in New Tab',
          defaultValue: false,
        },
      ],
    },
  ],
}