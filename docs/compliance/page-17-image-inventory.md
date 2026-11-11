# PAGE-17 — Imagery authenticity, licensing and pipeline

Requirement: **PAGE-17** (imagery must be authentic and licensed; modern formats).
Prepared: 2026-11-11. Status: **IMPLEMENTED — awaiting owner verification** for the inventory, metadata and pipeline; content itself remains **OWNER INPUT REQUIRED**.

## 1. Inventory — every image on the site

Machine-readable source of truth: `src/data/media.js` (`MEDIA_REGISTER`). Every entry records `origin`, `licence`, `licenceStatus`, `permissionRef`, format and the places it is used.

| Key | File | Origin | Licence status | Used on |
|---|---|---|---|---|
| hero | `0e73a17ab_generated_3e4f374b.png` | — | owner-approved-interim | Home hero, Plan Your Trip hero |
| mara | `8043c2dce_generated_8aec397c.png` | — | owner-approved-interim | Maasai Mara card/detail, tour card, gallery g9 |
| serengeti | `acbe4249d_generated_ccdf88e4.png` | — | owner-approved-interim | Destinations, Serengeti detail, gallery g4, 404 background |
| zanzibar | `91c3c5c8c_generated_a24c6faf.png` | — | owner-approved-interim | Gallery hero, Zanzibar card/detail, gallery g2, tour card |
| capetown | `5fb9ffea2_generated_c368c047.png` | — | owner-approved-interim | Contact hero, Cape Town card/detail, gallery g6 |
| amboseli | `9c1edbb26_generated_a307dc8c.png` | — | owner-approved-interim | Amboseli card/detail, gallery g3, wildlife calendar |
| falls | `74036181e_generated_2b9fd5fb.png` | — | owner-approved-interim | Victoria Falls card/detail, gallery g5, wildlife calendar |
| migration | `5fe844ee7_generated_b157c766.png` | — | owner-approved-interim | Tours hero, migration tour card/detail, gallery g1, wildlife calendar hero |
| balloon | `3f8baa255_generated_0ec597dd.png` | — | owner-approved-interim | Experiences, balloon tour card/detail |
| gorilla | `103c1ed18_generated_e4fe55ee.png` | — | owner-approved-interim | Gorilla experience/tour, wildlife calendar |
| winelands | `31ba32625_generated_459e562f.png` | — | owner-approved-interim | Winelands experience/destination, gallery g10 |
| culture | `a866808d8_generated_4a431223.png` | — | owner-approved-interim | Culture experience/tour, gallery g7 |
| escape | `ee22b0ce3_generated_b79aeeec.png` | — | owner-approved-interim | Coastal escape content, gallery g11 |
| gorge | `afe7e8b73_generated_bf083df5.png` | — | owner-approved-interim | Booking Policy hero, gallery g8 |
| craft | `3dac8ab54_generated_f77d1b2d.png` | — | owner-approved-interim | Privacy Policy hero, About, Home "Why Tuzuru" |
| seasons | `e4732653a_generated_0993b46d.png` | — | owner-approved-interim | When to Travel hero, Travel Guides hero, wildlife calendar |
| door | `20fa20b65_generated_038afe97.png` | — | owner-approved-interim | Terms of Use hero, gallery g12, Swahili coast guide |
| vehicle | `37dacae69_generated_622978e6.png` | — | owner-approved-interim | FAQs hero, tours content |
| logo | `c105a5db7_tuzuru-africa-logo.jpeg` | Owner-supplied | permission (owner asset) | Header, footer, favicon, Open Graph image |

**Totals:** 19 image assets in use — 18 approved interim site images (all `owner-approved-interim`) and 1 owner-supplied brand asset. Status: **OWNER-APPROVED-INTERIM (DL-009, 2026-11-11)** — approved by the owner for publication; replacement through the Payload CMS after migration. No launch flags remain, and no wording about imagery (origin, placeholder status or approval state) appears anywhere on the public site.

## 2. Pipeline — current state (verified in code)

All content images render through the platform `Image` component (`src/components/ui/image.jsx` → `responsive-image.jsx` → `image-helpers.js`), which provides:

- **Modern formats:** transform URL requests `enc_auto`, so the image host negotiates **AVIF or WebP** based on the browser's `Accept` header, falling back to the original format. Source files are PNG/JPEG; delivery is negotiated per request.
- **Responsive sizes:** `srcset` at 1x/2x/3x device pixel ratios, sized to the rendered container, with server-side crop (`fill`, optional focal point) or contain (`fit`).
- **Lazy loading:** `loading="lazy"` on every rendered content image.
- **Failure handling:** a failed transform retries the original URL before falling back to a placeholder.

Defect found and fixed in this batch: `src/pages/NotFound.jsx` used a plain `<img>` (no srcset, no format negotiation, no lazy loading). It now uses the `Image` component.

Not converted: the logo is a raster JPEG rendered with a plain `<img>` in the header and footer, because it must not be re-encoded or cropped. Recommended follow-up (BRAND-02, Workstream D): supply an SVG or transparent PNG logo plus a square icon for favicon use.

## 3. Licence metadata on records

- `src/data/media.js` — new media register: `origin`, `licence`, `licenceStatus`, `permissionRef` per asset.
- `src/data/content.js` — every gallery record carries `credit`, `licence` and `licenceStatus` as Payload-ready structure. Under DL-009, interim assets carry no public credit line: the lightbox renders a credit only when a real photographer credit exists, so provenance stays internal.

This satisfies "no image published without a recorded licence status" at the data layer. A CMS-managed media/gallery collection with the same fields is the CMS-10 deliverable (Workstream D) and is not implemented yet.

## 4. Owner decision — DL-009 (2026-11-11)

**OWNER-APPROVED-INTERIM.** The current imagery is accepted as the approved interim site imagery. Consequences, all implemented:

- Every user-facing "AI-generated", "placeholder" or "requires approval" label, badge, caption suffix and wording is removed — including the gallery's illustrative-imagery note and the gallery lightbox credit line for interim assets.
- The media register, this inventory and the asset manifest carry `owner-approved-interim`; no launch flags remain in the code or in the MR-09 seed data.
- The credit / licence / permission fields are retained as Payload-ready structure and provenance stays internal.
- Replacement of any image (real or generated) happens through the Payload CMS once it is complete; no photography action is needed before migration, and the previous licensed-photography owner input is **withdrawn**.

This approval covers **imagery only**. Unverified prices, reviews, testimonials, business claims and service descriptions are unaffected and still require genuine content or removal (CONT-02).

PAGE-17 therefore closes against this decision: the pipeline is in place, every asset has a recorded status, and no imagery input is outstanding. PAGE-17's authentic-photography objective moves into the CMS replacement workflow (CMS-10).
