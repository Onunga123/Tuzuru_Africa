// MR-01 â€” The single data-access module for public content.
// Every page and component reads content from here; none of them holds a content array or
// queries a collection. Today the data comes from the bundled seed layer (src/data/*), which is
// also what makes the export runnable locally (MR-08). At migration these functions are
// reimplemented against Payload collections â€” the exported names and shapes stay the same, so
// pages do not change; see src/docs/cms/payload-schema-mapping.md.
import * as seed from '@/data/content';
import { WILDLIFE_CALENDAR as WILDLIFE_SEED } from '@/data/wildlifeCalendar';
import { base44 } from '@/api/base44Client';
import { withMedia } from './media';

const decorate = (records) => (records || []).map(withMedia);

/** @type {import('./types').Tour[]} */
export const tours = decorate(seed.tours);
/** @type {import('./types').Destination[]} */
export const destinations = decorate(seed.destinations);
/** @type {import('./types').Experience[]} */
export const experiences = decorate(seed.experiences);
/** @type {import('./types').TravelGuide[]} */
export const guides = decorate(seed.guides);
/** @type {import('./types').GalleryItem[]} */
export const gallery = decorate(seed.gallery);

export const faqGroups = seed.faqGroups;
export const whyTuzuru = seed.whyTuzuru;
export const discoveryPaths = seed.discoveryPaths;
/** @type {import('./types').WildlifeCalendarEntry[]} */
export const WILDLIFE_CALENDAR = decorate(WILDLIFE_SEED);
export const wildlifeCalendar = WILDLIFE_CALENDAR;

export const tourDurationFilters = [
  { label: 'Any duration', value: 'any' },
  { label: 'Up to 4 days', value: 'short' },
  { label: '5 â€“ 7 days', value: 'medium' },
  { label: '8 days or more', value: 'long' },
];

export const seasonCalendar = [
  {
    months: 'January â€“ February',
    event: 'Calving on the southern Serengeti plains',
    detail:
      'Around half a million wildebeest give birth within a few weeks, drawing predators and some of the easiest predator viewing of the year.',
  },
  {
    months: 'April â€“ May',
    event: 'Victoria Falls at its fullest',
    detail:
      'Peak water flow on the Zambezi makes the falls at their most dramatic, though spray can hide the view from the walking paths.',
  },
  {
    months: 'June â€“ October',
    event: 'The dry season and the Great Migration',
    detail:
      'Water and grazing concentrate wildlife around rivers and pans. River crossings in the northern Serengeti and Maasai Mara usually fall between July and October.',
  },
  {
    months: 'November â€“ December',
    event: 'Short rains, then clear coastal weather',
    detail:
      'Brief afternoon storms green the bush and bring migratory birds; the Indian Ocean coast dries out again from December.',
  },
];

export const seasonRelatedLinks = [
  { label: 'Wildlife calendar', to: '/wildlife-calendar' },
  { label: 'Destinations by region', to: '/destinations' },
  { label: 'Frequently asked questions', to: '/faqs' },
];

export const getTours = () => tours;
export const getTour = (slug) => tours.find((t) => t.slug === slug);
export const getDestinations = () => destinations;
export const getDestination = (slug) => destinations.find((d) => d.slug === slug);
export const getExperiences = () => experiences;
export const getGuides = () => guides;
export const getGuide = (slug) => guides.find((g) => g.slug === slug);
export const getGallery = () => gallery;
export const getFaqGroups = () => faqGroups;
export const getWhyTuzuru = () => whyTuzuru;
export const getDiscoveryPaths = () => discoveryPaths;
export const getTourDurationFilters = () => tourDurationFilters;
export const getSeasonCalendar = () => seasonCalendar;
export const getWildlifeCalendar = () => WILDLIFE_CALENDAR;
export const toursByDestination = (slug) => tours.filter((t) => t.destinationSlug === slug);
export const findTour = getTour;
export const findDestination = getDestination;
export const findGuide = getGuide;

/**
 * Travel seasons for the When to Travel page.
 * Preview adapter: reads the interim Base44 collection (the only entity read in the app).
 * At migration this becomes a Payload read of the `travel-seasons` collection.
 */
/** @returns {Promise<import('./types').TravelSeason[]>} */
export async function getTravelSeasons() {
  const page = await base44.entities.TravelSeason.list({ sort: 'sort_order', limit: 12 });
  return /** @type {import('./types').TravelSeason[]} */ (page?.items ?? page ?? []);
}

export function formatDate(value) {
  return new Date(value).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
}

