import 'dotenv/config'
import fs from 'node:fs'
import path from 'node:path'
import { getPayload } from 'payload'
import config from '../payload.config'
import type { Destination, Guide } from '../payload-types'
import type { Payload } from 'payload'

// S7 seed script — MR-09 import contract (seed/README.md + MIGRATION.md section 8).
// Layers: 1 media | 2 destinations | 3 experiences | 4 tours | 5 guides | 6 gallery | 7 globals.
// Idempotent: upsert on filename (media) / slug (content) / image (gallery). Safe to re-run.
//
// Entry point MUST use top-level await: `payload run` exits with code 0 as soon as
// module evaluation resolves. A fire-and-forget main() is killed mid-flight (right
// after 'seed start', during getPayload) — root cause of the two silent truncated
// runs. Output goes through fs.writeSync so nothing can be lost to pipe buffering.
//
// Layer 2 notes:
// - status 'published': destinations.json has no draft markers (CONT-02), so the
//   records are owner-approved and go out published (seed/README.md draft-flag rule).
// - imageAlt is the media manifest alt for the entry's imageKey (same text as the
//   media doc; "alt travels with the record").
// - related[] are tour slugs and are back-filled in layer 4 once tours exist.
//
// Layer 3 notes:
// - upsert on slug (unique + indexed). Contract rule 2 (tours -> experiences by
//   name) is resolved in layer 4; the name must simply stay unique.
// - sortOrder = manifest array index: the JSON order is the frontend grid order.
// - no status field: Experiences read access is public, nothing to publish.
//
// Layer 4 notes (soft policy: unresolved slugs WARN, never abort):
// - destinationSlug -> destination relationship (e.g. 'bwindi' has no destination
//   doc yet: relationship left empty, display string kept in destinationLabel).
// - experiences resolved by name (contract rule 2).
// - itinerary day arrives as a number, stored as text (String(day)).
// - priceBasis left unset: default 'On request' applies on create (CONT-02, no
//   prices in seed data); updates never clobber a manual admin edit.
// - 4b back-fill: destinations.related[] tour slugs -> relatedTours relationship,
//   rewritten whole each run; unresolved slugs (family-safari-mara,
//   migration-safari, swahili-coast-guide) warn and are dropped. Note:
//   swahili-coast-guide is a GUIDE slug (layer 5), not a tour - dropping it from
//   relatedTours was correct.
//
// Layer 5 notes:
// - upsert on slug (unique + indexed). category is a closed select: manifest
//   values must match the three options exactly (they do).
// - imageAlt from the media entry alt (guides.json carries no per-guide imageAlt).
// - date is an ISO string in the seed; stored as a Payload date (UTC midnight).
// - content blocks {heading, body} -> one lexical root with an h2 heading node +
//   paragraph node per block (contract: heading/body maps to heading + paragraph).
// - lastUpdated, socialImage, relatedDestinations: absent in the manifest, left
//   unset (contract rule 3 applies only "when present").
// - status 'published' (read access is adminOrPublished, same as tours).
//
// Layer 6 notes:
// - gallery has NO slug: upsert keyed on the image relationship (all 12 imageKeys
//   are distinct media docs, so one gallery doc per media doc is the key).
// - alt from the media entry alt (gallery.json carries no per-item alt).
// - manifest field 'licence' -> schema field 'permission' (DL-009 licence note
//   kept with the record); licenceStatus maps 1:1 (all 'owner-approved-interim').
// - destination resolved by display NAME via buildDestinationNameIndex (gallery.json
//   stores names, not slugs); unresolved -> null + WARN (soft policy).
// - no status field: gallery read access is public; credit is '' in the manifest.

const SEED_DIR = path.resolve(process.cwd(), '../seed')
const MEDIA_DIR = path.resolve(process.cwd(), 'seed-media')

let warnings = 0

function out(msg: string): void {
  fs.writeSync(1, msg + '\n')
}

