import 'dotenv/config'
import fs from 'node:fs'
import path from 'node:path'
import { getPayload } from 'payload'
import config from '../payload.config'
import type { Payload } from 'payload'

// S7 seed script — MR-09 import contract (seed/README.md + MIGRATION.md section 8).
// Layers: 1 media | 2 destinations | 3 experiences | 4 tours | 5 guides | 6 gallery | 7 globals.
// Idempotent: upsert on filename (media) / slug (content). Safe to re-run.
//
// Entry point MUST use top-level await: `payload run` exits with code 0 as soon as
// module evaluation resolves. A fire-and-forget main() is killed mid-flight (right
// after 'seed start', during getPayload) — root cause of the two silent truncated
// runs. Output goes through fs.writeSync so nothing can be lost to pipe buffering.

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

function loadJson<T>(name: string): T {
  const full = path.join(SEED_DIR, name)
  if (!fs.existsSync(full)) throw new Error('missing seed file: ' + full)
  return JSON.parse(fs.readFileSync(full, 'utf8')) as T
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

async function main(): Promise<void> {
  out('seed start: SEED_DIR=' + SEED_DIR + ' MEDIA_DIR=' + MEDIA_DIR)
  const payload = await getPayload({ config })
  out('--- layer 1: media ---')
  const media = await upsertMedia(payload)
  const total = await payload.count({ collection: 'media', overrideAccess: true })
  out('media done: created=' + media.created + ' updated=' + media.updated + ' total=' + total.totalDocs + ' (expected 19)')
  if (total.totalDocs !== 19) throw new Error('media count mismatch: ' + total.totalDocs + ' != 19')
  out('seed OK - layer 1 verified')
  process.exit(0)
}

try {
  await main()
} catch (error: unknown) {
  err('seed FAILED')
  err(error instanceof Error ? (error.stack ?? error.message) : String(error))
  process.exit(1)
}
