# Seed data for the Payload import (MR-09)

Generated from the content layer — do not edit by hand. Regenerate with:

```bash
node scripts/export-seed.mjs
```

Sources: `src/data/content.js`, `src/data/wildlifeCalendar.js`, `src/data/media.js`,
`src/lib/cms/settings.js`, plus `travel-seasons.json` exported from the interim collection.

| File | Rows | Target Payload collection / global |
|---|---|---|
| `media.json` | 19 | `media` (upload) |
| `destinations.json` | — | `destinations` |
| `experiences.json` | — | `experiences` |
| `tours.json` | — | `tours` |
| `guides.json` | — | `travel-guides` |
| `gallery.json` | 12 | `gallery` |
| `faqs.json` | — | `faqs` (grouped) |
| `wildlife-calendar.json` | — | `wildlife-calendar` |
| `travel-seasons.json` | 4 | `travel-seasons` |
| `home-content.json` | 2 groups | `homepage` supporting content (`whyTuzuru`, `discoveryPaths`) |
| `site-settings.json` | 1 | global `site-settings` |
| `navigation.json` | 1 | global `navigation` |
| `footer.json` | 1 | global `footer` |
| `homepage.json` | 1 | global `homepage` |

## Import order

`media` → `destinations` → `experiences` → `tours` → `travel-guides` → `gallery` →
`travel-seasons` → `wildlife-calendar` → `faqs` → globals → `homepage` supporting content.

Relationships must resolve by slug or filename, not by index:

1. `tours[].destinationSlug` → `destinations.slug`
2. `tours[].experiences[]` (names) → `experiences.name`
3. `guides[].relatedDestinations` (when present) → `destinations.slug`
4. every `imageKey` / `image` field → the `media` record whose filename matches `media.json[].filename`
5. `gallery[].destination` (display name) → `destinations.name`

## Field handling

- **Media keys, not URLs.** Every record stores a key (`imageKey`), never a host URL. Import maps
  the key to the uploaded media record and discards the interim URL.
- **Provenance stays internal.** `media.json` carries `origin`, `credit`, `licence`,
  `licenceStatus` and `permissionRef` as CMS-only fields. Interim imagery is
  `owner-approved-interim` under DL-009 — no launch flags and no public wording. Do not expose
  these fields through the public API or render them on the site.
- **Credit line.** Interim assets have an empty `credit`, so no credit line renders. Populate it
  when real photographer credit exists.
- **Alt text** travels with each media record and is stored on the media document, not on the
  content record (the content copy is a convenience for the current frontend).
- **Dates** are ISO strings in the seed (`date`, `updatedAt`); Payload stores them as `date` fields.
- **Rich text.** `destinations[].description` and `guides[].content` blocks convert to the Payload
  rich-text field; the block structure (`heading` / `body`) maps to heading + paragraph nodes.
- **Draft flags.** Any `draft: true` marker in the seed is content awaiting owner verification
  (CONT-02) — it is not imagery. Resolve the content before publishing those records.

## Verification after import

Row counts match the table above, every relationship resolves, and no record holds a host URL:

```bash
grep -c "base44" seed/*.json   # must be 0
node scripts/verify-seed.mjs   # optional: checks keys resolve against media.json filenames
```
