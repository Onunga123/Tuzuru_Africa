# MR-05 — Asset manifest

Generated from `src/lib/cms/media.js` + `src/data/media.js` (`getAssetManifest()`).
Every component references images by key through the media module; no component holds a host URL.
Changing `VITE_MEDIA_BASE_URL` (or the module's base) re-hosts all images at once.

Registered total: **19 assets** — 18 approved interim site images (`owner-approved-interim`,
DL-009, recorded 2026-11-11) and 1 owner-supplied brand asset (`permission`). No asset carries a
launch flag. Replacement of any image happens through the Payload CMS after migration (DL-009 f);
provenance recorded in this manifest stays internal and is never rendered on the public site.

| Key | File | Alt text | Credit | Licence status | Used on |
|---|---|---|---|---|---|
| hero | `0e73a17ab_generated_3e4f374b.png` | Elephants crossing golden savanna grassland at sunset | — | owner-approved-interim | Home hero, Plan Your Trip hero |
| mara | `8043c2dce_generated_8aec397c.png` | Acacia trees on golden grass in the Maasai Mara | — | owner-approved-interim | Maasai Mara card/detail, tour card, gallery g9 |
| serengeti | `acbe4249d_generated_ccdf88e4.png` | Open Serengeti plains at first light | — | owner-approved-interim | Destinations, Serengeti detail, gallery g4, 404 background |
| zanzibar | `91c3c5c8c_generated_a24c6faf.png` | A dhow on shallow turquoise water off Zanzibar | — | owner-approved-interim | Gallery hero, Zanzibar card/detail, gallery g2, tour card |
| capetown | `5fb9ffea2_generated_c368c047.png` | Table Mountain seen from the Cape Town harbour | — | owner-approved-interim | Contact hero, Cape Town card/detail, gallery g6 |
| amboseli | `9c1edbb26_generated_a307dc8c.png` | A family of elephants on the Amboseli plains | — | owner-approved-interim | Amboseli card/detail, gallery g3, wildlife calendar |
| falls | `74036181e_generated_2b9fd5fb.png` | Mist rising from the gorge at Victoria Falls | — | owner-approved-interim | Victoria Falls card/detail, gallery g5, wildlife calendar |
| migration | `5fe844ee7_generated_b157c766.png` | Herds moving across open Mara–Serengeti grassland | — | owner-approved-interim | Tours hero, migration tour card/detail, gallery g1, wildlife calendar hero |
| balloon | `3f8baa255_generated_0ec597dd.png` | A balloon above the Serengeti plains at dawn | — | owner-approved-interim | Experiences, balloon tour card/detail |
| gorilla | `103c1ed18_generated_e4fe55ee.png` | A mountain gorilla in the forest of Bwindi | — | owner-approved-interim | Gorilla experience/tour, wildlife calendar |
| winelands | `31ba32625_generated_459e562f.png` | Vine rows running toward the Cape mountains | — | owner-approved-interim | Winelands experience/destination, gallery g10 |
| culture | `a866808d8_generated_4a431223.png` | Beadwork and cloth at a Maasai homestead | — | owner-approved-interim | Culture experience/tour, gallery g7 |
| escape | `ee22b0ce3_generated_b79aeeec.png` | Palms along the northern Zanzibar coast at dusk | — | owner-approved-interim | Coastal escape content, gallery g11 |
| gorge | `afe7e8b73_generated_bf083df5.png` | The Zambezi river above Victoria Falls | — | owner-approved-interim | Booking Policy hero, gallery g8 |
| craft | `3dac8ab54_generated_f77d1b2d.png` | Craft and market detail from a coastal town | — | owner-approved-interim | Privacy Policy hero, About, Home "Why Tuzuru" |
| seasons | `e4732653a_generated_0993b46d.png` | Dry-season landscape under open sky | — | owner-approved-interim | When to Travel hero, Travel Guides hero, wildlife calendar |
| door | `20fa20b65_generated_038afe97.png` | A carved Swahili door in Stone Town | — | owner-approved-interim | Terms of Use hero, gallery g12, Swahili coast guide |
| vehicle | `37dacae69_generated_622978e6.png` | A safari vehicle on a bush track | — | owner-approved-interim | FAQs hero, tours content |
| logo | `c105a5db7_tuzuru-africa-logo.jpeg` | Tuzuru Africa | Tuzuru Africa | permission (owner asset) | Header, footer, favicon, Open Graph |

## Re-upload plan at migration

1. Export the 19 files from the interim media host (or use the owner's originals for the logo).
2. Upload into Payload `media`, keeping the key in `filename` or in a `legacyKey` field so the
   manifest stays traceable.
3. Replace the interim host base with the Payload media base (`VITE_MEDIA_BASE_URL`), then verify
   each page renders (the keys do not change, so nothing else needs editing).
4. Update `index.html` favicon and `og:image` to the new absolute URLs — the one place a static
   document needs literal URLs.
5. Image replacement after migration is a Payload media swap: replace the file, keep the key, and
   update the internal licence fields if the new asset has a licence or permission record. No
   frontend change and no layout or crop change.

## Status

Interim imagery is **OWNER-APPROVED-INTERIM (DL-009)** — approved for publication, replaced through
the Payload CMS after migration. No photography action is pending before migration, and the PAGE-17
owner input is withdrawn.

**OWNER INPUT REQUIRED (BRAND-02, still open):** a vector (SVG) or transparent PNG logo and a
square app icon — the current single JPEG is used for header, footer, favicon and social image,
which is why the favicon is a downscaled raster.
