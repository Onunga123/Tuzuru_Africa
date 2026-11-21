import 'dotenv/config'
import fs from 'node:fs'
import path from 'node:path'
import { getPayload } from 'payload'
import config from '../payload.config'

// S7-E9 - destinations content verification (beyond row counts).
// Per record: image resolves to the media.json filename for imageKey, imageAlt
// matches the manifest alt, description richText round-trips to the source
// paragraph, attractions count matches, status published.
// Also: stored text carries a real U+2019 apostrophe (double-encoding detector),
// and the anonymous read (published-only) sees every record.

const SEED_DIR = path.resolve(process.cwd(), '../seed')

function out(msg: string): void {
  fs.writeSync(1, msg + '\n')
}
function err(msg: string): void {
  fs.writeSync(2, msg + '\n')
}

type DestinationEntry = {
  slug: string
  name: string
  imageKey: string
  intro: string
  description: string
  attractions: string[]
}

type MediaEntry = { key: string; filename: string; alt: string }

const manifest = JSON.parse(fs.readFileSync(path.join(SEED_DIR, 'destinations.json'), 'utf8')) as DestinationEntry[]
const mediaManifest = JSON.parse(fs.readFileSync(path.join(SEED_DIR, 'media.json'), 'utf8')) as MediaEntry[]
const filenameByKey = new Map(mediaManifest.map((m) => [m.key, m.filename] as [string, string]))
const altByKey = new Map(mediaManifest.map((m) => [m.key, m.alt] as [string, string]))

function richTextText(value: unknown): string {
  const state = value as { root?: { children?: Array<{ children?: Array<{ text?: unknown }> }> } } | null | undefined
  const para = state?.root?.children?.[0]
  const text = para?.children?.[0]?.text
  return typeof text === 'string' ? text : ''
}

const payload = await getPayload({ config })

const authed = await payload.find({ collection: 'destinations', limit: 50, depth: 1, overrideAccess: true })
const bySlug = new Map(authed.docs.map((d) => [d.slug, d] as [string, typeof d]))
out('--- S7-E9: destinations content verification ---')
out('authenticated docs: ' + authed.totalDocs + ' (expected ' + manifest.length + ')')

let failures = 0
for (const entry of manifest) {
  const doc = bySlug.get(entry.slug)
  if (!doc) {
    err('  FAIL ' + entry.slug + ' missing')
    failures += 1
    continue
  }
  const img = doc.image as unknown as Record<string, unknown> | null | undefined
  const imgFilename = img && typeof img.filename === 'string' ? img.filename : null
  const expectedFilename = filenameByKey.get(entry.imageKey) ?? null
  const imageMatch = imgFilename !== null && imgFilename === expectedFilename
  const altOk = doc.imageAlt === altByKey.get(entry.imageKey) && (doc.imageAlt ?? '').length > 0
  const descOk = richTextText(doc.description) === entry.description
  const attractionsOk = (doc.attractions?.length ?? -1) === entry.attractions.length
  const statusOk = doc.status === 'published'
  if (imageMatch && altOk && descOk && attractionsOk && statusOk) {
    out('  ok ' + entry.slug + ' image=' + expectedFilename + ' alt=true desc=true attractions=' + entry.attractions.length + ' published=true')
  } else {
    err('  FAIL ' + entry.slug + ' imageMatch=' + imageMatch + ' alt=' + altOk + ' desc=' + descOk + ' attractions=' + attractionsOk + ' status=' + statusOk)
    failures += 1
  }
}

const mara = bySlug.get('maasai-mara')
const apostropheOk = mara !== undefined && mara.intro.includes('\u2019')
out('encoding check (maasai-mara intro has real U+2019): ' + apostropheOk)
if (!apostropheOk) failures += 1

const anon = await payload.find({ collection: 'destinations', limit: 50, overrideAccess: false })
const anonOk = anon.totalDocs === manifest.length
out('anonymous read (published only): ' + anon.totalDocs + ' (expected ' + manifest.length + ')')
if (!anonOk) failures += 1

if (failures > 0) {
  err('S7-E9 destinations verification FAIL - ' + failures + ' problem(s)')
  process.exit(1)
}
out('S7-E9 destinations verification PASS')
process.exit(0)
