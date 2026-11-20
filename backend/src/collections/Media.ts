import type { CollectionConfig, FieldAccess } from 'payload'

// CHG-017 — media provenance (media.json / MR-05 asset manifest).
// Media read is public, so every provenance field carries a field-level read
// lock: anonymous REST/GraphQL responses omit these fields entirely. They are
// CMS-only per seed/README.md and MIGRATION.md section 6.7 — never rendered publicly.
const internalOnlyRead: FieldAccess = ({ req: { user } }) => Boolean(user)

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true,
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
    {
      name: 'origin',
      type: 'text',
      access: { read: internalOnlyRead },
      admin: {
        description: 'Internal. Asset origin (owner-approved-interim or owner-supplied). Never exposed publicly.',
      },
    },
    {
      name: 'credit',
      type: 'textarea',
      access: { read: internalOnlyRead },
      admin: {
        description: 'Internal. Credit line. Empty for interim assets (DL-009); populated when real photographer credit exists.',
      },
    },
    {
      name: 'licence',
      type: 'textarea',
      access: { read: internalOnlyRead },
      admin: {
        description: 'Internal. Licence statement for this asset.',
      },
    },
    {
      name: 'licenceStatus',
      type: 'select',
      options: ['owner-approved-interim', 'licensed', 'permission'],
      access: { read: internalOnlyRead },
      admin: {
        description: 'Internal. Licence status; shares the gallery licenceStatus vocabulary.',
      },
    },
    {
      name: 'permissionRef',
      type: 'text',
      access: { read: internalOnlyRead },
      admin: {
        description: 'Internal. Pointer to the approval record (e.g. DL-009 owner approval, 2026-11-11).',
      },
    },
  ],
  upload: true,
}
