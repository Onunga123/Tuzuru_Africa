// MR-02 â€” Types shaped on the target Payload CMS collections.
// These JSDoc definitions are the contract the migration will implement. Field counts follow
// the master requirements document; the current-seed â†’ Payload field mapping (and every
// mismatch) is recorded in src/docs/cms/payload-schema-mapping.md.

/**
 * Tour â€” Payload collection `tours` (21 documented fields).
 * @typedef {Object} Tour
 * @property {string} slug
 * @property {string} title
 * @property {string} destination
 * @property {string} destinationSlug
 * @property {string} duration
 * @property {number} days
 * @property {string} imageKey         Media key resolved by the media module
 * @property {string} [image] Resolved image URL attached by withMedia()
 * @property {string} imageAlt
 * @property {string} imageCredit
 * @property {string[]} experiences
 * @property {boolean} featured
 * @property {string} overview
 * @property {string[]} highlights
 * @property {{day:number,title:string,detail:string}[]} itinerary
 * @property {string} accommodation
 * @property {string} transport
 * @property {string[]} inclusions
 * @property {string[]} exclusions
 * @property {string} important
 * @property {string} priceBasis        "On request" until the owner supplies prices
 * @property {string} status            'published' | 'draft'
 */

/**
 * Destination â€” Payload collection `destinations` (14 documented fields).
 * @typedef {Object} Destination
 * @property {string} slug
 * @property {string} name
 * @property {string} country
 * @property {string} region
 * @property {string} imageKey
 * @property {string} imageAlt
 * @property {string} [image] Resolved image URL attached by withMedia()
 * @property {string} tagline
 * @property {string} intro
 * @property {string} description
 * @property {string[]} attractions
 * @property {string} bestTime
 * @property {string} travelInfo
 * @property {string[]} related
 * @property {string} status
 */

/**
 * Experience â€” Payload collection `experiences` (7 documented fields).
 * @typedef {Object} Experience
 * @property {string} slug
 * @property {string} name
 * @property {string} icon
 * @property {string} imageKey
 * @property {string} [image] Resolved image URL attached by withMedia()
 * @property {string} blurb
 * @property {string} detail
 * @property {number} sortOrder
 */

/**
 * Offer â€” Payload collection `offers` (9 documented fields).
 * No offer records exist in the current app; the collection is created at migration.
 * @typedef {Object} Offer
 * @property {string} title
 * @property {string} description
 * @property {string} priceBasis
 * @property {string[]} inclusions
 * @property {string} validFrom
 * @property {string} validTo
 * @property {string} imageKey
 * @property {string} status
 * @property {number} sortOrder
 */

/**
 * Gallery item â€” Payload collection `gallery` (8 documented fields).
 * @typedef {Object} GalleryItem
 * @property {string} id
 * @property {string} imageKey
 * @property {string} alt
 * @property {string} caption
 * @property {string} category
 * @property {string} destination
 * @property {string} credit
 * @property {string} licenceStatus  'owner-approved-interim' | 'licensed' | 'permission'
 */

/**
 * Review â€” Payload collection `reviews` (6 documented fields).
 * Only authorised, genuine reviews may be published; no records exist today.
 * @typedef {Object} Review
 * @property {string} authorName
 * @property {string} quote
 * @property {string} tripReference
 * @property {string} consentRef
 * @property {string} publishedAt
 * @property {boolean} published
 */

/**
 * Travel guide â€” Payload collection `travel-guides` (13 documented fields).
 * @typedef {Object} TravelGuide
 * @property {string} slug
 * @property {string} title
 * @property {string} category
 * @property {string} imageKey
 * @property {string} [image] Resolved image URL attached by withMedia()
 * @property {string} imageAlt
 * @property {string} date
 * @property {string} updatedAt
 * @property {string} readingTime
 * @property {string} excerpt
 * @property {{heading:string,body:string}[]} content
 * @property {string[]} relatedDestinations
 * @property {string} status
 * @property {string} author
 */

/**
 * Travel season — Base44 TravelSeason collection / Payload travel-seasons collection.
 * @typedef {Object} TravelSeason
 * @property {string} [id]
 * @property {string} name
 * @property {string} months
 * @property {string} description
 * @property {string} [highlights]
 * @property {string} [weather]
 * @property {string} [best_for]
 * @property {string} [price_band]
 * @property {string} [crowd_level]
 * @property {string} [image]
 */

/**
 * Wildlife calendar entry.
 * @typedef {Object} WildlifeCalendarEntry
 * @property {string} species
 * @property {string} where
 * @property {string} when
 * @property {string} note
 * @property {string} imageKey
 * @property {string} [image] Resolved image URL attached by withMedia()
 */

/**
 * Enquiry â€” Payload collection `enquiries` (20 fields, 9 statuses).

 * @typedef {Object} Enquiry
 * @property {string} reference_number
 * @property {string} full_name
 * @property {string} email
 * @property {string} phone
 * @property {string} country
 * @property {string} destinations
 * @property {string} related_tour
 * @property {string} travel_dates
 * @property {number} adults
 * @property {string} children
 * @property {string} duration
 * @property {string} budget
 * @property {string} currency
 * @property {string} accommodation_preference
 * @property {string} travel_style
 * @property {string} enquiry_type
 * @property {string} contact_preference
 * @property {string} message
 * @property {boolean} privacy_acknowledged
 * @property {string} status
 */

/**
 * SiteSettings global.
 * @typedef {Object} SiteSettings
 * @property {string} name
 * @property {string} tagline
 * @property {string} shortDescription
 * @property {string} phone
 * @property {string} whatsapp
 * @property {string} whatsappLink
 * @property {string} email
 * @property {string} location
 * @property {string} hours
 * @property {string} contactNote
 * @property {string} draftNotice
 * @property {{label:string,url:string}[]} socialLinks
 */

export const COLLECTIONS = [
  'tours',
  'destinations',
  'experiences',
  'offers',
  'gallery',
  'reviews',
  'travel-guides',
  'enquiries',
];

export const GLOBALS = ['site-settings', 'homepage', 'navigation', 'footer'];

