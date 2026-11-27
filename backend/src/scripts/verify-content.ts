// verify-content.ts - CHG-026 verification: travel-seasons, wildlife-calendar, faqs
// Run: npm run payload -- run src/scripts/verify-content.ts
// DB-side integrity checks against the live schema (TravelSeasons.ts / WildlifeCalendar.ts / Faqs.ts).
// Expected counts and FAQ group distribution come from the CHG-026 seed run (2026-11-27).

import fs from 'fs'
import { getPayload } from 'payload'
import config from '../payload.config'

type Row = Record<string, any>

const out = (s: string) => fs.writeSync(1, s + '\n')

let passes = 0
let warns = 0
let fails = 0

const pass = (s: string) => { passes++; out('  PASS ' + s) }
const fail = (s: string) => { fails++; fs.writeSync(2, '  FAIL ' + s + '\n') }
const note = (s: string) => { warns++; fs.writeSync(2, '  WARN ' + s + '\n') }

// Mojibake sentinels: UTF-8 bytes misread through a legacy codepage. The seed console
// showed the pricing FAQ question garbled (curly quotes rendered through CP437), which
// proves the manifest held proper typographic quotes and the seed stores proper UTF-8.
// The stored DB text must therefore contain none of these codepoints anywhere.
const MOJIBAKE = ['\u00D4', '\u00C3', '\u00E2', '\u20AC'] // O-circumflex, A-tilde, a-circumflex, euro sign

const trunc = (v: unknown, n: number) => {
  const s = typeof v === 'string' ? v : ''
  return s.length > n ? s.slice(0, n - 3) + '...' : s
}

const scanMojibake = (label: string, v: unknown) => {
  if (typeof v !== 'string' || v.length === 0) return
  for (const mark of MOJIBAKE) {
    const idx = v.indexOf(mark)
    if (idx >= 0) {
      fail(label + ': mojibake sentinel ' + JSON.stringify(mark) + ' near "' + v.slice(Math.max(0, idx - 20), idx + 20) + '"')
    }
  }
}

const checkImage = (label: string, imageId: unknown, mediaFile: Map<string, string>): string | null => {
  if (imageId == null) {
    fail(label + ': image missing (required by schema)')
    return null
  }
  const key = String(imageId)
  const file = mediaFile.get(key)
  if (!file) {
    fail(label + ': image id ' + key + ' has no live media doc')
    return null
  }
  return file
}

