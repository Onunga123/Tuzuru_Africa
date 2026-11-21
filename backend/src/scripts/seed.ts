import 'dotenv/config'
import fs from 'node:fs'
import path from 'node:path'
import { getPayload } from 'payload'
import config from '../payload.config'
import type { Destination } from '../payload-types'
import type { Payload } from 'payload'

// S7 seed script — MR-09 import contract (seed/README.md + MIGRATION.md section 8).
// Layers: 1 media | 2 destinations | 3 experiences | 4 tours | 5 guides | 6 gallery | 7 globals.
// Idempotent: upsert on filename (media) / slug (content). Safe to re-run.
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

const SEED_DIR = path.resolve(process.cwd(), '../seed')
const MEDIA_DIR = path.resolve(process.cwd(), 'seed-media')

function out(msg: string): void {
  fs.writeSync(1, msg + '\n')
}

function err(msg: string): void {
  fs.writeSync(2, msg + '\n')
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

function loadJson<T>(name: string): T {
  const full = path.join(SEED_DIR, name)
  if (!fs.existsSync(full)) throw new Error('missing seed file: ' + full)
  return JSON.parse(fs.readFileSync(full, 'utf8')) as T
}

// Payload 3 lexical richText: serialized editor state with one paragraph node.
function paragraphRichText(text: string): Record<string, unknown> {
  return {
    root: {
      type: 'root',
      format: '',
      indent: 0,
      textFormat: 0,
      textStyle: '',
      direction: null,
      version: 1,
      children: [
        {
          type: 'paragraph',
          format: '',
          indent: 0,
          textFormat: 0,
          textStyle: '',
          direction: null,
          version: 1,
          children: [
            {
              type: 'text',
              version: 1,
              text,
              format: 0,
              detail: 0,
              mode: 'normal',
              style: '',
            },
          ],
        },
      ],
    },
  }
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

  out('seed OK - layers 1-2 verified')
  process.exit(0)
}

try {
  await main()
} catch (error: unknown) {
  err('seed FAILED')
  err(error instanceof Error ? (error.stack ?? error.message) : String(error))
  process.exit(1)
}
