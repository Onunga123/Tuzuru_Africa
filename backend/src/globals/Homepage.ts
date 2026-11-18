import type { GlobalConfig } from 'payload'

export const Homepage: GlobalConfig = {
  slug: 'homepage',
  label: 'Homepage',
  admin: {
    group: 'Global Content',
    description: 'Hero, intro and featured sections of the landing page.',
  },
  access: {
    read: () => true,
    update: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      name: 'heroTitle',
      type: 'text',
      label: 'Hero Title',
      required: true,
      maxLength: 120,
    },
    {
      name: 'heroSubtitle',
      type: 'textarea',
      label: 'Hero Subtitle',
      maxLength: 400,
    },
    {
      name: 'heroImage',
      type: 'upload',
      label: 'Hero Image',
      relationTo: 'media',
    },
    {
      name: 'heroCtaLabel',
      type: 'text',
      label: 'Hero CTA Label',
      maxLength: 60,
    },
    {
      name: 'heroCtaHref',
      type: 'text',
      label: 'Hero CTA Link',
      maxLength: 200,
    },
    {
      name: 'introTitle',
      type: 'text',
      label: 'Intro Title',
      maxLength: 120,
    },
    {
      name: 'introBody',
      type: 'textarea',
      label: 'Intro Body',
      maxLength: 1200,
    },
    {
      name: 'featuredExperiencesHeading',
      type: 'text',
      label: 'Featured Experiences Heading',
      maxLength: 120,
    },
    {
      name: 'featuredExperiences',
      type: 'array',
      label: 'Featured Experiences',
      maxRows: 6,
      fields: [
        {
          name: 'experience',
          type: 'relationship',
          label: 'Experience',
          relationTo: 'experiences',
          required: true,
        },
      ],
    },
    {
      name: 'featuredToursHeading',
      type: 'text',
      label: 'Featured Tours Heading',
      maxLength: 120,
    },
    {
      name: 'featuredTours',
      type: 'array',
      label: 'Featured Tours',
      maxRows: 6,
      fields: [
        {
          name: 'tour',
          type: 'relationship',
          label: 'Tour',
          relationTo: 'tours',
          required: true,
        },
      ],
    },
    {
      name: 'ctaBannerTitle',
      type: 'text',
      label: 'CTA Banner Title',
      maxLength: 120,
    },
    {
      name: 'ctaBannerBody',
      type: 'textarea',
      label: 'CTA Banner Body',
      maxLength: 400,
    },
    {
      name: 'ctaBannerLabel',
      type: 'text',
      label: 'CTA Banner Button Label',
      maxLength: 60,
    },
    {
      name: 'ctaBannerHref',
      type: 'text',
      label: 'CTA Banner Button Link',
      maxLength: 200,
    },
  ],
}