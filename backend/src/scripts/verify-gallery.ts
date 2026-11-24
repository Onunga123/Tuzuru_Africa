/**
 * verify-gallery.ts - read-only probe for seed layer 6 (gallery)
 *
 * Mirrors verify-guides.ts (rev 2 conventions). Asserts the seeded gallery
 * collection against seed/gallery.json using the MR-09 conventions:
 *   - gallery has no slug: identity is the image relationship - exactly one
 *     doc per manifest imageKey; duplicate image ids fail the probe
 *   - imageKey -> media.json key -> filename -> live media doc
 *   - alt derived from the media entry alt ("alt travels with the record")
 *   - scalars round-trip: caption, category, credit ('' tolerated as null),
 *     licenceStatus, permission <- manifest field 'licence'
 *   - destination resolved by NAME, soft policy mirrored: a name present in
 *     destinations.json must resolve to that destination doc; an absent name
 *     must leave the relationship empty
 *   - read access is public (no status field): anonymous read sees exactly
 *     the manifest set
 *
 * Read-only: this script performs no create/update/delete calls.
 *
 * NOTE (payload run): top-level await main() inside try/catch is mandatory -
 * payload run exits 0 as soon as module evaluation resolves, so a
 * fire-and-forget main() gets killed mid-flight. Log via fs.writeSync only.
 */

import fs from 'fs'
import path from 'path'
import config from '../payload.config'
import { getPayload } from 'payload'

const SEED_DIR = path.resolve(process.cwd(), '../seed')

interface MediaEntry {
  key: string
  filename: string
  alt: string
}

interface DestinationEntry {
  slug: string
  name: string
}

interface GalleryEntry {
  id: string
  imageKey: string
  caption: string
  category: string
  destination: string
  credit: string
  licence: string
  licenceStatus: string
}

type AnyRec = Record<string, unknown>

function out(s: string): void {
  fs.writeSync(1, s + '\n')
}

function err(s: string): void {
  fs.writeSync(2, s + '\n')
}

const failures: string[] = []

function fail(msg: string): void {
  failures.push(msg)
  err('FAIL: ' + msg)
}

function check(cond: boolean, msg: string): void {
  if (!cond) fail(msg)
}

function loadJson<T>(name: string): T {
  const p = path.join(SEED_DIR, name)
  if (!fs.existsSync(p)) throw new Error('missing seed file: ' + p)
  return JSON.parse(fs.readFileSync(p, 'utf8')) as T
}

function idOf(v: unknown): string | null {
  if (typeof v === 'number') return String(v)
  if (typeof v === 'string' && v !== '') return v
  if (v && typeof v === 'object') {
    const id = (v as AnyRec).id
    if (typeof id === 'number') return String(id)
    if (typeof id === 'string' && id !== '') return id
  }
  return null
}

function eq(a: unknown, b: unknown): boolean {
  const x = a === null || a === undefined ? '' : a
  const y = b === null || b === undefined ? '' : b
  return x === y
}

function nonAsciiCount(s: string): number {
  return (s.match(/[^\x00-\x7F]/g) ?? []).length
}

function snippet(v: unknown): string {
  const s = typeof v === 'string' ? v : JSON.stringify(v ?? null)
  const capped = s.length > 110 ? s.slice(0, 110) + '...' : s
  return JSON.stringify(capped)
}