function err(msg: string): void {
  fs.writeSync(2, msg + '\n')
}

function warn(msg: string): void {
  warnings += 1
  err('WARN: ' + msg)
}

type MediaEntry = {
  key: string
  filename: string
  alt: string
  origin: string
  credit: string
  licence: string
  licenceStatus: string
  permissionRef: string
}

type MediaRef = { id: number | string; alt: string }

type DestinationEntry = {
  slug: string
  name: string
  country: string
  region: string
  imageKey: string
  tagline: string
  intro: string
  description: string
  attractions: string[]
  bestTime: string
  travelInfo: string
  related: string[]
}

type ExperienceEntry = {
  slug: string
  name: string
  icon: string
  imageKey: string
  blurb: string
  detail: string
}

type TourEntry = {
  slug: string
  title: string
  destination: string
  destinationSlug: string
  duration: string
  days: number
  imageKey: string
  experiences: string[]
  featured?: boolean
  overview: string
  highlights: string[]
  itinerary: Array<{ day: number; title: string; detail: string }>
  accommodation: string
  transport: string
  inclusions: string[]
  exclusions: string[]
  important: string
}

type GuideEntry = {
  slug: string
  title: string
  category: string
  imageKey: string
  date: string
  readingTime: string
  excerpt: string
  content: Array<{ heading: string; body: string }>
}

type GalleryEntry = {
  id: string
  imageKey: string
  caption: string
  category: string
  destination: string
  credit: string
  licence: string
  licenceStatus: string
}

function loadJson<T>(name: string): T {
  const full = path.join(SEED_DIR, name)
  if (!fs.existsSync(full)) throw new Error('missing seed file: ' + full)
  return JSON.parse(fs.readFileSync(full, 'utf8')) as T
}

// Payload 3 lexical richText: serialized editor state. Node builders below compose
// paragraph-only roots (destinations) and heading+paragraph roots (guides).
function textNode(text: string): Record<string, unknown> {
  return {
    type: 'text',
    version: 1,
    text,
    format: 0,
    detail: 0,
    mode: 'normal',
    style: '',
  }
}

function paragraphNode(text: string): Record<string, unknown> {
  return {
    type: 'paragraph',
    format: '',
    indent: 0,
    textFormat: 0,
    textStyle: '',
    direction: null,
    version: 1,
    children: [textNode(text)],
  }
}

function headingNode(text: string): Record<string, unknown> {
  return {
    type: 'heading',
    tag: 'h2',
    format: '',
    indent: 0,
    textFormat: 0,
    textStyle: '',
    direction: null,
    version: 1,
    children: [textNode(text)],
  }
}

function lexicalRoot(children: Array<Record<string, unknown>>): Record<string, unknown> {
  return {
    root: {
      type: 'root',
      format: '',
      indent: 0,
      textFormat: 0,
      textStyle: '',
      direction: null,
      version: 1,
      children,
    },
  }
}

// Payload 3 lexical richText: serialized editor state with one paragraph node.
function paragraphRichText(text: string): Record<string, unknown> {
  return lexicalRoot([paragraphNode(text)])
}

// guides.json content blocks -> h2 heading + paragraph per block.
function blocksRichText(blocks: Array<{ heading: string; body: string }>): Record<string, unknown> {
  const children: Array<Record<string, unknown>> = []
  for (const block of blocks) {
    children.push(headingNode(block.heading))
    children.push(paragraphNode(block.body))
  }
  return lexicalRoot(children)
}

// media.json key -> live media doc (id + alt), resolved by filename (contract rule 4).
async function buildMediaIndex(payload: Payload): Promise<Map<string, MediaRef>> {
  const manifest = loadJson<MediaEntry[]>('media.json')
  const index = new Map<string, MediaRef>()
  for (const entry of manifest) {
    const found = await payload.find({
      collection: 'media',
      where: { filename: { equals: entry.filename } },
      limit: 1,
      overrideAccess: true,
    })
    if (found.docs.length === 0) {
      throw new Error('media doc not found for key ' + entry.key + ' (' + entry.filename + ') - run layer 1 first')
    }
    index.set(entry.key, { id: found.docs[0].id, alt: found.docs[0].alt })
  }
  return index
}

