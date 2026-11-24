import 'dotenv/config'
import fs from 'node:fs'
import path from 'node:path'
import { getPayload } from 'payload'
import config from '../payload.config'

// S7-E10 - experiences content verification (beyond row counts).
// Per record: name/icon/blurb/detail byte-match experiences.json, image resolves
// to the media.json filename for imageKey (contract rule 4), sortOrder equals the
// manifest array index (frontend grid order). Also: adventure detail carries a
// real U+2014 em-dash (double-encoding detector), and the anonymous read sees all
// six records (Experiences read access is public, no status field).
// ASCII-only output (Windows console encoding).

const SEED_DIR = path.resolve(process.cwd(), '../seed')

function out(msg: string): void {
  fs.writeSync(1, msg + '\n')
}
function err(msg: string): void {
  fs.writeSync(2, msg + '\n')
}

type ExperienceEntry = {
  slug: string
  name: string
  icon: string
  imageKey: string
  blurb: string
  detail: string
}

type MediaEntry = { key: string; filename: string }

const manifest = JSON.parse(fs.readFileSync(path.join(SEED_DIR, 'experiences.json'), 'utf8')) as ExperienceEntry[]
const mediaManifest = JSON.parse(fs.readFileSync(path.join(SEED_DIR, 'media.json'), 'utf8')) as MediaEntry[]
const filenameByKey = new Map(mediaManifest.map((m) => [m.key, m.filename] as [string, string]))

const payload = await getPayload({ config })

const authed = await payload.find({ collection: 'experiences', limit: 50, depth: 1, overrideAccess: true })
const bySlug = new Map(authed.docs.map((d) => [d.slug, d] as [string, typeof d]))
out('--- S7-E10: experiences content verification ---')
out('authenticated docs: ' + authed.totalDocs + ' (expected ' + manifest.length + ')')

let failures = 0
for (let i = 0; i < manifest.length; i++) {
  const entry = manifest[i]
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
  const fieldsOk = doc.name === entry.name && doc.icon === entry.icon && doc.blurb === entry.blurb && doc.detail === entry.detail
  const sortOk = doc.sortOrder === i
  if (imageMatch && fieldsOk && sortOk) {
    out('  ok ' + entry.slug + ' image=' + expectedFilename + ' fields=true sortOrder=' + doc.sortOrder)
  } else {
    err('  FAIL ' + entry.slug + ' imageMatch=' + imageMatch + ' fields=' + fieldsOk + ' sortOrder=' + doc.sortOrder + ' (expected ' + i + ')')
    failures += 1
  }
}

const adventure = bySlug.get('adventure')
const emDashOk = adventure !== undefined && typeof adventure.detail === 'string' && adventure.detail.includes('\u2014')
out('encoding check (adventure detail has real U+2014): ' + emDashOk)
if (!emDashOk) failures += 1

const anon = await payload.find({ collection: 'experiences', limit: 50, overrideAccess: false })
const anonOk = anon.totalDocs === manifest.length
out('anonymous read: ' + anon.totalDocs + ' (expected ' + manifest.length + ')')
if (!anonOk) failures += 1

if (failures > 0) {
  err('S7-E10 experiences verification FAIL - ' + failures + ' problem(s)')
  process.exit(1)
}
out('S7-E10 experiences verification PASS')
process.exit(0)
