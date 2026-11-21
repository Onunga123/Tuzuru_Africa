import 'dotenv/config'
import fs from 'node:fs'
import { getPayload } from 'payload'
import config from '../payload.config'

// S7-E8 - CHG-017 runtime assertion: media provenance fields are internal-only.
// Authenticated local read (overrideAccess: true) must include all 5 provenance fields.
// Anonymous read (overrideAccess: false, no user) must strip all 5. This is the same
// enforcement path the anonymous REST/GraphQL layer uses (REST passes overrideAccess: false).
// ASCII-only output (Windows console encoding).

const PROVENANCE_FIELDS = ['origin', 'credit', 'licence', 'licenceStatus', 'permissionRef']

function out(msg: string): void {
  fs.writeSync(1, msg + '\n')
}
function err(msg: string): void {
  fs.writeSync(2, msg + '\n')
}

out('--- S7-E8: CHG-017 media provenance runtime assertion ---')
const payload = await getPayload({ config })

const authed = await payload.find({
  collection: 'media',
  limit: 1,
  sort: 'createdAt',
  overrideAccess: true,
})
const authedDoc = authed.docs[0]
if (!authedDoc) throw new Error('no media docs found')
out('authenticated read (overrideAccess: true): ' + authedDoc.filename)
let authedOk = true
for (const field of PROVENANCE_FIELDS) {
  const present = Object.prototype.hasOwnProperty.call(authedDoc, field)
  out('  ' + (present ? 'present  ' : 'MISSING  ') + field)
  if (!present) authedOk = false
}

const anon = await payload.find({
  collection: 'media',
  limit: 1,
  sort: 'createdAt',
  overrideAccess: false,
})
const anonDoc = anon.docs[0] as Record<string, unknown>
out('anonymous read (overrideAccess: false): ' + String(anonDoc.filename))
let anonOk = true
for (const field of PROVENANCE_FIELDS) {
  const present = Object.prototype.hasOwnProperty.call(anonDoc, field)
  out('  ' + (present ? 'LEAKED   ' : 'stripped ') + field)
  if (present) anonOk = false
}
const altOk = typeof anonDoc.alt === 'string' && (anonDoc.alt as string).length > 0
out('alt visible anonymously: ' + altOk)

if (!authedOk) {
  err('FAIL - authenticated read missing provenance fields')
  process.exit(1)
}
if (!anonOk) {
  err('FAIL - anonymous read leaks provenance fields')
  process.exit(1)
}
if (!altOk) {
  err('FAIL - alt not visible anonymously')
  process.exit(1)
}
out('CHG-017 runtime assertion PASS - provenance fields internal-only')
process.exit(0)