async function buildDestinationIndex(payload: Payload): Promise<Map<string, number | string>> {
  const found = await payload.find({ collection: 'destinations', limit: 100, overrideAccess: true })
  return new Map(found.docs.map((d) => [d.slug, d.id] as [string, number | string]))
}

// gallery.json references destinations by display NAME, not slug (layer 6).
async function buildDestinationNameIndex(payload: Payload): Promise<Map<string, number | string>> {
  const found = await payload.find({ collection: 'destinations', limit: 100, overrideAccess: true })
  return new Map(found.docs.map((d) => [d.name, d.id] as [string, number | string]))
}

// Contract rule 2: tours reference experiences by NAME, not slug.
async function buildExperienceNameIndex(payload: Payload): Promise<Map<string, number | string>> {
  const found = await payload.find({ collection: 'experiences', limit: 100, overrideAccess: true })
  return new Map(found.docs.map((d) => [d.name, d.id] as [string, number | string]))
}

async function buildTourIndex(payload: Payload): Promise<Map<string, number | string>> {
  const found = await payload.find({ collection: 'tours', limit: 100, overrideAccess: true })
  return new Map(found.docs.map((d) => [d.slug, d.id] as [string, number | string]))
}

async function upsertMedia(payload: Payload): Promise<{ created: number; updated: number }> {
  const manifest = loadJson<MediaEntry[]>('media.json')
  let created = 0
  let updated = 0
  for (const entry of manifest) {
    const filePath = path.join(MEDIA_DIR, entry.filename)
    if (!fs.existsSync(filePath)) {
      throw new Error('missing binary: ' + filePath + ' — run the S7-E5 download step first')
    }
    const existing = await payload.find({
      collection: 'media',
      where: { filename: { equals: entry.filename } },
      limit: 1,
      overrideAccess: true,
    })
    const data = {
      alt: entry.alt,
      origin: entry.origin,
      credit: entry.credit,
      licence: entry.licence,
      licenceStatus: entry.licenceStatus,
      permissionRef: entry.permissionRef,
    }
    if (existing.docs.length > 0) {
      await payload.update({
        collection: 'media',
        id: existing.docs[0].id,
        data,
        overrideAccess: true,
      })
      updated += 1
      out('  ~ media ' + entry.key + ' (' + entry.filename + ')')
    } else {
      const bytes = fs.readFileSync(filePath)
      await payload.create({
        collection: 'media',
        data,
        file: {
          data: bytes,
          mimetype: entry.filename.endsWith('.png') ? 'image/png' : 'image/jpeg',
          name: entry.filename,
          size: bytes.length,
        },
        overrideAccess: true,
      })
      created += 1
      out('  + media ' + entry.key + ' (' + entry.filename + ')')
    }
  }
  return { created, updated }
}

async function upsertDestinations(payload: Payload, mediaIndex: Map<string, MediaRef>): Promise<{ created: number; updated: number }> {
  const manifest = loadJson<DestinationEntry[]>('destinations.json')
  let created = 0
  let updated = 0
  for (const entry of manifest) {
    const media = mediaIndex.get(entry.imageKey)
    if (!media) throw new Error('imageKey not in media.json: ' + entry.imageKey + ' (destination ' + entry.slug + ')')
    const data = {
      name: entry.name,
      slug: entry.slug,
      country: entry.country,
      region: entry.region,
      image: media.id,
      imageAlt: media.alt,
      tagline: entry.tagline,
      intro: entry.intro,
      description: paragraphRichText(entry.description) as unknown as NonNullable<Destination['description']>,
      attractions: entry.attractions.map((a) => ({ attraction: a })),
      bestTime: entry.bestTime,
      travelInfo: entry.travelInfo,
      status: 'published',
    }
    const existing = await payload.find({
      collection: 'destinations',
      where: { slug: { equals: entry.slug } },
      limit: 1,
      overrideAccess: true,
    })
    if (existing.docs.length > 0) {
      await payload.update({
        collection: 'destinations',
        id: existing.docs[0].id,
        data,
        overrideAccess: true,
      })
      updated += 1
      out('  ~ destination ' + entry.slug)
    } else {
      await payload.create({
        collection: 'destinations',
        data,
        overrideAccess: true,
      })
      created += 1
      out('  + destination ' + entry.slug)
    }
  }
  return { created, updated }
}