const main = async () => {
  out('verify-content start')

  const payload = await getPayload({ config })

  // ---- media index (int PK -> filename), depth 0 ----
  const media = await payload.find({ collection: 'media', limit: 100, depth: 0 })
  const mediaFile = new Map<string, string>()
  for (const m of media.docs as Row[]) mediaFile.set(String(m.id), String(m.filename ?? '(no filename)'))
  if (mediaFile.size === 19) pass('media index: 19 docs (matches seed layer 1)')
  else fail('media index: ' + mediaFile.size + ' docs (expected 19)')

  // ---- layer 7: travel-seasons (expect 4) ----
  out('--- travel-seasons (expect 4) ---')
  const seasons = await payload.find({ collection: 'travel-seasons', limit: 20, depth: 0, sort: 'sortOrder' })
  if (seasons.totalDocs === 4) pass('travel-seasons count = 4')
  else fail('travel-seasons count = ' + seasons.totalDocs + ' (expected 4)')

  const CROWD = ['quiet', 'moderate', 'busy']
  const BANDS = ['Best value', 'Mid season', 'Premium']
  let lastSort = -Infinity
  ;(seasons.docs as Row[]).forEach((s, i) => {
    const name = String(s.name ?? '')
    const label = 'season "' + (name || '#' + i) + '"'
    if (!name) fail(label + ': empty name')
    if (!CROWD.includes(s.crowdLevel)) fail(label + ': crowdLevel ' + JSON.stringify(s.crowdLevel ?? null) + ' not in [' + CROWD.join(' | ') + ']')
    if (!BANDS.includes(s.priceBand)) fail(label + ': priceBand ' + JSON.stringify(s.priceBand ?? null) + ' not in [' + BANDS.join(' | ') + ']')
    const file = checkImage(label, s.image, mediaFile)
    ;['name', 'months', 'description', 'highlights', 'weather', 'bestFor'].forEach((f) => scanMojibake(label + '.' + f, s[f]))
    if (typeof s.sortOrder === 'number') {
      if (s.sortOrder > lastSort) lastSort = s.sortOrder
      else note(label + ': sortOrder ' + s.sortOrder + ' breaks ascending order (previous ' + (lastSort === -Infinity ? '-' : String(lastSort)) + ')')
    } else {
      note(label + ': sortOrder not set')
    }
    if (!s.months) note(label + ': months empty (optional field)')
    out('  ~ ' + label + ' | crowd=' + s.crowdLevel + ' price=' + s.priceBand + ' months="' + (s.months ?? '') + '" image=' + (file ?? '(none)'))
  })

  // ---- layer 8: wildlife-calendar (expect 8) ----
  out('--- wildlife-calendar (expect 8) ---')
  const cal = await payload.find({ collection: 'wildlife-calendar', limit: 20, depth: 0 })
  if (cal.totalDocs === 8) pass('wildlife-calendar count = 8')
  else fail('wildlife-calendar count = ' + cal.totalDocs + ' (expected 8)')

  const speciesSeen = new Set<string>()
  ;(cal.docs as Row[]).forEach((c, i) => {
    const species = String(c.species ?? '')
    const label = 'calendar "' + (species || '#' + i) + '"'
    if (!species) fail(label + ': empty species')
    if (speciesSeen.has(species)) fail(label + ': duplicate species title')
    speciesSeen.add(species)
    const file = checkImage(label, c.image, mediaFile)
    ;['species', 'where', 'when', 'note'].forEach((f) => scanMojibake(label + '.' + f, c[f]))
    if (!c.where) note(label + ': where empty (optional field)')
    if (!c.when) note(label + ': when empty (optional field)')
    out('  ~ ' + label + ' | where="' + trunc(c.where, 40) + '" when="' + trunc(c.when, 40) + '" image=' + (file ?? '(none)'))
  })

  // ---- layer 9: faqs (expect 15 in 5 groups of 3) ----
  out('--- faqs (expect 15) ---')
  const GROUPS = ['General enquiries', 'Tours and packages', 'Pricing and payments', 'Reservations and cancellations', 'Travel practicalities']
  const faqs = await payload.find({ collection: 'faqs', limit: 50, depth: 0, sort: 'sortOrder' })
  if (faqs.totalDocs === 15) pass('faqs count = 15')
  else fail('faqs count = ' + faqs.totalDocs + ' (expected 15)')

  const byGroup = new Map<string, number>()
  const questions = new Set<string>()
  let curly = 0
  ;(faqs.docs as Row[]).forEach((f, i) => {
    const group = String(f.group ?? '')
    const q = String(f.question ?? '')
    const a = String(f.answer ?? '')
    const label = 'faq[' + i + ']'
    if (!GROUPS.includes(group)) fail(label + ': group ' + JSON.stringify(group) + ' not in known set')
    byGroup.set(group, (byGroup.get(group) ?? 0) + 1)
    if (!q) fail(label + ': empty question')
    if (!a) fail(label + ': empty answer')
    if (questions.has(q)) fail(label + ': duplicate question "' + trunc(q, 60) + '"')
    questions.add(q)
    if (q.includes('\u201C') || q.includes('\u201D') || a.includes('\u201C') || a.includes('\u201D')) curly++
    scanMojibake(label + '.group', group)
    scanMojibake(label + '.question', q)
    scanMojibake(label + '.answer', a)
    out('  ~ [ ' + group + ' ] ' + trunc(q, 70) + ' (sort=' + (typeof f.sortOrder === 'number' ? f.sortOrder : '-') + ')')
  })

  for (const g of GROUPS) {
    const n = byGroup.get(g) ?? 0
    if (n === 3) pass('group "' + g + '" = 3 faqs')
    else fail('group "' + g + '" = ' + n + ' faqs (expected 3)')
  }

  if (curly > 0) pass('typographic quotes stored as proper UTF-8 (U+201C/U+201D present in ' + curly + ' faq field(s))')
  else fail('no U+201C/U+201D found - the "on request" pricing faq should store proper curly quotes')

  out('verify-content done: ' + passes + ' passed, ' + warns + ' warnings, ' + fails + ' failed')
  if (fails > 0) {
    fs.writeSync(2, 'VERIFY-CONTENT FAILED\n')
    process.exit(1)
  }
  out('VERIFY-CONTENT OK')
}

try {
  await main()
} catch (e) {
  fs.writeSync(2, 'verify-content crashed: ' + (e instanceof Error ? String(e.stack ?? e.message) : String(e)) + '\n')
  process.exit(1)
}
