// Media register — the single source of truth for image provenance and licensing.
// Requirement: PAGE-17. No image may be published without a recorded licence status.
//
// origin values:
//   'owner-approved-interim' — imagery approved by the owner for interim use (DL-009, 2026-11-11).
//   'owner-supplied'         — supplied directly by the owner (with permission on file).
//
// licenceStatus values:
//   'owner-approved-interim' — approved for publication by the owner; replacement happens through
//                              the Payload CMS after migration, so no photography action is pending.
//   'licensed'               — owner holds a licence or ownership record.
//   'permission'             — written permission held from the rights holder.
//
// Provenance recorded here is internal to this file and the compliance records. None of it is
// rendered on the public site (DL-009 e).

const INTERIM = {
  origin: 'owner-approved-interim',
  licence: 'Owner-approved interim imagery — replacement via Payload CMS (DL-009)',
  licenceStatus: 'owner-approved-interim',
  permissionRef: 'DL-009 — owner approval recorded 2026-11-11',
  credit: '',
};

export const MEDIA_REGISTER = {
  hero: {
    ...INTERIM,
    url: 'https://media.base44.com/images/public/6af2d158f0c17bb742b0ac03/0e73a17ab_generated_3e4f374b.png',
    subject: 'Savannah at dawn, generic',
    format: 'PNG (delivered as AVIF/WebP via transform pipeline)',
    usedOn: ['Home — hero', 'Plan Your Trip — page hero'],
  },
  mara: {
    ...INTERIM,
    url: 'https://media.base44.com/images/public/6af2d158f0c17bb742b0ac03/8043c2dce_generated_8aec397c.png',
    subject: 'Acacia and golden grass, Maasai Mara',
    format: 'PNG (delivered as AVIF/WebP)',
    usedOn: ['Maasai Mara destination card/detail', 'Gallery g9', 'Great Migration Safari card'],
  },
  serengeti: {
    ...INTERIM,
    url: 'https://media.base44.com/images/public/6af2d158f0c17bb742b0ac03/acbe4249d_generated_ccdf88e4.png',
    subject: 'Plains at first light, Serengeti',
    format: 'PNG (delivered as AVIF/WebP)',
    usedOn: ['Destinations page', 'Serengeti destination detail', 'Gallery g4', '404 page background'],
  },
  zanzibar: {
    ...INTERIM,
    url: 'https://media.base44.com/images/public/6af2d158f0c17bb742b0ac03/91c3c5c8c_generated_a24c6faf.png',
    subject: 'Dhow on shallow water, Zanzibar',
    format: 'PNG (delivered as AVIF/WebP)',
    usedOn: ['Gallery — page hero', 'Zanzibar destination card/detail', 'Gallery g2', 'Zanzibar Coast Retreat card'],
  },
  capetown: {
    ...INTERIM,
    url: 'https://media.base44.com/images/public/6af2d158f0c17bb742b0ac03/5fb9ffea2_generated_c368c047.png',
    subject: 'Table Mountain from the harbour, Cape Town',
    format: 'PNG (delivered as AVIF/WebP)',
    usedOn: ['Contact — page hero', 'Cape Town destination card/detail', 'Gallery g6'],
  },
  amboseli: {
    ...INTERIM,
    url: 'https://media.base44.com/images/public/6af2d158f0c17bb742b0ac03/9c1edbb26_generated_a307dc8c.png',
    subject: 'Elephant family on open plains, Amboseli',
    format: 'PNG (delivered as AVIF/WebP)',
    usedOn: ['Amboseli destination card/detail', 'Gallery g3', 'Wildlife calendar entry'],
  },
  falls: {
    ...INTERIM,
    url: 'https://media.base44.com/images/public/6af2d158f0c17bb742b0ac03/74036181e_generated_2b9fd5fb.png',
    subject: 'Mist above a gorge, Victoria Falls',
    format: 'PNG (delivered as AVIF/WebP)',
    usedOn: ['Victoria Falls destination card/detail', 'Gallery g5', 'Wildlife calendar entry'],
  },
  migration: {
    ...INTERIM,
    url: 'https://media.base44.com/images/public/6af2d158f0c17bb742b0ac03/5fe844ee7_generated_b157c766.png',
    subject: 'Herds crossing open grassland, Mara–Serengeti',
    format: 'PNG (delivered as AVIF/WebP)',
    usedOn: ['Tours — page hero', 'Great Migration Safari card/detail', 'Gallery g1', 'Wildlife Calendar — page hero'],
  },
  balloon: {
    ...INTERIM,
    url: 'https://media.base44.com/images/public/6af2d158f0c17bb742b0ac03/3f8baa255_generated_0ec597dd.png',
    subject: 'Balloon over plains, Serengeti',
    format: 'PNG (delivered as AVIF/WebP)',
    usedOn: ['Experiences page', 'Serengeti Balloon & Plains Safari card/detail'],
  },
  gorilla: {
    ...INTERIM,
    url: 'https://media.base44.com/images/public/6af2d158f0c17bb742b0ac03/103c1ed18_generated_e4fe55ee.png',
    subject: 'Mountain gorilla in forest',
    format: 'PNG (delivered as AVIF/WebP)',
    usedOn: ['Gorilla trekking experience/tour content', 'Wildlife calendar entry'],
  },
  winelands: {
    ...INTERIM,
    url: 'https://media.base44.com/images/public/6af2d158f0c17bb742b0ac03/31ba32625_generated_459e562f.png',
    subject: 'Vine rows toward mountains, Cape winelands',
    format: 'PNG (delivered as AVIF/WebP)',
    usedOn: ['Cape winelands experience/destination content', 'Gallery g10'],
  },
  culture: {
    ...INTERIM,
    url: 'https://media.base44.com/images/public/6af2d158f0c17bb742b0ac03/a866808d8_generated_4a431223.png',
    subject: 'Beadwork and cloth, Maasai homestead',
    format: 'PNG (delivered as AVIF/WebP)',
    usedOn: ['Culture & community experience/tour content', 'Gallery g7'],
  },
  escape: {
    ...INTERIM,
    url: 'https://media.base44.com/images/public/6af2d158f0c17bb742b0ac03/ee22b0ce3_generated_b79aeeec.png',
    subject: 'Palms at dusk, northern coast',
    format: 'PNG (delivered as AVIF/WebP)',
    usedOn: ['Coastal escape experience/tour content', 'Gallery g11'],
  },
  gorge: {
    ...INTERIM,
    url: 'https://media.base44.com/images/public/6af2d158f0c17bb742b0ac03/afe7e8b73_generated_bf083df5.png',
    subject: 'River above falls, Zambezi',
    format: 'PNG (delivered as AVIF/WebP)',
    usedOn: ['Booking Policy — page hero', 'Gallery g8'],
  },
  craft: {
    ...INTERIM,
    url: 'https://media.base44.com/images/public/6af2d158f0c17bb742b0ac03/3dac8ab54_generated_f77d1b2d.png',
    subject: 'Craft and market detail',
    format: 'PNG (delivered as AVIF/WebP)',
    usedOn: ['Privacy Policy — page hero', 'About page', 'Home — Why Tuzuru section'],
  },
  seasons: {
    ...INTERIM,
    url: 'https://media.base44.com/images/public/6af2d158f0c17bb742b0ac03/e4732653a_generated_0993b46d.png',
    subject: 'Landscape in dry season light',
    format: 'PNG (delivered as AVIF/WebP)',
    usedOn: ['When to Travel — page hero', 'Travel Guides — page hero', 'Wildlife calendar entry'],
  },
  door: {
    ...INTERIM,
    url: 'https://media.base44.com/images/public/6af2d158f0c17bb742b0ac03/20fa20b65_generated_038afe97.png',
    subject: 'Carved Swahili door, Stone Town',
    format: 'PNG (delivered as AVIF/WebP)',
    usedOn: ['Terms of Use — page hero', 'Gallery g12', 'Swahili coast guide'],
  },
  vehicle: {
    ...INTERIM,
    url: 'https://media.base44.com/images/public/6af2d158f0c17bb742b0ac03/37dacae69_generated_622978e6.png',
    subject: 'Safari vehicle on track',
    format: 'PNG (delivered as AVIF/WebP)',
    usedOn: ['FAQs — page hero', 'Tours and packages content'],
  },
  logo: {
    url: 'https://base44.app/api/apps/6af2d158f0c17bb742b0ac03/files/mp/public/6af2d158f0c17bb742b0ac03/c105a5db7_tuzuru-africa-logo.jpeg',
    subject: 'Tuzuru Africa logo',
    format: 'JPEG',
    origin: 'owner-supplied',
    licence: 'Owned by Tuzuru Africa (owner-supplied asset)',
    licenceStatus: 'permission',
    credit: 'Tuzuru Africa',
    permissionRef: 'Provided by the owner in this project; retain the original master file for future formats',
    usedOn: ['Header (BrandMark)', 'Footer', 'Favicon', 'Open Graph image'],
  },
};