async function upsertExperiences(payload: Payload, mediaIndex: Map<string, MediaRef>): Promise<{ created: number; updated: number }> {
  const manifest = loadJson<ExperienceEntry[]>('experiences.json')
  let created = 0
  let updated = 0
  for (let i = 0; i < manifest.length; i++) {
    const entry = manifest[i]
    const media = mediaIndex.get(entry.imageKey)
    if (!media) throw new Error('imageKey not in media.json: ' + entry.imageKey + ' (experience ' + entry.slug + ')')
    const data = {
      name: entry.name,
      slug: entry.slug,
      icon: entry.icon,
      image: media.id,
      blurb: entry.blurb,
      detail: entry.detail,
      sortOrder: i,
    }
    const existing = await payload.find({
      collection: 'experiences',
      where: { slug: { equals: entry.slug } },
      limit: 1,
      overrideAccess: true,
    })
    if (existing.docs.length > 0) {
      await payload.update({
        collection: 'experiences',
        id: existing.docs[0].id,
        data,
        overrideAccess: true,
      })
      updated += 1
      out('  ~ experience ' + entry.slug)
    } else {
      await payload.create({
        collection: 'experiences',
        data,
        overrideAccess: true,
      })
      created += 1
      out('  + experience ' + entry.slug)
    }
  }
  return { created, updated }
}

async function upsertTours(
  payload: Payload,
  mediaIndex: Map<string, MediaRef>,
  destinationIndex: Map<string, number | string>,
  experienceNameIndex: Map<string, number | string>,
): Promise<{ created: number; updated: number }> {
  const manifest = loadJson<TourEntry[]>('tours.json')
  let created = 0
  let updated = 0
  for (const entry of manifest) {
    const media = mediaIndex.get(entry.imageKey)
    if (!media) throw new Error('imageKey not in media.json: ' + entry.imageKey + ' (tour ' + entry.slug + ')')
    const expIds: Array<number | string> = []
    for (const name of entry.experiences) {
      const id = experienceNameIndex.get(name)
      if (id === undefined) {
        warn('tour ' + entry.slug + ' - experience name not found: ' + name + ' (skipped)')
      } else {
        expIds.push(id)
      }
    }
    const destId = destinationIndex.get(entry.destinationSlug)
    if (destId === undefined) {
      warn('tour ' + entry.slug + ' - destinationSlug not found: ' + entry.destinationSlug + ' (relationship left empty)')
    }
    const data = {
      title: entry.title,
      slug: entry.slug,
      destination: destId ?? null,
      destinationLabel: entry.destination,
      duration: entry.duration,
      days: entry.days,
      image: media.id,
      imageAlt: media.alt,
      experiences: expIds,
      featured: entry.featured === true,
      overview: entry.overview,
      highlights: entry.highlights.map((h) => ({ highlight: h })),
      itinerary: entry.itinerary.map((step) => ({ day: String(step.day), title: step.title, detail: step.detail })),
      accommodation: entry.accommodation,
      transport: entry.transport,
      inclusions: entry.inclusions.map((x) => ({ inclusion: x })),
      exclusions: entry.exclusions.map((x) => ({ exclusion: x })),
      important: entry.important,
      status: 'published',
    }
    const existing = await payload.find({
      collection: 'tours',
      where: { slug: { equals: entry.slug } },
      limit: 1,
      overrideAccess: true,
    })
    if (existing.docs.length > 0) {
      await payload.update({
        collection: 'tours',
        id: existing.docs[0].id,
        data,
        overrideAccess: true,
      })
      updated += 1
      out('  ~ tour ' + entry.slug)
    } else {
      await payload.create({
        collection: 'tours',
        data,
        overrideAccess: true,
      })
      created += 1
      out('  + tour ' + entry.slug)
    }
  }
  return { created, updated }
}

