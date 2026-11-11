// MR-09 — Seed exporter. Turns the bundled content layer into JSON files ready for import into
// Payload CMS after migration. Run: node scripts/export-seed.mjs
//
// Output goes to ./seed/. Records keep their image KEY (never a host URL), so the Payload media
// import re-links them by filename. No launch flags, no AI/provenance wording — interim imagery is
// owner-approved under DL-009 and its provenance stays internal (see src/data/media.js).
import { mkdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import {
  tours,
  destinations,
  experiences,
  guides,
  gallery,
  faqGroups,
  whyTuzuru,
  discoveryPaths,
} from '../src/data/content.js';
import { WILDLIFE_CALENDAR } from '../src/data/wildlifeCalendar.js';
import { MEDIA_REGISTER, MEDIA_ALT } from '../src/data/media.js';
import { siteSettings, navigation, footer, homepage } from '../src/lib/cms/settings.js';

const outDir = fileURLToPath(new URL('../seed/', import.meta.url));
mkdirSync(outDir, { recursive: true });

const media = Object.entries(MEDIA_REGISTER).map(([key, entry]) => ({
  key,
  filename: entry.url.split('/').pop(),
  alt: MEDIA_ALT[key] || '',
  subject: entry.subject,
  usedOn: entry.usedOn || [],
  format: entry.format,
  // Provenance — internal to the CMS. Never rendered on the public site.
  origin: entry.origin,
  credit: entry.credit || '',
  licence: entry.licence,
  licenceStatus: entry.licenceStatus,
  permissionRef: entry.permissionRef,
}));

const files = {
  'media.json': media,
  'destinations.json': destinations,
  'experiences.json': experiences,
  'tours.json': tours,
  'guides.json': guides,
  'gallery.json': gallery,
  'faqs.json': faqGroups,
  'wildlife-calendar.json': WILDLIFE_CALENDAR,
  'home-content.json': { whyTuzuru, discoveryPaths },
  'site-settings.json': siteSettings,
  'navigation.json': navigation,
  'footer.json': footer,
  'homepage.json': homepage,
};

const counts = {};
for (const [name, data] of Object.entries(files)) {
  writeFileSync(`${outDir}${name}`, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
  counts[name] = Array.isArray(data) ? data.length : Object.keys(data).length;
}

console.log(`Exported ${Object.keys(files).length} files to seed/`);
console.table(counts);