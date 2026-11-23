/**
 * verify-guides.ts - read-only probe for seed layer 5 (guides) - rev 2
 *
 * Mirrors verify-tours.ts. Asserts the seeded guides collection against
 * seed/guides.json using the MR-09 conventions:
 *   - idempotent upsert keyed by slug; DB holds exactly the manifest set
 *   - scalars round-trip: title, category, date, readingTime, excerpt
 *   - imageKey -> media.json key -> filename -> live media doc
 *   - imageAlt derived from the media entry alt (alt travels with the record)
 *   - content richText: one h2 heading node + one paragraph node per manifest
 *     block; Payload 3 lexical stores the serialized editor state as
 *     { root: { type: 'root', ... } } so the wrapper is unwrapped before checks
 *   - manifest-absent fields stay unset: lastUpdated, socialImage, relatedDestinations
 *   - adminOrPublished: status published and anonymous read sees all guides
 *
 * Rev 2: unwrap the lexical { root: ... } editor-state wrapper before asserting
 * the h2/paragraph structure (rev 1 checked g.content directly and failed on
 * all three guides; scalars/image/access checks all passed in rev 1).
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

interface GuideBlock {
  heading: string
  body: string
}

interface GuideEntry {
  slug: string
  title: string
  category: string
  imageKey: string
  date: string
  readingTime: string
  excerpt: string
  content: GuideBlock[]
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

function normDate(v: unknown): string {
  const d = new Date(v as string)
  return isNaN(d.getTime()) ? String(v) : d.toISOString()
}

function nodeText(node: AnyRec): string {
  const children = Array.isArray(node.children) ? (node.children as AnyRec[]) : []
  return children
    .map(c => (c && typeof c === 'object' && c.type === 'text' ? String(c.text ?? '') : ''))
    .join('')
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
  out('verify-guides start (read-only probe rev 2, SEED_DIR=' + SEED_DIR + ')')

  const entries = loadJson<GuideEntry[]>('guides.json')
  const mediaEntries = loadJson<MediaEntry[]>('media.json')
  const mediaByKey = new Map<string, MediaEntry>(mediaEntries.map(m => [m.key, m]))

  // media index: id -> doc (integer PKs arrive as numbers at depth 0)
  const mediaRes = await payload.find({ collection: 'media', limit: 100, overrideAccess: true, depth: 0 })
  const mediaById = new Map<string, AnyRec>(
    mediaRes.docs.map(d => [String((d as unknown as AnyRec).id), d as unknown as AnyRec] as [string, AnyRec]),
  )

  // count guard + slug set equality
  const res = await payload.find({ collection: 'guides', limit: 50, overrideAccess: true, depth: 0 })
  check(res.totalDocs === entries.length, 'guides count: expected ' + entries.length + ', found ' + res.totalDocs)
  const bySlug = new Map<string, AnyRec>(
    res.docs.map(d => [String((d as unknown as AnyRec).slug), d as unknown as AnyRec] as [string, AnyRec]),
  )
  const manifestSlugs = new Set<string>(entries.map(e => e.slug))
  for (const e of entries) check(bySlug.has(e.slug), 'guide missing from DB: ' + e.slug)
  for (const slug of bySlug.keys()) {
    if (!manifestSlugs.has(slug)) fail('unexpected extra guide in DB: ' + slug)
  }

  let enc = 0

  for (const entry of entries) {
    out('- checking guide: ' + entry.slug)
    const g = bySlug.get(entry.slug)
    if (!g) continue

    // scalar round-trip
    check(g.title === entry.title, 'title mismatch for ' + entry.slug + ': expected ' + snippet(entry.title) + ', stored ' + snippet(g.title))
    check(g.category === entry.category, 'category mismatch for ' + entry.slug + ': expected ' + snippet(entry.category) + ', stored ' + snippet(g.category))
    check(normDate(g.date) === normDate(entry.date), 'date mismatch for ' + entry.slug + ': expected ' + normDate(entry.date) + ', stored ' + String(g.date))
    check(g.readingTime === entry.readingTime, 'readingTime mismatch for ' + entry.slug + ': expected ' + snippet(entry.readingTime) + ', stored ' + snippet(g.readingTime))
    check(g.excerpt === entry.excerpt, 'excerpt mismatch for ' + entry.slug + ': expected ' + snippet(entry.excerpt) + ', stored ' + snippet(g.excerpt))
    check(g.status === 'published', 'status for ' + entry.slug + ': expected published, stored ' + snippet(g.status))

    // manifest-absent fields stay unset
    check(g.lastUpdated == null, 'lastUpdated for ' + entry.slug + ' should be unset (not in manifest), stored ' + snippet(g.lastUpdated))
    check(g.socialImage == null, 'socialImage for ' + entry.slug + ' should be unset (not in manifest), stored ' + snippet(g.socialImage))
    check(g.relatedDestinations == null || (Array.isArray(g.relatedDestinations) && g.relatedDestinations.length === 0), 'relatedDestinations for ' + entry.slug + ' should be unset (not in manifest), stored ' + snippet(g.relatedDestinations))

    // image: imageKey -> media.json key -> filename -> live media doc
    const mEntry = mediaByKey.get(entry.imageKey)
    if (!mEntry) {
      fail('imageKey not found in media.json for ' + entry.slug + ': ' + entry.imageKey)
    } else {
      const imgId = idOf(g.image)
      const imgDoc = imgId === null ? undefined : mediaById.get(imgId)
      if (!imgDoc) {
        fail('image relationship unresolved for ' + entry.slug + ' (stored ' + snippet(g.image) + ')')
      } else {
        check(imgDoc.filename === mEntry.filename, 'image filename mismatch for ' + entry.slug + ': expected ' + mEntry.filename + ', stored ' + snippet(imgDoc.filename))
      }
      check(String(g.imageAlt ?? '') === String(mEntry.alt ?? ''), 'imageAlt mismatch for ' + entry.slug + ' (expected media alt): expected ' + snippet(mEntry.alt) + ', stored ' + snippet(g.imageAlt))
    }

    // content richText: per block one h2 heading node + one paragraph node.
    // Payload 3 lexical fields hold the serialized editor state
    // { root: { type: 'root', children: [...] } } - unwrap defensively,
    // tolerating a bare root node as well.
    const rawContent = g.content as AnyRec | null
    let content: AnyRec | null = null
    if (rawContent && typeof rawContent === 'object') {
      if (rawContent.root && typeof rawContent.root === 'object') {
        content = rawContent.root as AnyRec
      } else {
        content = rawContent
      }
    }
    if (!content || content.type !== 'root' || !Array.isArray(content.children)) {
      const keys = rawContent && typeof rawContent === 'object' ? Object.keys(rawContent).join(',') : String(typeof rawContent)
      fail('content root missing or malformed for ' + entry.slug + ' (top-level keys: ' + keys + ')')
    } else {
      const kids = content.children as AnyRec[]
      const blocks = entry.content
      check(kids.length === blocks.length * 2, 'content children for ' + entry.slug + ': expected ' + blocks.length * 2 + ' (h2 heading + paragraph per block), found ' + kids.length)
      for (let i = 0; i < blocks.length; i++) {
        const h = kids[2 * i] as AnyRec | undefined
        const p = kids[2 * i + 1] as AnyRec | undefined
        if (!h || !p) continue
        check(h.type === 'heading', 'block ' + i + ' of ' + entry.slug + ': expected heading node, found type=' + snippet(h.type))
        check(h.tag === 'h2', 'block ' + i + ' of ' + entry.slug + ': expected heading tag h2, found ' + snippet(h.tag))
        check(nodeText(h) === blocks[i].heading, 'block ' + i + ' heading mismatch for ' + entry.slug + ': expected ' + snippet(blocks[i].heading) + ', stored ' + snippet(nodeText(h)))
        check(p.type === 'paragraph', 'block ' + i + ' of ' + entry.slug + ': expected paragraph node, found type=' + snippet(p.type))
        check(nodeText(p) === blocks[i].body, 'block ' + i + ' body mismatch for ' + entry.slug + ': expected ' + snippet(blocks[i].body) + ', stored ' + snippet(nodeText(p)))
      }
      for (const b of blocks) enc += nonAsciiCount(b.heading) + nonAsciiCount(b.body)
      enc += nonAsciiCount(entry.title) + nonAsciiCount(entry.excerpt)
    }
  }

  // anonymous read: adminOrPublished must expose exactly the published manifest set
  const anon = await payload.find({ collection: 'guides', overrideAccess: false, depth: 0, limit: 50 })
  check(anon.totalDocs === entries.length, 'anonymous read: expected ' + entries.length + ' published guides, found ' + anon.totalDocs)
  const anonSlugs = new Set<string>(anon.docs.map(d => String((d as unknown as AnyRec).slug)))
  for (const e of entries) check(anonSlugs.has(e.slug), 'anonymous read missing published guide: ' + e.slug)
  for (const s of anonSlugs) {
    if (!manifestSlugs.has(s)) fail('anonymous read exposed unexpected guide: ' + s)
  }
  out('anonymous read: ' + anon.totalDocs + '/' + entries.length + ' published guides visible')

  if (failures.length > 0) {
    throw new Error(failures.length + ' assertion failure(s) - see the FAIL lines above')
  }

  out('verify-guides OK - layer 5 asserted: ' + entries.length + '/' + entries.length + ' guides, all checks passed')
  out('encoding: ' + enc + ' non-ASCII characters round-tripped intact (console mojibake is display-only)')
  process.exit(0)
}

try {
  await main()
} catch (error: unknown) {
  err('verify-guides FAILED')
  err(error instanceof Error ? (error.stack ?? error.message) : String(error))
  process.exit(1)
}
