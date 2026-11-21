import 'dotenv/config'
import fs from 'node:fs'
import path from 'node:path'
import { getPayload } from 'payload'
import config from '../payload.config'

// S7 reconcile tool — lists media docs and prunes any whose filename is NOT in
// seed/media.json (the MR-05 asset manifest is the source of truth).
// Dry run by default: lists everything, deletes nothing.
// Set TUZURU_PRUNE_EXECUTE=1 to actually delete.
// Seeding-phase tool only — never run once the owner uploads real assets (DL-009).

const SEED_DIR = path.resolve(process.cwd(), '../seed')
const EXECUTE = process.env.TUZURU_PRUNE_EXECUTE === '1'

function out(msg: string): void {
  fs.writeSync(1, msg + '\n')
}
function err(msg: string): void {
  fs.writeSync(2, msg + '\n')
}

const manifest = JSON.parse(fs.readFileSync(path.join(SEED_DIR, 'media.json'), 'utf8')) as Array<{ filename: string }>
const manifestFilenames = new Set(manifest.map((entry) => entry.filename))

const payload = await getPayload({ config })
const all = await payload.find({
  collection: 'media',
  limit: 500,
  sort: 'createdAt',
  overrideAccess: true,
})

out('media docs total: ' + all.totalDocs)
for (const doc of all.docs) {
  const inManifest = manifestFilenames.has(doc.filename)
  out(
    (inManifest ? '  ok   ' : '  ??   ') +
      doc.id + '  ' + doc.filename + '  created=' + doc.createdAt +
      (inManifest ? '' : '   <-- NOT in manifest'),
  )
}

const strangers = all.docs.filter((doc) => !manifestFilenames.has(doc.filename))
out('not in manifest: ' + strangers.length)

if (strangers.length === 0) {
  out('nothing to prune — media collection matches the manifest')
  process.exit(0)
}

if (!EXECUTE) {
  out('dry run — no changes made. Set TUZURU_PRUNE_EXECUTE=1 to delete the docs marked ?? above.')
  process.exit(0)
}

for (const doc of strangers) {
  await payload.delete({ collection: 'media', id: doc.id, overrideAccess: true })
  out('deleted ' + doc.id + '  ' + doc.filename)
}

const after = await payload.count({ collection: 'media', overrideAccess: true })
out('media docs after prune: ' + after.totalDocs + ' (expected 19)')
if (after.totalDocs !== 19) {
  err('count mismatch after prune: ' + after.totalDocs + ' != 19')
  process.exit(1)
}
out('prune OK')
process.exit(0)
