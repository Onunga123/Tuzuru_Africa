/**
 * verify-tours.ts - layer 4 verification probe (S7-E11, rev 2)
 *
 * Read-only. Asserts the tours layer against seed/tours.json:
 *   - count guard + 8/8 slug match
 *   - scalar field round-trip (title, destinationLabel, duration, days,
 *     overview, accommodation, transport, important, priceBasis, featured, status)
 *   - imageAlt round-trip (seed derives it from the media entry alt when the
 *     tour manifest has no imageAlt of its own)
 *   - block arrays round-trip (highlights, inclusions, exclusions)
 *   - itinerary round-trip with day stored as string
 *   - image -> live media doc filename (via media.json key -> filename)
 *   - experiences -> live experience ids by exact name
 *   - destination relationship: resolved slugs + explicit gap report (bwindi)
 *   - destinations.relatedTours back-fill: resolved subset per destination
 *   - anonymous read sees exactly the published set
 *
 * Postgres adapter note: integer primary keys by default, so at depth 0
 * relationship values arrive as numbers. idOf() accepts numbers, strings and
 * populated docs; all id-keyed maps are keyed by String(id).
 *
 * Text equality is exact round-trip, which also proves UTF-8 integrity
 * (any mojibake would fail the equality checks).
 *
 * Exit code 0 = PASS, 1 = FAIL (all issues printed first).
 */
import 'dotenv/config'
import fs from 'node:fs'
import path from 'node:path'
import { getPayload } from 'payload'
import config from '../payload.config'

const SEED_DIR = path.resolve(process.cwd(), '../seed')

const out = (m: string) => fs.writeSync(1, m + '\n')
const err = (m: string) => fs.writeSync(2, m + '\n')

function loadJson<T>(name: string): T {
  const p = path.join(SEED_DIR, name)
  if (!fs.existsSync(p)) throw new Error(`missing manifest: ${p}`)
  return JSON.parse(fs.readFileSync(p, 'utf8')) as T
}

type MediaEntry = { key: string; filename: string; alt: string }
type DestinationEntry = { slug: string; related?: string[] }
type TourEntry = {
  slug: string
  title: string
  destination?: string
  destinationSlug?: string
  duration: string
  days: number
  imageKey: string
  imageAlt?: string
  experiences: string[]
  featured?: boolean
  overview: string
  highlights: Array<string | { highlight: string }>
  itinerary: Array<{ day: number | string; title: string; detail: string }>
  accommodation?: string
  transport?: string
  inclusions: Array<string | { inclusion: string }>
  exclusions: Array<string | { exclusion: string }>
  important?: string
  priceBasis?: string
}

type AnyRec = Record<string, unknown>

/** JSON block entry (plain string or {key: text}) -> text */
function textOf(v: unknown, key: string): string {
  if (typeof v === 'string') return v
  const o = (v ?? {}) as AnyRec
  return typeof o[key] === 'string' ? (o[key] as string) : ''
}

/** null-tolerant equality (null/undefined/'' are equivalent) */
function eq(a: unknown, b: unknown): boolean {
  const x = a === null || a === undefined ? '' : a
  const y = b === null || b === undefined ? '' : b
  return x === y
}

function nonAsciiCount(s: unknown): number {
  return typeof s === 'string' ? (s.match(/[^\x00-\x7F]/g) ?? []).length : 0
}

/**
 * relationship value -> id string. Handles:
 *  - number (db-postgres integer ids at depth 0)
 *  - string (uuid ids / already-stringified)
 *  - populated doc object (depth > 0), with number or string id
 */
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