async function main(): Promise<void> {
  const payload = await getPayload({ config })
  out('verify-gallery start (read-only probe, SEED_DIR=' + SEED_DIR + ')')

  const entries = loadJson<GalleryEntry[]>('gallery.json')
  const mediaEntries = loadJson<MediaEntry[]>('media.json')
  const destEntries = loadJson<DestinationEntry[]>('destinations.json')
  const mediaByKey = new Map<string, MediaEntry>(mediaEntries.map(m => [m.key, m]))
  const destNamesManifest = new Set<string>(destEntries.map(d => d.name))

  // live docs at depth 0; integer PKs arrive as numbers -> all maps keyed by String(id)
  const mediaRes = await payload.find({ collection: 'media', limit: 100, overrideAccess: true, depth: 0 })
  const mediaByFilename = new Map<string, AnyRec>(
    mediaRes.docs.map(d => [String((d as unknown as AnyRec).filename), d as unknown as AnyRec] as [string, AnyRec]),
  )
  const destRes = await payload.find({ collection: 'destinations', limit: 100, overrideAccess: true, depth: 0 })
  const destNameById = new Map<string, string>(
    destRes.docs.map(d => [String((d as unknown as AnyRec).id), String((d as unknown as AnyRec).name)] as [string, string]),
  )

  // gallery docs keyed by image relationship id (identity = one doc per image)
  const res = await payload.find({ collection: 'gallery', limit: 100, overrideAccess: true, depth: 0 })
  check(res.totalDocs === entries.length, 'gallery count: expected ' + entries.length + ', found ' + res.totalDocs)
  const byImageId = new Map<string, AnyRec>()
  for (const d of res.docs) {
    const rec = d as unknown as AnyRec
    const imgId = idOf(rec.image)
    if (imgId === null) {
      fail('gallery doc ' + String(rec.id) + ' has no image relationship')
      continue
    }
    if (byImageId.has(imgId)) {
      fail('duplicate gallery docs share image id ' + imgId + ' (identity must be one doc per image)')
    }
    byImageId.set(imgId, rec)
  }

  let enc = 0

  for (const entry of entries) {
    out('- checking gallery item: ' + entry.id + ' (' + entry.imageKey + ')')
    const mEntry = mediaByKey.get(entry.imageKey)
    if (!mEntry) {
      fail('imageKey not found in media.json for ' + entry.id + ': ' + entry.imageKey)
      continue
    }
    const mediaDoc = mediaByFilename.get(mEntry.filename)
    if (!mediaDoc) {
      fail('live media doc not found for filename ' + mEntry.filename + ' (' + entry.id + ')')
      continue
    }
    const doc = byImageId.get(String((mediaDoc as AnyRec).id))
    if (!doc) {
      fail('no gallery doc for imageKey ' + entry.imageKey + ' (expected exactly one doc per image)')
      continue
    }

    // scalar round-trip (credit '' in the manifest - null-tolerant compare)
    check(doc.caption === entry.caption, 'caption mismatch for ' + entry.id + ': expected ' + snippet(entry.caption) + ', stored ' + snippet(doc.caption))
    check(doc.category === entry.category, 'category mismatch for ' + entry.id + ': expected ' + snippet(entry.category) + ', stored ' + snippet(doc.category))
    check(eq(doc.credit, entry.credit), 'credit mismatch for ' + entry.id + ': expected ' + snippet(entry.credit) + ', stored ' + snippet(doc.credit))
    check(doc.licenceStatus === entry.licenceStatus, 'licenceStatus mismatch for ' + entry.id + ': expected ' + snippet(entry.licenceStatus) + ', stored ' + snippet(doc.licenceStatus))
    check(eq(doc.permission, entry.licence), 'permission mismatch for ' + entry.id + ' (stored <- manifest licence): expected ' + snippet(entry.licence) + ', stored ' + snippet(doc.permission))
    check(eq(doc.alt, mEntry.alt), 'alt mismatch for ' + entry.id + ' (stored <- media alt): expected ' + snippet(mEntry.alt) + ', stored ' + snippet(doc.alt))

    // destination by name, soft policy mirrored
    const destId = idOf(doc.destination)
    if (destNamesManifest.has(entry.destination)) {
      const got = destId === null ? null : destNameById.get(destId) ?? null
      check(got === entry.destination, 'destination mismatch for ' + entry.id + ': expected name ' + snippet(entry.destination) + ', stored ' + snippet(got) + ' (raw ' + snippet(doc.destination) + ')')
    } else {
      check(destId === null, 'destination for ' + entry.id + ' should be empty (name not in destinations manifest), stored ' + snippet(doc.destination))
    }

    enc += nonAsciiCount(entry.caption) + nonAsciiCount(entry.licence)
  }

  // reverse pass: every gallery doc must map back to a manifest imageKey
  const manifestMediaIds = new Set<string>()
  for (const entry of entries) {
    const mEntry = mediaByKey.get(entry.imageKey)
    const mediaDoc = mEntry ? mediaByFilename.get(mEntry.filename) : undefined
    if (mediaDoc) manifestMediaIds.add(String((mediaDoc as AnyRec).id))
  }
  for (const imgId of byImageId.keys()) {
    if (!manifestMediaIds.has(imgId)) {
      fail('gallery doc with image id ' + imgId + ' has no manifest imageKey (unexpected extra doc)')
    }
  }

  // anonymous read: gallery read access is public and there is no status field
  const anon = await payload.find({ collection: 'gallery', overrideAccess: false, depth: 0, limit: 100 })
  check(anon.totalDocs === entries.length, 'anonymous read: expected ' + entries.length + ' gallery items, found ' + anon.totalDocs)
  out('anonymous read: ' + anon.totalDocs + '/' + entries.length + ' gallery items visible')

  if (failures.length > 0) {
    throw new Error(failures.length + ' assertion failure(s) - see the FAIL lines above')
  }

  out('verify-gallery OK - layer 6 asserted: ' + entries.length + '/' + entries.length + ' gallery items, all checks passed')
  out('encoding: ' + enc + ' non-ASCII characters round-tripped intact (console mojibake is display-only)')
  process.exit(0)
}

try {
  await main()
} catch (error: unknown) {
  err('verify-gallery FAILED')
  err(error instanceof Error ? (error.stack ?? error.message) : String(error))
  process.exit(1)
}
