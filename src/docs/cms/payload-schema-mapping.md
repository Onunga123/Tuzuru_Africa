# MR-02 — Schema alignment with the target Payload CMS

Types live in `src/lib/cms/types.js`. Field counts follow the master requirements document; the
field lists below are the proposed exact Payload shapes, built from the current seed data plus the
documented count. **Owner/architect confirmation of each field list against the master document is
required before the Payload scaffold is written.**

## Mapping table

### Tours — 21 documented fields

| Current seed field | Target Payload field | Status |
|---|---|---|
| `slug` | `slug` (unique, indexed) | matches |
| `title` | `title` | matches |
| `destination` (display string) | `destinationLabel` | **mismatch** — display text kept separately from the relationship |
| `destinationSlug` | `destination` (relationship → `destinations`) | **mismatch** — string slug becomes a relationship |
| `duration` (e.g. "7 days / 6 nights") | `duration` (text) | matches |
| `days` (number) | `days` (number) | matches |
| `imageKey` | `image` (upload → media) | **mismatch** — key becomes an upload relationship |
| — (alt derived from media register) | `imageAlt` (text) | **new field** — alt travels with the record |
| `experiences` (names) | `experiences` (relationship, hasMany → `experiences`) | **mismatch** — names become relationships |
| `featured` (boolean) | `featured` (checkbox) | matches |
| `overview` | `overview` (textarea) | matches |
| `highlights` (string[]) | `highlights` (array of text) | matches |
| `itinerary` ({day,title,detail}[]) | `itinerary` (array of group: day, title, detail) | matches |
| `accommodation` | `accommodation` (textarea) | matches |
| `transport` | `transport` (textarea) | matches |
| `inclusions` (string[]) | `inclusions` (array of text) | matches |
| `exclusions` (string[]) | `exclusions` (array of text) | matches |
| `important` | `important` (textarea) | matches |
| — | `priceBasis` (text, default "On request") | **new field** — no prices exist (CONT-02) |
| — | `status` (select: draft/published) | **new field** — draft/publish workflow (CMS-16) |
| — | `createdAt` / `updatedAt` | Payload system fields |

### Destinations — 14 documented fields

| Current seed field | Target Payload field | Status |
|---|---|---|
| `slug` | `slug` | matches |
| `name` | `name` | matches |
| `country` | `country` | matches |
| `region` | `region` | matches |
| `imageKey` | `image` (upload) | **mismatch** (key → upload) |
| — | `imageAlt` | **new field** |
| `tagline` | `tagline` | matches |
| `intro` | `intro` (textarea) | matches |
| `description` | `description` (rich text) | **mismatch** — plain text becomes rich text |
| `attractions` (string[]) | `attractions` (array of text) | matches |
| `bestTime` | `bestTime` (textarea) | matches |
| `travelInfo` | `travelInfo` (textarea) | matches |
| `related` (slugs) | `relatedTours` (relationship hasMany → `tours`) | **mismatch** — slugs become relationships |
| — | `status` (draft/published) | **new field** |

### Experiences — 7 documented fields

`slug`, `name`, `icon` (text), `image` (upload ← `imageKey`), `blurb`, `detail`, `sortOrder`.
Status: matches after the key → upload conversion; `sortOrder` is currently implied by array order.

### Offers — 9 documented fields

**No offer records exist in the app today** (the documented "offers" surface is the tours
catalogue plus "price on request"). Proposed: `title`, `description`, `priceBasis`, `inclusions`,
`validFrom`, `validTo`, `image`, `status`, `sortOrder`. Automatic expiry (CMS-09) is implemented at
migration. Status: all fields new; no current data to map.

### Gallery — 8 documented fields

| Current seed field | Target Payload field | Status |
|---|---|---|
| `id` (`g1`…`g12`) | Payload `id` | **mismatch** — string ids replaced by database ids |
| `imageKey` | `image` (upload) | **mismatch** |
| — | `alt` (text) | **new field** — currently derived in the media module |
| `caption` | `caption` | matches |
| `category` | `category` (select) | matches |
| `destination` (display name) | `destination` (relationship) | **mismatch** |
| `credit` | `credit` (text) | matches |
| `licenceStatus` | `licenceStatus` (select) + `permission` (upload/text) | **mismatch** — one field becomes two |

### Reviews — 6 documented fields

**No review records exist and none may be invented (CONT-02).** Proposed: `authorName`, `quote`,
`tripReference`, `consentRef`, `publishedAt`, `published`. Status: new collection, no data.

### Travel Guides — 13 documented fields

| Current seed field | Target Payload field | Status |
|---|---|---|
| `slug` | `slug` | matches |
| `title` | `title` | matches |
| `category` | `category` (select) | matches |
| `imageKey` | `image` (upload) | **mismatch** |
| — | `imageAlt` | **new field** |
| `date` (string) | `date` (date) | **mismatch** — string becomes a date field |
| — | `updatedAt` (date, editable) | **new field** — PAGE-19 last-updated handling |
| `readingTime` (text) | `readingTime` (text, or computed) | matches / pending decision |
| `excerpt` | `excerpt` (textarea) | matches |
| `content` ({heading,body}[]) | `content` (rich text) | **mismatch** — structured blocks become rich text |
| — | `socialImage` (upload) | **new field** — PAGE-19 sharing |
| — | `relatedDestinations` (relationship hasMany) | **new field** |
| — | `status` (draft/published) | **new field** — only reviewed guides publish (PAGE-18) |

### Enquiries — 20 fields + 9 statuses

Current `Enquiry` collection carries 22 fields: the 20 traveller-facing fields plus `assigned_to`
and `staff_notes`. Target Payload: the 20 documented fields, `status` (select over the 9 values
`new`, `under_review`, `awaiting_customer`, `quotation_sent`, `follow_up`, `booking_requested`,
`confirmed`, `closed`, `unserviceable`), plus the two staff fields, with
`reference_number` unique and indexed. Controlled transitions and the explicit authorised action
for `confirmed` are implemented at migration (CMS-13).

### Globals

`SiteSettings` (contact, hours, notes, social links), `Homepage` (hero + CTA copy), `Navigation`
(primary, secondary, mobile extras, CTAs) and `Footer` (link groups) map one-to-one to
`src/lib/cms/settings.js` — see `settings-globals.md`.

## Summary of mismatches to resolve in the Payload scaffold

1. Media: `imageKey` strings → upload relationships; alt text moves onto the record.
2. Relationships: display strings and slug arrays → Payload relationships (tours→destinations,
   tours→experiences, guides→destinations, gallery→destinations).
3. Rich text: destination `description` and guide `content` blocks → rich text fields.
4. Identifiers: gallery string ids and tour/destination slugs → database ids with unique slugs.
5. Workflow fields that do not exist yet: `status` on tours, destinations, guides, offers; `priceBasis`.
6. New content fields the frontend will need: `imageAlt`, `socialImage`, `relatedDestinations`,
   guide `updatedAt`.
