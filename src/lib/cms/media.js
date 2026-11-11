// MR-05 — Media abstraction. Every image is referenced by key through this module.
// Components never hold image URLs: swapping MEDIA_BASE_URL (or VITE_MEDIA_BASE_URL in the
// environment) moves every image at once, which is how the Payload media re-upload is wired.
import { MEDIA_REGISTER, MEDIA_ALT as ALT } from '@/data/media';

const MEDIA_BASE_URL = (import.meta.env?.VITE_MEDIA_BASE_URL || '').replace(/\/$/, '');

const HOST_MARKERS = ['/images/public/', '/files/mp/public/'];

// Registered URLs point at the interim Base44 media host. When a media base URL is
// configured, only the path is kept and re-hosted — no component changes required.
function resolve(url) {
  if (!url) return null;
  if (!MEDIA_BASE_URL) return url;
  const marker = HOST_MARKERS.find((m) => url.includes(m));
  if (!marker) return url;
  return `${MEDIA_BASE_URL}${url.slice(url.indexOf(marker))}`;
}

/** key → resolved URL. `IMAGES` is the name the existing components use. */
export const images = Object.fromEntries(
  Object.entries(MEDIA_REGISTER).map(([key, entry]) => [key, resolve(entry.url)])
);
export const IMAGES = images;

/** @returns {string|null} resolved URL for a media key */
export function mediaUrl(key) {
  return images[key] ?? null;
}

/** Full media record: src, alt, credit, licence and permission status. */
export function getImage(key) {
  const entry = MEDIA_REGISTER[key];
  if (!entry) return null;
  return {
    key,
    src: images[key],
    alt: ALT[key] || '',
    // Public credit line only. Interim assets carry none, so provenance is never shown on the site.
    credit: entry.credit || '',
    licence: entry.licence,
    licenceStatus: entry.licenceStatus,
    permissionRef: entry.permissionRef,
    origin: entry.origin,
  };
}

/**
 * Attaches resolved media to a content record that carries `imageKey`.
 * Content in the seed layer stores keys only, so no record hardcodes a host URL.
 */
export function withMedia(record) {
  if (!record || !record.imageKey) return record;
  const media = getImage(record.imageKey);
  if (!media) return record;
  return {
    ...record,
    image: media.src,
    imageAlt: media.alt,
    imageCredit: media.credit,
    imageLicenceStatus: media.licenceStatus,
  };
}

/** Asset manifest for the Payload media re-upload (MR-05 / MR-10). */
export function getAssetManifest() {
  return Object.entries(MEDIA_REGISTER).map(([key, entry]) => ({
    key,
    file: entry.url.split('/').pop(),
    src: images[key],
    alt: ALT[key] || '',
    subject: entry.subject,
    usedOn: entry.usedOn || [],
    format: entry.format,
    origin: entry.origin,
    licence: entry.licence,
    licenceStatus: entry.licenceStatus,
    permissionRef: entry.permissionRef,
  }));
}

export const LOGO_URL = images.logo;