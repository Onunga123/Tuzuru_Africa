# MR-01 — Data-dependency map

What each page and component used to read, and what it reads now. Every entry resolves through
`@/lib/cms` (`src/lib/cms/index.js`), the single data-access module. No page or component holds a
content array or calls an entity method.

## Module surface

| Export group | Exports |
|---|---|
| Content (seed today, Payload at migration) | `tours`, `destinations`, `experiences`, `guides`, `gallery`, `faqGroups`, `whyTuzuru`, `discoveryPaths`, `WILDLIFE_CALENDAR`, `seasonCalendar`, `seasonRelatedLinks`, `tourDurationFilters` |
| Accessors | `getTours`, `getTour`, `getDestinations`, `getDestination`, `getExperiences`, `getGuides`, `getGuide`, `getGallery`, `getFaqGroups`, `getWhyTuzuru`, `getDiscoveryPaths`, `getTourDurationFilters`, `getSeasonCalendar`, `getWildlifeCalendar`, `toursByDestination`, `findTour`, `findDestination`, `findGuide`, `formatDate` |
| Async reads | `getTravelSeasons()` — the only collection read in the app (preview adapter for the interim `TravelSeason` collection; becomes a Payload read of `travel-seasons`) |
| Settings / globals | `siteSettings` (alias `site`), `navigation`, `footer`, `homepage` |
| Media | `IMAGES`/`images`, `mediaUrl(key)`, `getImage(key)`, `withMedia(record)`, `getAssetManifest()`, `LOGO_URL` |
| Enquiry | `submitEnquiry(data)`, `validateEnquiry(data, {compact})`, `emptyEnquiry`, `ENQUIRY_FIELDS`, `ENQUIRY_STATUSES`, `ENQUIRY_OPTIONS`, `REFERENCE_PATTERN` |
| Types | `src/lib/cms/types.js` — JSDoc typedefs for the Payload collections and globals |

## Pages

| Page | Content it reads | Was | Now |
|---|---|---|---|
| Home | section composition only | components import content directly | components import `@/lib/cms` |
| Tours | `tours` (filtered in `TourFilters`) | `@/data/content` | `@/lib/cms` |
| TourDetail | `findTour`, `toursByDestination` | `@/data/content` | `@/lib/cms` |
| Destinations / DestinationDetail | `destinations`, `findDestination`, `toursByDestination` | `@/data/content` | `@/lib/cms` |
| Experiences | `experiences` | `@/data/content` | `@/lib/cms` |
| Gallery | `gallery`, `IMAGES.zanzibar` | `@/data/content` | `@/lib/cms` |
| TravelGuides / TravelGuideDetail | `guides`, `findGuide`, `formatDate`, `IMAGES` | `@/data/content` | `@/lib/cms` |
| WhenToTravel | `TravelSeason` collection (queried inline), inline 4-item calendar array, `IMAGES.seasons` | `@/data/content` + SDK query in the page | `getTravelSeasons()`, `seasonCalendar`, `seasonRelatedLinks`, `IMAGES` |
| WildlifeCalendar | `WILDLIFE_CALENDAR` with hardcoded image URLs | `@/data/wildlifeCalendar` | `@/lib/cms` (media resolved from keys) |
| Faqs | `faqGroups`, `IMAGES.vehicle`, `site` | `@/data/content` | `@/lib/cms` |
| PlanYourTrip / Contact | `site`, `IMAGES`, `EnquiryForm` | `@/data/content` | `@/lib/cms` |
| EnquiryConfirmation | `site` | `@/data/content` | `@/lib/cms` |
| About | `IMAGES`, `whyTuzuru`-style values copy | `@/data/content` | `@/lib/cms` |
| PrivacyPolicy / TermsOfUse / BookingPolicy | `IMAGES` for page heroes | `@/data/content` | `@/lib/cms` |
| NotFound | `IMAGES.serengeti` | `@/data/content` | `@/lib/cms` |

## Components

| Component | Content it used to hold or read | Now |
|---|---|---|
| `layout/SiteHeader` | hardcoded `NAV` array; inline mobile menu array; hardcoded Contact link and CTA labels | `navigation.primary` / `.secondary` / `.mobileExtra` / `.cta` / `.mobileCta` |
| `layout/SiteFooter` | hardcoded `EXPLORE` / `COMPANY` / `LEGAL` arrays and a hardcoded logo URL | `footer.explore` / `.company` / `.legal`, `LOGO_URL`, `site` |
| `layout/BrandMark` | hardcoded logo URL constant | `LOGO_URL` from the media module |
| `home/Hero` | hardcoded eyebrow, headline, intro, CTA labels; `IMAGES.hero` with a literal alt | `homepage.hero` + `getImage(hero.imageKey)` |
| `home/HomeCta` | hardcoded eyebrow, title, body, note | `homepage.cta` |
| `home/ExperienceCategories` | `experiences` | `experiences` (decorated with media) |
| `home/FeaturedTours` / `FeaturedDestinations` / `TravelInspiration` / `WhyTuzuru` | content arrays via `@/data/content` | same records via `@/lib/cms` |
| `tours/TourFilters` | hardcoded `DURATIONS` array + `destinations`/`experiences` | `tourDurationFilters`, `destinations`, `experiences` |
| `tours/TourCard`, `destinations/DestinationCard`, `seasons/SeasonCard` | record fields passed as props | unchanged — records arrive media-resolved |
| `enquiries/EnquiryForm` | 5 hardcoded option arrays, `base44.functions.invoke`, inline validation | `ENQUIRY_OPTIONS`, `emptyEnquiry`, `validateEnquiry`, `submitEnquiry` |

## Seed layer (not a component)

`src/data/content.js`, `src/data/media.js` and `src/data/wildlifeCalendar.js` hold the bundled
content that makes the export runnable locally (MR-08) and become the MR-09 seed files. They are
imported **only** by `src/lib/cms`. Records reference media by key (`imageKey`), never by URL.

## Known remainder (not MR-01 scope, recorded for ARC-11 / CMS-16)

- Long-form body copy inside `About`, `PrivacyPolicy`, `TermsOfUse`, `BookingPolicy` and `Faqs`
  page components is editorial text, not a content collection; it moves to Payload rich text at
  migration.
- `index.html` still contains absolute media URLs for the favicon and Open Graph image — a static
  document cannot read the media module at runtime. Replacement values are recorded in the asset
  manifest and must be regenerated at migration.