async function backfillRelatedTours(
  payload: Payload,
  destinationIndex: Map<string, number | string>,
  tourIndex: Map<string, number | string>,
): Promise<void> {
  const manifest = loadJson<DestinationEntry[]>('destinations.json')
  for (const entry of manifest) {
    const destId = destinationIndex.get(entry.slug)
    if (destId === undefined) {
      warn('backfill - destination not found: ' + entry.slug)
      continue
    }
    const tourIds: Array<number | string> = []
    for (const tourSlug of entry.related) {
      const id = tourIndex.get(tourSlug)
      if (id === undefined) {
        warn('destination ' + entry.slug + ' - related tour slug not found: ' + tourSlug + ' (dropped from relatedTours)')
      } else {
        tourIds.push(id)
      }
    }
    await payload.update({
      collection: 'destinations',
      id: destId,
      data: { relatedTours: tourIds },
      overrideAccess: true,
    })
    out('  ~ relatedTours ' + entry.slug + ' -> ' + tourIds.length + ' of ' + entry.related.length)
  }
}

async function upsertGuides(payload: Payload, mediaIndex: Map<string, MediaRef>): Promise<{ created: number; updated: number }> {
  const manifest = loadJson<GuideEntry[]>('guides.json')
  let created = 0
  let updated = 0
  for (const entry of manifest) {
    const media = mediaIndex.get(entry.imageKey)
    if (!media) throw new Error('imageKey not in media.json: ' + entry.imageKey + ' (guide ' + entry.slug + ')')
    const data = {
      slug: entry.slug,
      title: entry.title,
      category: entry.category,
      image: media.id,
      imageAlt: media.alt,
      date: new Date(entry.date + 'T00:00:00.000Z'),
      readingTime: entry.readingTime,
      excerpt: entry.excerpt,
      content: blocksRichText(entry.content) as unknown as NonNullable<Guide['content']>,
      status: 'published',
    }
    const existing = await payload.find({
      collection: 'guides',
      where: { slug: { equals: entry.slug } },
      limit: 1,
      overrideAccess: true,
    })
    if (existing.docs.length > 0) {
      await payload.update({
        collection: 'guides',
        id: existing.docs[0].id,
        data,
        overrideAccess: true,
      })
      updated += 1
      out('  ~ guide ' + entry.slug)
    } else {
      await payload.create({
        collection: 'guides',
        data,
        overrideAccess: true,
      })
      created += 1
      out('  + guide ' + entry.slug)
    }
  }
  return { created, updated }
}

