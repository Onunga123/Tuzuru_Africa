// MR-05 â€” Media abstraction. Every image is referenced by key through this module.
// Components never hold image URLs: swapping MEDIA_BASE_URL (or VITE_MEDIA_BASE_URL in the
// environment) moves every image at once, which is how the Payload media re-upload is wired.
import { MEDIA_REGISTER, MEDIA_ALT as ALT } from '@/data/media';

/** @typedef {keyof typeof MEDIA_REGISTER} MediaKey */

const MEDIA_BASE_URL = (import.meta.env?.VITE_MEDIA_BASE_URL || '').replace(/\/$/, '');

const HOST_MARKERS = ['/images/public/', '/files/mp/public/'];

// Registered URLs point at the interim Base44 media host. When a media base URL is
// configured, only the path is kept and re-hosted â€” no component changes required.
/** @param {string} url @returns {string} */
function resolve(url) {
  if (!url) return url;
  if (!MEDIA_BASE_URL) return url;
  const marker = HOST_MARKERS.find((m) => url.includes(m));
  if (!marker) return url;
  return `${MEDIA_BASE_URL}${url.slice(url.indexOf(marker))}`;
}

/** key â†’ resolved URL. `IMAGES` is the name the existing components use. */
/** @type {Record<MediaKey, string>} */
export const images = /** @type {Record<MediaKey, string>} */ (Object.fromEntries(
  Object.entries(MEDIA_REGISTER).map(([key, entry]) => [key, resolve(entry.url)])
));
export const IMAGES = images;

/** @param {string} key @returns {string|null} resolved URL for a media key */
export function mediaUrl(key) {
  if (!Object.prototype.hasOwnProperty.call(images, key)) return null;
  return images[/** @type {MediaKey} */ (key)] ?? null;
}

/** @param {string} key Full media record: src, alt, credit, licence and permission status. */
export function getImage(key) {
  if (!Object.prototype.hasOwnProperty.call(MEDIA_REGISTER, key)) return null;
  const mediaKey = /** @type {MediaKey} */ (key);
  const entry = MEDIA_REGISTER[mediaKey];
  if (!entry) return null;
  return {
    key: mediaKey,
    src: images[mediaKey],
    alt: ALT[mediaKey] || '',
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
 * @template {object} T
 * @param {T & { imageKey?: string }} record
 * @returns {T | (T & { image: string, imageAlt: string, imageCredit: string, imageLicenceStatus: string })}
 */
export function withMedia(record) {
  if (!record || !record.imageKey || !Object.prototype.hasOwnProperty.call(MEDIA_REGISTER, record.imageKey)) return record;
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
  return Object.keys(MEDIA_REGISTER).map((rawKey) => {
    const key = /** @type {MediaKey} */ (rawKey);
    const entry = MEDIA_REGISTER[key];
    return {
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
    };
  });
}

export const LOGO_URL = images.logo;