// Alt text belongs to the asset, not to the component that shows it. Kept beside the register so
// the Payload media import carries alt text with each file.
export const MEDIA_ALT = {
  hero: 'Elephants crossing golden savanna grassland at sunset',
  mara: 'Acacia trees on golden grass in the Maasai Mara',
  serengeti: 'Open Serengeti plains at first light',
  zanzibar: 'A dhow on shallow turquoise water off Zanzibar',
  capetown: 'Table Mountain seen from the Cape Town harbour',
  amboseli: 'A family of elephants on the Amboseli plains',
  falls: 'Mist rising from the gorge at Victoria Falls',
  migration: 'Herds moving across open Mara–Serengeti grassland',
  balloon: 'A balloon above the Serengeti plains at dawn',
  gorilla: 'A mountain gorilla in the forest of Bwindi',
  winelands: 'Vine rows running toward the Cape mountains',
  culture: 'Beadwork and cloth at a Maasai homestead',
  escape: 'Palms along the northern Zanzibar coast at dusk',
  gorge: 'The Zambezi river above Victoria Falls',
  craft: 'Craft and market detail from a coastal town',
  seasons: 'Dry-season landscape under open sky',
  door: 'A carved Swahili door in Stone Town',
  vehicle: 'A safari vehicle on a bush track',
  logo: 'Tuzuru Africa',
};

export function mediaEntry(key) {
  return MEDIA_REGISTER[key] || null;
}