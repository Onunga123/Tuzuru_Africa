import type { Access } from 'payload'

/**
 * CHG-016: Reviews variant. Visibility is governed by the boolean
 * published approval flag (no drafts system). Named differently from
 * adminOrPublished on purpose: different field, different rule.
 */
export const adminOrApproved: Access = ({ req: { user } }) => {
  if (user) return true
  return { published: { equals: true } }
}