async function upsertGallery(
  payload: Payload,
  mediaIndex: Map<string, MediaRef>,
  destinationNameIndex: Map<string, number | string>,
): Promise<{ created: number; updated: number }> {
  const manifest = loadJson<GalleryEntry[]>('gallery.json')
  let created = 0
  let updated = 0
  for (const entry of manifest) {
    const media = mediaIndex.get(entry.imageKey)
    if (!media) throw new Error('imageKey not in media.json: ' + entry.imageKey + ' (gallery ' + entry.id + ')')
    const destId = destinationNameIndex.get(entry.destination)
    if (destId === undefined) {
      warn('gallery ' + entry.id + ' - destination name not found: ' + entry.destination + ' (relationship left empty)')
    }
    const data = {
      image: media.id,
      alt: media.alt,
      caption: entry.caption,
      category: entry.category,
      destination: destId ?? null,
      credit: entry.credit,
      licenceStatus: entry.licenceStatus,
      permission: entry.licence,
    }
    // gallery has no slug: upsert keyed on the image relationship (imageKeys are
    // distinct across the manifest, so one gallery doc per media doc).
    const existing = await payload.find({
      collection: 'gallery',
      where: { image: { equals: media.id } },
      limit: 1,
      overrideAccess: true,
    })
    if (existing.docs.length > 0) {
      await payload.update({
        collection: 'gallery',
        id: existing.docs[0].id,
        data,
        overrideAccess: true,
      })
      updated += 1
      out('  ~ gallery ' + entry.id + ' (' + entry.imageKey + ')')
    } else {
      await payload.create({
        collection: 'gallery',
        data,
        overrideAccess: true,
      })
      created += 1
      out('  + gallery ' + entry.id + ' (' + entry.imageKey + ')')
    }
  }
  return { created, updated }
}

// ---------------------------------------------------------------------------
// layer 7: globals
//
// Globals are singletons: each manifest maps to exactly one payload.updateGlobal
// call (naturally idempotent - the same data is written every run). Where the
// manifest carries more structure than the global schema has fields for, the
// drop is loud (one WARN per global) and documented here + in the commit:
//   site-settings: hours, contactNote, draftNotice, whatsappLink dropped
//   navigation: cta, mobileCta dropped (no CTA fields); items flattened
//     primary -> secondary -> mobileExtra (order preserved within groups)
//   footer: column titles derived from manifest keys (explore/company/legal)
//   homepage: hero.eyebrow, hero.secondaryCta, cta.eyebrow, cta.note dropped;
//     heroTitle = headline + ' ' + headlineAccent (single title field);
//     featured sections, intro section and ctaBanner button left unset for
//     owner curation (no manifest source - not invented by the seed)
//   home-content.json (whyTuzuru, discoveryPaths): no landing fields on the
//     homepage global - skipped (schema gap, MR-09 deviation)
// Contract-order steps travel-seasons / wildlife-calendar / faqs have no
// collections in the schema - skipped in main() with one WARN (MR-09 deviation;
// seasonal content survives via destinations bestTime/travelInfo).
// ---------------------------------------------------------------------------

interface NavLinkEntry {
  label: string
  to: string
}

interface NavigationEntry {
  primary: NavLinkEntry[]
  secondary: NavLinkEntry[]
  mobileExtra: NavLinkEntry[]
  cta: NavLinkEntry
  mobileCta: NavLinkEntry
}

interface FooterEntry {
  explore: NavLinkEntry[]
  company: NavLinkEntry[]
  legal: NavLinkEntry[]
}

interface SiteSettingsEntry {
  name: string
  tagline: string
  shortDescription: string
  phone: string
  whatsapp: string
  whatsappLink: string
  email: string
  location: string
  hours: string
  contactNote: string
  draftNotice: string
  socialLinks: unknown[]
}

interface HomepageEntry {
  hero: {
    eyebrow: string
    headline: string
    headlineAccent: string
    intro: string
    primaryCta: NavLinkEntry
    secondaryCta: NavLinkEntry
    imageKey: string
  }
  cta: {
    eyebrow: string
    title: string
    body: string
    note: string
  }
}

