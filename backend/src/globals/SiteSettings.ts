import type { GlobalConfig } from 'payload'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site Settings',
  admin: {
    group: 'Global Content',
    description: 'Site-wide identity and contact details used across the TUZURU AFRICA website.',
  },
  access: {
    read: () => true,
    update: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      name: 'siteName',
      type: 'text',
      label: 'Site Name',
      required: true,
      defaultValue: 'TUZURU AFRICA',
    },
    {
      name: 'tagline',
      type: 'text',
      label: 'Tagline',
      maxLength: 120,
    },
    {
      name: 'aboutShort',
      type: 'textarea',
      label: 'Short About Text',
      maxLength: 600,
    },
    {
      name: 'contactEmail',
      type: 'email',
      label: 'Contact Email',
      required: true,
    },
    {
      name: 'contactPhone',
      type: 'text',
      label: 'Contact Phone',
    },
    {
      name: 'whatsappNumber',
      type: 'text',
      label: 'WhatsApp Number',
      admin: {
        description: 'International format, digits only, e.g. 254712345678.',
      },
    },
    {
      name: 'address',
      type: 'textarea',
      label: 'Physical Address',
      maxLength: 300,
    },
    {
      name: 'socials',
      type: 'array',
      label: 'Social Links',
      fields: [
        {
          name: 'platform',
          type: 'select',
          label: 'Platform',
          required: true,
          options: ['Instagram', 'Facebook', 'X', 'YouTube', 'TikTok', 'LinkedIn'],
        },
        {
          name: 'url',
          type: 'text',
          label: 'URL',
          required: true,
        },
      ],
    },
  ],
}