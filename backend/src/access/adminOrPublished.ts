import type { Access } from 'payload'

/**
 * CHG-016: shared read rule. Authenticated users see everything;
 * anonymous visitors only see documents whose status field is 'published'.
 * Used by: Offers, Destinations, Guides, Tours.
 */
export const adminOrPublished: Access = ({ req: { user } }) => {
  if (user) return true
  return { status: { equals: 'published' } }
}