async function seedGlobals(payload: Payload, mediaIndex: Map<string, MediaRef>): Promise<number> {
  // site-settings
  const settings = loadJson<SiteSettingsEntry>('site-settings.json')
  await payload.updateGlobal({
    slug: 'site-settings',
    data: {
      siteName: settings.name,
      tagline: settings.tagline,
      aboutShort: settings.shortDescription,
      contactEmail: settings.email,
      contactPhone: settings.phone,
      whatsappNumber: settings.whatsapp,
      address: settings.location,
      socials: [],
    },
    overrideAccess: true,
  })
  warn('site-settings - dropped manifest fields (no column on the global): hours, contactNote, draftNotice, whatsappLink')
  out('  ~ global site-settings')

  // navigation
  const navigation = loadJson<NavigationEntry>('navigation.json')
  const navItems: Array<{ label: string; href: string; openInNewTab: boolean }> = []
  for (const group of [navigation.primary, navigation.secondary, navigation.mobileExtra]) {
    for (const item of group) {
      navItems.push({ label: item.label, href: item.to, openInNewTab: false })
    }
  }
  await payload.updateGlobal({
    slug: 'navigation',
    data: { items: navItems },
    overrideAccess: true,
  })
  warn('navigation - cta, mobileCta dropped (no fields on the navigation global); ' + navItems.length + ' menu items flattened primary -> secondary -> mobileExtra')
  out('  ~ global navigation (' + navItems.length + ' items)')

  // footer
  const footer = loadJson<FooterEntry>('footer.json')
  const columnTitle = (key: string): string => key.charAt(0).toUpperCase() + key.slice(1)
  await payload.updateGlobal({
    slug: 'footer',
    data: {
      columns: [
        { title: columnTitle('explore'), links: footer.explore.map(l => ({ label: l.label, href: l.to })) },
        { title: columnTitle('company'), links: footer.company.map(l => ({ label: l.label, href: l.to })) },
        { title: columnTitle('legal'), links: footer.legal.map(l => ({ label: l.label, href: l.to })) },
      ],
    },
    overrideAccess: true,
  })
  out('  ~ global footer (3 columns)')

  // homepage
  const homepage = loadJson<HomepageEntry>('homepage.json')
  const heroMedia = mediaIndex.get(homepage.hero.imageKey)
  if (!heroMedia) throw new Error('homepage hero imageKey not in media.json: ' + homepage.hero.imageKey)
  await payload.updateGlobal({
    slug: 'homepage',
    data: {
      heroTitle: homepage.hero.headline + ' ' + homepage.hero.headlineAccent,
      heroSubtitle: homepage.hero.intro,
      heroImage: heroMedia.id,
      heroCtaLabel: homepage.hero.primaryCta.label,
      heroCtaHref: homepage.hero.primaryCta.to,
      ctaBannerTitle: homepage.cta.title,
      ctaBannerBody: homepage.cta.body,
    },
    overrideAccess: true,
  })
  warn('homepage - hero.eyebrow, hero.secondaryCta, cta.eyebrow, cta.note dropped (no fields); heroTitle concatenated from headline + headlineAccent; featured sections, intro section and ctaBanner button left unset (no manifest source)')
  warn('home-content.json - whyTuzuru, discoveryPaths have no landing fields on the homepage global - skipped (schema gap, MR-09 deviation)')
  out('  ~ global homepage')
  return 4
}