async function main() {
  const payload = await getPayload({ config })

  const toursJson = loadJson<TourEntry[]>('tours.json')
  const mediaJson = loadJson<MediaEntry[]>('media.json')
  const destJson = loadJson<DestinationEntry[]>('destinations.json')

  const failures: string[] = []
  const fail = (m: string) => {
    failures.push(m)
    err(`  FAIL ${m}`)
  }
  const ok = (m: string) => out(`  ok ${m}`)

  out(`verify-tours start: SEED_DIR=${SEED_DIR}`)

  const mediaByKey = new Map(mediaJson.map((m) => [m.key, m]))
  const destSlugsManifest = new Set(destJson.map((d) => d.slug))
  const tourSlugsManifest = new Set(toursJson.map((t) => t.slug))

  // --- live docs (depth 0: relationships stay raw values; idOf() tolerates numbers/strings/docs) ---
  const toursRes = await payload.find({ collection: 'tours', limit: 100, depth: 0, overrideAccess: true })
  const destsRes = await payload.find({ collection: 'destinations', limit: 100, depth: 0, overrideAccess: true })
  const expsRes = await payload.find({ collection: 'experiences', limit: 100, depth: 0, overrideAccess: true })

  out(`live docs: tours=${toursRes.totalDocs} destinations=${destsRes.totalDocs} experiences=${expsRes.totalDocs}`)

  const tourBySlug = new Map(toursRes.docs.map((d) => [d.slug as string, d as unknown as AnyRec]))
  const tourById = new Map(toursRes.docs.map((d) => [String(d.id), d as unknown as AnyRec]))
  const expById = new Map(expsRes.docs.map((d) => [String(d.id), d as unknown as AnyRec]))
  const expByName = new Map(expsRes.docs.map((d) => [d.name as string, d as unknown as AnyRec]))
  const destBySlug = new Map(destsRes.docs.map((d) => [d.slug as string, d as unknown as AnyRec]))

  if (toursRes.totalDocs !== toursJson.length) fail(`tour count ${toursRes.totalDocs} != manifest ${toursJson.length}`)

  let nonAscii = 0
  out('--- per-tour checks ---')
  for (const entry of toursJson) {
    const doc = tourBySlug.get(entry.slug)
    if (!doc) {
      fail(`${entry.slug}: missing from DB`)
      continue
    }
    const issues: string[] = []
    let destSlugGot = '-'
    let imgGot = '-'

    // scalar + flag round-trip (imageAlt falls back to the media entry alt)
    const scalars: Array<[string, unknown, unknown]> = [
      ['title', doc.title, entry.title],
      ['destinationLabel', doc.destinationLabel, entry.destination ?? ''],
      ['duration', doc.duration, entry.duration],
      ['days', doc.days, entry.days],
      ['imageAlt', doc.imageAlt, entry.imageAlt ?? mediaByKey.get(entry.imageKey)?.alt ?? ''],
      ['overview', doc.overview, entry.overview],
      ['accommodation', doc.accommodation, entry.accommodation ?? ''],
      ['transport', doc.transport, entry.transport ?? ''],
      ['important', doc.important, entry.important ?? ''],
      ['priceBasis', doc.priceBasis, entry.priceBasis ?? 'On request'],
      ['featured', doc.featured, entry.featured === true],
      ['status', doc.status, 'published'],
    ]
    for (const [k, got, want] of scalars) {
      if (!eq(got, want)) issues.push(`${k}: got=${JSON.stringify(got ?? null)} want=${JSON.stringify(want ?? null)}`)
    }

    // block arrays
    const blocks: Array<[string, unknown, unknown, string]> = [
      ['highlights', doc.highlights, entry.highlights ?? [], 'highlight'],
      ['inclusions', doc.inclusions, entry.inclusions ?? [], 'inclusion'],
      ['exclusions', doc.exclusions, entry.exclusions ?? [], 'exclusion'],
    ]
    for (const [name, gotArr, wantArr, key] of blocks) {
      const g = (Array.isArray(gotArr) ? gotArr : []) as AnyRec[]
      const w = (Array.isArray(wantArr) ? wantArr : []) as unknown[]
      if (g.length !== w.length) {
        issues.push(`${name}: count ${g.length} != ${w.length}`)
        continue
      }
      for (let i = 0; i < w.length; i++) {
        if (!eq((g[i] ?? {})[key], textOf(w[i], key))) issues.push(`${name}[${i}]: text mismatch`)
      }
    }

    // itinerary (day coerced to string on write)
    const itG = (Array.isArray(doc.itinerary) ? doc.itinerary : []) as AnyRec[]
    const itW = Array.isArray(entry.itinerary) ? entry.itinerary : []
    if (itG.length !== itW.length) {
      issues.push(`itinerary: count ${itG.length} != ${itW.length}`)
    } else {
      for (let i = 0; i < itW.length; i++) {
        const wantDay = String(itW[i].day)
        if (!eq(itG[i]?.day, wantDay)) issues.push(`itinerary[${i}].day: got=${JSON.stringify(itG[i]?.day ?? null)} want=${JSON.stringify(wantDay)}`)
        if (typeof itG[i]?.day !== 'string') issues.push(`itinerary[${i}].day: not a string in DB`)
        if (!eq(itG[i]?.title, itW[i].title)) issues.push(`itinerary[${i}].title mismatch`)
        if (!eq(itG[i]?.detail, itW[i].detail)) issues.push(`itinerary[${i}].detail mismatch`)
      }
    }

    // image -> live media doc
    const mEntry = mediaByKey.get(entry.imageKey)
    if (!mEntry) {
      issues.push(`imageKey '${entry.imageKey}': not found in media.json`)
    } else {
      const imageId = idOf(doc.image)
      if (!imageId) {
        issues.push(`image: empty, expected live media doc (raw=${JSON.stringify(doc.image ?? null)})`)
      } else {
        const mdoc = (await payload.findByID({ collection: 'media', id: imageId, depth: 0, overrideAccess: true })) as unknown as AnyRec
        imgGot = String(mdoc.filename ?? '?')
        if (mdoc.filename !== mEntry.filename) issues.push(`image filename: got=${imgGot} want=${mEntry.filename}`)
        if (!eq(mdoc.alt, mEntry.alt)) issues.push(`media alt: got=${JSON.stringify(mdoc.alt ?? null)} want=${JSON.stringify(mEntry.alt)}`)
      }
    }

    // destination relationship (soft policy: unresolved slug -> empty + report)
    const wantDest = entry.destinationSlug ?? ''
    const destId = idOf(doc.destination)
    if (wantDest && destSlugsManifest.has(wantDest)) {
      if (!destId) {
        issues.push(`destination: empty, want '${wantDest}' (raw=${JSON.stringify(doc.destination ?? null)})`)
      } else {
        const ddoc = (await payload.findByID({ collection: 'destinations', id: destId, depth: 0, overrideAccess: true })) as unknown as AnyRec
        if (ddoc.slug !== wantDest) issues.push(`destination: got='${String(ddoc.slug)}' want='${wantDest}'`)
        else destSlugGot = wantDest
      }
    } else if (wantDest) {
      if (destId) issues.push(`destination: expected empty ('${wantDest}' unresolved) but is set`)
      else ok(`${entry.slug}: destination empty - '${wantDest}' not in destinations.json (expected gap)`)
    } else if (destId) {
      issues.push('destination: set but manifest has no destinationSlug')
    }

    // experiences by exact name
    const wantNames = [...(entry.experiences ?? [])].sort()
    const unresolved = wantNames.filter((n) => !expByName.has(n))
    if (unresolved.length) issues.push(`experience names not found live: ${unresolved.join(', ')}`)
    const expIds = ((Array.isArray(doc.experiences) ? doc.experiences : []) as unknown[])
      .map(idOf)
      .filter((x): x is string => !!x)
    const gotNames = expIds.map((id) => (expById.get(id)?.name as string) ?? '').filter(Boolean).sort()
    if (gotNames.length !== wantNames.length || gotNames.join('|') !== wantNames.join('|')) {
      issues.push(`experiences: got=[${gotNames.join('|')}] want=[${wantNames.join('|')}]`)
    }

    // non-ASCII volume for the encoding note
    nonAscii += nonAsciiCount(entry.overview) + nonAsciiCount(entry.important)
    for (const h of entry.highlights ?? []) nonAscii += nonAsciiCount(textOf(h, 'highlight'))
    for (const d of entry.itinerary ?? []) nonAscii += nonAsciiCount(d.detail)

    if (issues.length) {
      fail(`${entry.slug}: ${issues.length} issue(s) -> ${issues.join(' | ')}`)
    } else {
      ok(`${entry.slug} (dest=${destSlugGot}, img=${imgGot}, exp=${expIds.length}, days=${String(doc.days)}, itinerary=${itG.length}, featured=${String(doc.featured)}, ${String(doc.status)})`)
    }
  }

  // --- destinations.relatedTours back-fill ---
  out('--- destinations.relatedTours ---')
  for (const dEntry of destJson) {
    const ddoc = destBySlug.get(dEntry.slug)
    if (!ddoc) {
      fail(`${dEntry.slug}: destination missing from DB`)
      continue
    }
    const related = dEntry.related ?? []
    const want = related.filter((s) => tourSlugsManifest.has(s))
    const dropped = related.filter((s) => !tourSlugsManifest.has(s))
    const got = ((Array.isArray(ddoc.relatedTours) ? ddoc.relatedTours : []) as unknown[])
      .map(idOf)
      .filter((x): x is string => !!x)
      .map((id) => String((tourById.get(id)?.slug as string | undefined) ?? ''))
      .filter((s) => s !== '')
    const wantS = [...want].sort().join('|')
    const gotS = [...got].sort().join('|')
    if (wantS !== gotS) {
      fail(`${dEntry.slug}: relatedTours got=[${gotS}] want=[${wantS}]`)
    } else {
      ok(`${dEntry.slug} -> ${got.length} of ${related.length}${dropped.length ? ` (dropped: ${dropped.join(', ')})` : ''}`)
    }
  }

  // --- anonymous read (adminOrPublished) ---
  out('--- anonymous read ---')
  const anon = await payload.find({ collection: 'tours', overrideAccess: false, depth: 0, limit: 100 })
  const drafts = anon.docs.filter((d) => d.status !== 'published')
  if (anon.totalDocs !== toursJson.length) fail(`anonymous read: ${anon.totalDocs} visible != ${toursJson.length} expected`)
  else ok(`anonymous read: ${anon.totalDocs}/${toursJson.length} published tours visible`)
  if (drafts.length) fail(`anonymous read: ${drafts.length} non-published tour(s) visible`)

  out(`encoding: ${nonAscii} non-ASCII characters compared via exact round-trip (mojibake would fail)`)

  if (failures.length) {
    err(`VERIFY FAIL: ${failures.length} issue(s)`)
    process.exit(1)
  }
  out('VERIFY PASS: layer 4 tours - field round-trip, media/experience/destination links, relatedTours back-fill, anonymous visibility all OK')
}

try {
  await main()
  process.exit(0)
} catch (e) {
  err(`verify-tours FAILED: ${e instanceof Error ? e.message : String(e)}`)
  process.exit(1)
}
