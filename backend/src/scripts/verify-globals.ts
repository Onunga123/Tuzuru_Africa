/**
 * verify-globals.ts - read-only probe for seed layer 7 (globals)
 *
 * Mirrors seed.ts seedGlobals() exactly. Asserts the four seeded globals
 * against their manifests (MR-09 conventions):
 *   - site-settings: siteName/tagline/aboutShort/contactEmail/contactPhone/
 *     whatsappNumber/address round-trip; socials empty
 *   - navigation: 12 items flattened primary -> secondary -> mobileExtra in
 *     that order; openInNewTab false on every item
 *   - footer: 3 columns (Explore/Company/Legal) with links matching manifest
 *     order and content
 *   - homepage: heroTitle = headline + ' ' + headlineAccent; heroSubtitle,
 *     heroImage (via media.json imageKey -> filename), heroCta, ctaBanner
 *     title/body round-trip; intro section, featured sections and banner
 *     button left unset (nothing invented by the seed)
 *   - anonymous read: all four globals are public-read and must be visible
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

interface NavLinkEntry {
  label: string
  to: string
}

interface MediaEntry {
  key: string
  filename: string
}

interface SiteSettingsEntry {
  name: string
  tagline: string
  shortDescription: string
  phone: string
  whatsapp: string
  email: string
  location: string
}

interface HomepageEntry {
  hero: {
    eyebrow: string
    headline: string
    headlineAccent: string
    intro: string
    primaryCta: NavLinkEntry
    secondaryCta: NavLinkEntry
    imageKey: string
  }
  cta: {
    eyebrow: string
    title: string
    body: string
    note: string
  }
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
  out('verify-globals start (read-only probe, SEED_DIR=' + SEED_DIR + ')')

  const settings = loadJson<SiteSettingsEntry>('site-settings.json')
  const navigation = loadJson<{ primary: NavLinkEntry[]; secondary: NavLinkEntry[]; mobileExtra: NavLinkEntry[] }>('navigation.json')
  const footer = loadJson<{ explore: NavLinkEntry[]; company: NavLinkEntry[]; legal: NavLinkEntry[] }>('footer.json')
  const homepage = loadJson<HomepageEntry>('homepage.json')
  const mediaEntries = loadJson<MediaEntry[]>('media.json')
  const mediaByKey = new Map<string, MediaEntry>(mediaEntries.map(m => [m.key, m] as [string, MediaEntry]))

  const mediaRes = await payload.find({ collection: 'media', limit: 100, overrideAccess: true, depth: 0 })
  const mediaByFilename = new Map<string, AnyRec>(
    mediaRes.docs.map(d => [String((d as unknown as AnyRec).filename), d as unknown as AnyRec] as [string, AnyRec]),
  )

  let enc = 0

  // ---- site-settings ----
  out('- checking global: site-settings')
  const settingsDoc = (await payload.findGlobal({ slug: 'site-settings', overrideAccess: true, depth: 0 })) as unknown as AnyRec
  check(eq(settingsDoc.siteName, settings.name), 'siteName mismatch: expected ' + snippet(settings.name) + ', stored ' + snippet(settingsDoc.siteName))
  check(eq(settingsDoc.tagline, settings.tagline), 'tagline mismatch: expected ' + snippet(settings.tagline) + ', stored ' + snippet(settingsDoc.tagline))
  check(eq(settingsDoc.aboutShort, settings.shortDescription), 'aboutShort mismatch: expected ' + snippet(settings.shortDescription) + ', stored ' + snippet(settingsDoc.aboutShort))
  check(eq(settingsDoc.contactEmail, settings.email), 'contactEmail mismatch: expected ' + snippet(settings.email) + ', stored ' + snippet(settingsDoc.contactEmail))
  check(eq(settingsDoc.contactPhone, settings.phone), 'contactPhone mismatch: expected ' + snippet(settings.phone) + ', stored ' + snippet(settingsDoc.contactPhone))
  check(eq(settingsDoc.whatsappNumber, settings.whatsapp), 'whatsappNumber mismatch: expected ' + snippet(settings.whatsapp) + ', stored ' + snippet(settingsDoc.whatsappNumber))
  check(eq(settingsDoc.address, settings.location), 'address mismatch: expected ' + snippet(settings.location) + ', stored ' + snippet(settingsDoc.address))
  const socials = settingsDoc.socials
  check(Array.isArray(socials) && socials.length === 0, 'socials should be an empty array, stored ' + snippet(socials))
  enc += nonAsciiCount(settings.shortDescription)

  // ---- navigation ----
  out('- checking global: navigation')
  const navDoc = (await payload.findGlobal({ slug: 'navigation', overrideAccess: true, depth: 0 })) as unknown as AnyRec
  const expectedItems = [...navigation.primary, ...navigation.secondary, ...navigation.mobileExtra]
  const items = Array.isArray(navDoc.items) ? (navDoc.items as AnyRec[]) : []
  check(items.length === expectedItems.length, 'navigation items: expected ' + expectedItems.length + ', stored ' + items.length)
  for (let i = 0; i < Math.min(items.length, expectedItems.length); i++) {
    const exp = expectedItems[i]
    const got = items[i]
    check(got.label === exp.label, 'navigation item ' + i + ' label: expected ' + snippet(exp.label) + ', stored ' + snippet(got.label))
    check(got.href === exp.to, 'navigation item ' + i + ' href: expected ' + snippet(exp.to) + ', stored ' + snippet(got.href))
    check(got.openInNewTab === false, 'navigation item ' + i + ' openInNewTab should be false, stored ' + snippet(got.openInNewTab))
  }
  out('  navigation order: ' + items.map(i => String(i.label)).join(' | '))

  // ---- footer ----
  out('- checking global: footer')
  const footerDoc = (await payload.findGlobal({ slug: 'footer', overrideAccess: true, depth: 0 })) as unknown as AnyRec
  const columnTitle = (key: string): string => key.charAt(0).toUpperCase() + key.slice(1)
  const expectedColumns: Array<[string, NavLinkEntry[]]> = [
    [columnTitle('explore'), footer.explore],
    [columnTitle('company'), footer.company],
    [columnTitle('legal'), footer.legal],
  ]
  const columns = Array.isArray(footerDoc.columns) ? (footerDoc.columns as AnyRec[]) : []
  check(columns.length === 3, 'footer columns: expected 3, stored ' + columns.length)
  for (let c = 0; c < Math.min(columns.length, 3); c++) {
    const [expTitle, expLinks] = expectedColumns[c]
    const col = columns[c]
    check(col.title === expTitle, 'footer column ' + c + ' title: expected ' + snippet(expTitle) + ', stored ' + snippet(col.title))
    const links = Array.isArray(col.links) ? (col.links as AnyRec[]) : []
    check(links.length === expLinks.length, 'footer column ' + expTitle + ' links: expected ' + expLinks.length + ', stored ' + links.length)
    for (let i = 0; i < Math.min(links.length, expLinks.length); i++) {
      check(links[i].label === expLinks[i].label, 'footer ' + expTitle + ' link ' + i + ' label: expected ' + snippet(expLinks[i].label) + ', stored ' + snippet(links[i].label))
      check(links[i].href === expLinks[i].to, 'footer ' + expTitle + ' link ' + i + ' href: expected ' + snippet(expLinks[i].to) + ', stored ' + snippet(links[i].href))
    }
  }

  // ---- homepage ----
  out('- checking global: homepage')
  const homeDoc = (await payload.findGlobal({ slug: 'homepage', overrideAccess: true, depth: 0 })) as unknown as AnyRec
  const expectedHeroTitle = homepage.hero.headline + ' ' + homepage.hero.headlineAccent
  check(eq(homeDoc.heroTitle, expectedHeroTitle), 'heroTitle mismatch: expected ' + snippet(expectedHeroTitle) + ', stored ' + snippet(homeDoc.heroTitle))
  check(eq(homeDoc.heroSubtitle, homepage.hero.intro), 'heroSubtitle mismatch: expected ' + snippet(homepage.hero.intro) + ', stored ' + snippet(homeDoc.heroSubtitle))
  const heroMediaEntry = mediaByKey.get(homepage.hero.imageKey)
  if (!heroMediaEntry) {
    fail('hero imageKey not found in media.json: ' + homepage.hero.imageKey)
  } else {
    const heroMediaDoc = mediaByFilename.get(heroMediaEntry.filename)
    if (!heroMediaDoc) {
      fail('live media doc not found for hero filename ' + heroMediaEntry.filename)
    } else {
      const heroImageId = idOf(homeDoc.heroImage)
      check(heroImageId === String((heroMediaDoc as AnyRec).id), 'heroImage mismatch: expected media id ' + String((heroMediaDoc as AnyRec).id) + ' (' + heroMediaEntry.filename + '), stored ' + snippet(homeDoc.heroImage))
    }
  }
  check(eq(homeDoc.heroCtaLabel, homepage.hero.primaryCta.label), 'heroCtaLabel mismatch: expected ' + snippet(homepage.hero.primaryCta.label) + ', stored ' + snippet(homeDoc.heroCtaLabel))
  check(eq(homeDoc.heroCtaHref, homepage.hero.primaryCta.to), 'heroCtaHref mismatch: expected ' + snippet(homepage.hero.primaryCta.to) + ', stored ' + snippet(homeDoc.heroCtaHref))
  check(eq(homeDoc.ctaBannerTitle, homepage.cta.title), 'ctaBannerTitle mismatch: expected ' + snippet(homepage.cta.title) + ', stored ' + snippet(homeDoc.ctaBannerTitle))
  check(eq(homeDoc.ctaBannerBody, homepage.cta.body), 'ctaBannerBody mismatch: expected ' + snippet(homepage.cta.body) + ', stored ' + snippet(homeDoc.ctaBannerBody))
  // unset fields: the seed must not have invented content for these
  check(homeDoc.introTitle == null, 'introTitle should be unset, stored ' + snippet(homeDoc.introTitle))
  check(homeDoc.introBody == null, 'introBody should be unset, stored ' + snippet(homeDoc.introBody))
  check(homeDoc.featuredExperiencesHeading == null, 'featuredExperiencesHeading should be unset, stored ' + snippet(homeDoc.featuredExperiencesHeading))
  check(homeDoc.featuredToursHeading == null, 'featuredToursHeading should be unset, stored ' + snippet(homeDoc.featuredToursHeading))
  const featExp = homeDoc.featuredExperiences
  check(featExp == null || (Array.isArray(featExp) && featExp.length === 0), 'featuredExperiences should be unset/empty, stored ' + snippet(featExp))
  const featTours = homeDoc.featuredTours
  check(featTours == null || (Array.isArray(featTours) && featTours.length === 0), 'featuredTours should be unset/empty, stored ' + snippet(featTours))
  check(homeDoc.ctaBannerLabel == null, 'ctaBannerLabel should be unset, stored ' + snippet(homeDoc.ctaBannerLabel))
  check(homeDoc.ctaBannerHref == null, 'ctaBannerHref should be unset, stored ' + snippet(homeDoc.ctaBannerHref))
  enc += nonAsciiCount(homepage.hero.intro)

  // ---- anonymous read: all four globals are public ----
  for (const slug of ['site-settings', 'navigation', 'footer', 'homepage']) {
    const anonDoc = await payload.findGlobal({ slug, overrideAccess: false, depth: 0 })
    check(anonDoc != null, 'anonymous read of global ' + slug + ' returned nothing')
  }
  out('anonymous read: 4/4 globals visible')

  if (failures.length > 0) {
    throw new Error(failures.length + ' assertion failure(s) - see the FAIL lines above')
  }

  out('verify-globals OK - layer 7 asserted: 4/4 globals, all checks passed')
  out('encoding: ' + enc + ' non-ASCII characters round-tripped intact (console mojibake is display-only)')
  process.exit(0)
}

try {
  await main()
} catch (error: unknown) {
  err('verify-globals FAILED')
  err(error instanceof Error ? (error.stack ?? error.message) : String(error))
  process.exit(1)
}