async function main(): Promise<void> {
  out('seed start: SEED_DIR=' + SEED_DIR + ' MEDIA_DIR=' + MEDIA_DIR)
  const payload = await getPayload({ config })

  out('--- layer 1: media ---')
  const media = await upsertMedia(payload)
  const mediaTotal = await payload.count({ collection: 'media', overrideAccess: true })
  out('media done: created=' + media.created + ' updated=' + media.updated + ' total=' + mediaTotal.totalDocs + ' (expected 19)')
  if (mediaTotal.totalDocs !== 19) throw new Error('media count mismatch: ' + mediaTotal.totalDocs + ' != 19')

  out('--- layer 2: destinations ---')
  const mediaIndex = await buildMediaIndex(payload)
  const destinations = await upsertDestinations(payload, mediaIndex)
  const expectedDestinations = loadJson<DestinationEntry[]>('destinations.json').length
  const destinationTotal = await payload.count({ collection: 'destinations', overrideAccess: true })
  out('destinations done: created=' + destinations.created + ' updated=' + destinations.updated + ' total=' + destinationTotal.totalDocs + ' (expected ' + expectedDestinations + ')')
  if (destinationTotal.totalDocs !== expectedDestinations) {
    throw new Error('destination count mismatch: ' + destinationTotal.totalDocs + ' != ' + expectedDestinations)
  }

  out('--- layer 3: experiences ---')
  const experiences = await upsertExperiences(payload, mediaIndex)
  const expectedExperiences = loadJson<ExperienceEntry[]>('experiences.json').length
  const experienceTotal = await payload.count({ collection: 'experiences', overrideAccess: true })
  out('experiences done: created=' + experiences.created + ' updated=' + experiences.updated + ' total=' + experienceTotal.totalDocs + ' (expected ' + expectedExperiences + ')')
  if (experienceTotal.totalDocs !== expectedExperiences) {
    throw new Error('experience count mismatch: ' + experienceTotal.totalDocs + ' != ' + expectedExperiences)
  }

  out('--- layer 4: tours ---')
  const destinationIndex = await buildDestinationIndex(payload)
  const experienceNameIndex = await buildExperienceNameIndex(payload)
  const tours = await upsertTours(payload, mediaIndex, destinationIndex, experienceNameIndex)
  const expectedTours = loadJson<TourEntry[]>('tours.json').length
  const tourTotal = await payload.count({ collection: 'tours', overrideAccess: true })
  out('tours done: created=' + tours.created + ' updated=' + tours.updated + ' total=' + tourTotal.totalDocs + ' (expected ' + expectedTours + ')')
  if (tourTotal.totalDocs !== expectedTours) {
    throw new Error('tour count mismatch: ' + tourTotal.totalDocs + ' != ' + expectedTours)
  }

  out('--- layer 4b: destinations.relatedTours back-fill ---')
  const tourIndex = await buildTourIndex(payload)
  await backfillRelatedTours(payload, destinationIndex, tourIndex)

  out('--- layer 5: guides ---')
  const guides = await upsertGuides(payload, mediaIndex)
  const expectedGuides = loadJson<GuideEntry[]>('guides.json').length
  const guideTotal = await payload.count({ collection: 'guides', overrideAccess: true })
  out('guides done: created=' + guides.created + ' updated=' + guides.updated + ' total=' + guideTotal.totalDocs + ' (expected ' + expectedGuides + ')')
  if (guideTotal.totalDocs !== expectedGuides) {
    throw new Error('guide count mismatch: ' + guideTotal.totalDocs + ' != ' + expectedGuides)
  }

  out('--- layer 6: gallery ---')
  const destinationNameIndex = await buildDestinationNameIndex(payload)
  const gallery = await upsertGallery(payload, mediaIndex, destinationNameIndex)
  const expectedGallery = loadJson<GalleryEntry[]>('gallery.json').length
  const galleryTotal = await payload.count({ collection: 'gallery', overrideAccess: true })
  out('gallery done: created=' + gallery.created + ' updated=' + gallery.updated + ' total=' + galleryTotal.totalDocs + ' (expected ' + expectedGallery + ')')
  if (galleryTotal.totalDocs !== expectedGallery) {
    throw new Error('gallery count mismatch: ' + galleryTotal.totalDocs + ' != ' + expectedGallery)
  }

  out('--- layer 7: globals ---')
  warn('contract order steps travel-seasons, wildlife-calendar, faqs have no collections in the schema - skipped (MR-09 deviation, schema gap)')
  const globalsUpdated = await seedGlobals(payload, mediaIndex)
  out('globals done: ' + globalsUpdated + ' globals updated (expected 4)')
  if (globalsUpdated !== 4) throw new Error('globals count mismatch: ' + globalsUpdated + ' != 4')
  out('seed OK - layers 1-7 verified, warnings: ' + warnings)
  process.exit(0)
}

try {
  await main()
} catch (error: unknown) {
  err('seed FAILED')
  err(error instanceof Error ? (error.stack ?? error.message) : String(error))
  process.exit(1)
}
