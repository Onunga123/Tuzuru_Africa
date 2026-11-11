# MIGRATION.md — Tuzuru Africa: Base44 (interim) → Payload CMS + Neon PostgreSQL

**Status:** migration plan complete and current as of 2026-11-11, covering Workstream A6 sub-batch 2
(MR-06 – MR-10). Nothing in this document is complete work — it is the path out of the interim
platform.

**Recorded basis:** DL-008 (frontend built here, migrated afterwards), DL-009 (interim imagery
approved for publication; replacement happens through Payload), A1/DEP-01 (target architecture),
MR-01 – MR-05 (data-access layer, types, enquiry contract, settings globals, media abstraction).

**Companion documents**

| Document | Purpose |
|---|---|
| `src/docs/cms/data-dependency-map.md` | What each page/component reads and where it comes from now |
| `src/docs/cms/payload-schema-mapping.md` | Field-by-field mapping and every mismatch to resolve |
| `src/docs/cms/enquiry-contract.md` | The enquiry interface the Payload backend must implement |
| `src/docs/cms/settings-globals.md` | Site settings, navigation, footer and homepage globals |
| `src/docs/cms/asset-manifest.md` | The 19 media assets, alt text, provenance, re-upload plan |
| `src/docs/cms/runtime-dependencies.md` | Every remaining platform touchpoint and its replacement |
| `seed/` | JSON ready to import into Payload, plus import order and field handling |
| `docs/compliance/platform-and-deployment-disclosure.md` | What the interim platform does and does not satisfy |

---

## 1. What exists today (interim)

A React + Vite frontend with 19 public pages, fully backend-agnostic in design:

- **Content** comes from `src/lib/cms/` — one module, three concerns: content (`content.js`), settings
  and navigation (`settings.js`), media (`media.js`), enquiry (`enquiry.js`).
- **Two platform calls only:** `getTravelSeasons()` (reads the interim `TravelSeason` collection) and
  `submitEnquiry()` (invokes the interim `submitEnquiry` function).
- **Media** is keyed; the host lives in one place (`VITE_MEDIA_BASE_URL`, default = interim host).
- **No page or component** imports the platform SDK, holds a content array, or stores an image URL.
- **Auth screens** exist because the platform app shell requires them; no public page needs a session.

Everything the migration replaces is listed in `runtime-dependencies.md`.

---

## 2. Target architecture (A1 / DEP-01)

```
Visitor ──► Frontend (React, static build)  ──► Payload REST/GraphQL API ──► Neon PostgreSQL
                        │                                 │
                        └──► Media CDN (object storage) ◄──┘
                                  ▲
                    Editor ──► Payload admin (/admin)
```

- **Database:** Neon PostgreSQL (managed, branching, pooled connection).
- **CMS:** Payload 3 (Node, TypeScript, collections + globals, drafts/versions, media uploads,
  admin UI with role-based access).
- **Frontend:** the existing React app, unchanged in appearance and routing.
- **Media:** Payload media collection backed by object storage (S3-compatible) behind a CDN.
- **Email:** an SMTP or transactional-email provider for enquiry notifications.
- **Hosting:** static host for the frontend, Node host for Payload, TLS on both.

### Decision required — frontend delivery shape

| Option | Shape | Trade-off |
|---|---|---|
| **A (recommended)** | Keep this React/Vite frontend as-is; Payload runs as a separate headless service; only `src/lib/cms/*` implementations change | Lowest risk: no page, route or design is touched; verification is content-only |
| **B** | Rebuild the frontend inside Next.js with Payload 3 in the same app | Single deployable, but every page is re-implemented — a new round of visual and behavioural regression |

**OWNER DECISION REQUIRED:** confirm Option A (headless Payload behind the existing frontend) before
scaffolding begins.

---

## 3. Prerequisites and access

| Item | Needed for | Status |
|---|---|---|
| Node.js 20 LTS+ and npm | Payload build/run | available |
| Neon account and project | database | OWNER ACTION |
| Object storage bucket + CDN (S3, R2, Spaces or Neon-adjacent) | media | OWNER ACTION |
| SMTP or transactional-email account with a verified sending domain | enquiry notifications | OWNER ACTION |
| Frontend host (Netlify, Vercel, Cloudflare Pages, any static host) | frontend | OWNER ACTION |
| Node host for Payload (Vercel, Railway, Fly, Render, VPS) | CMS | OWNER ACTION |
| Domain and DNS access (DEP-03) | public site + `cms.` + `media.` hostnames | OWNER ACTION |
| Confirmed Payload field lists (MR-02 mapping) | collection definitions | **OWNER INPUT REQUIRED** |
| Verified contact details and social accounts (PAGE-22 / JRN-04) | `site-settings` global | **OWNER INPUT REQUIRED** |
| Vector logo and square icon (BRAND-02) | header, favicon, social image | **OWNER INPUT REQUIRED** |

---

## 4. Environment variables

Frontend (`.env.example` in the repo):

| Variable | Purpose |
|---|---|
| `VITE_MEDIA_BASE_URL` | Media base; empty = interim URLs, after migration = Payload media base |
| `VITE_PAYLOAD_API_URL` | *(add at migration)* Payload REST base, e.g. `https://cms.tuzuruafrica.com/api` |

Payload / backend (never in the frontend bundle):

| Variable | Purpose |
|---|---|
| `DATABASE_URI` | Neon connection string, `?sslmode=require`; use the pooled host for the app, direct for migrations |
| `PAYLOAD_SECRET` | CMS signing secret (32+ random bytes) |
| `PAYLOAD_PUBLIC_SERVER_URL` | Public CMS URL |
| `PAYLOAD_PUBLIC_MEDIA_URL` | Public media/CDN base |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD` | Outbound email |
| `ENQUIRY_NOTIFY_TO`, `ENQUIRY_FROM_ADDRESS` | Enquiry routing and sender |
| `PREVIEW_SECRET` | Draft preview links (if enabled) |

Rules: no secret is ever prefixed `VITE_`; the frontend build must remain safe to publish publicly.
Verify with `grep -r "sk_\|password\|secret" src/` before every deploy.

---

## 5. Phase 1 — Neon PostgreSQL

1. Create the Neon project in the region closest to the audience (EU/Frankfurt or af-south-1).
2. Create a `main` branch for production and a `dev` branch for staging.
3. Copy both connection strings (pooled for runtime, direct for migrations).
4. Enable point-in-time restore and set a retention window; record the restore procedure.
5. Store credentials in the host's secret manager — never in the repo.

## 6. Phase 2 — Payload CMS scaffold

1. `npx create-payload-app@latest tuzuru-cms` (TypeScript, blank template, Postgres adapter).
2. Add the Postgres adapter with `DATABASE_URI`; run the first migration; confirm the admin user is
   created.
3. Define collections from `payload-schema-mapping.md` — **field lists awaiting owner confirmation**:
   `destinations`, `experiences`, `tours`, `offers`, `travel-guides`, `gallery`, `reviews`,
   `travel-seasons`, `wildlife-calendar`, `faqs`, `enquiries`, `media`.
4. Define globals: `site-settings`, `navigation`, `footer`, `homepage`.
5. Enable drafts and versions on every public collection; add a `status` select (`draft` /
   `published`) where the mapping table marks it new.
6. Access control: public `read` only where `status = published`; all writes admin-only; `enquiries`
   has no public read and create only through the submission endpoint.
7. Media collection: upload enabled, image sizes (`card`, `hero`, `full`), alt field required,
   internal-only fields `origin`, `credit`, `licence`, `licenceStatus`, `permissionRef`
   (not exposed on the public API).
8. Seed the admin user and record where its credentials live.

## 7. Phase 3 — Media migration

1. Upload the 19 files listed in `seed/media.json`, keeping each filename (the key is the filename).
2. Set `alt` from the same file — alt travels with the asset.
3. Record provenance in the internal fields; interim assets stay `owner-approved-interim` (DL-009).
   No public credit line exists for them, and no wording about imagery appears on the site.
4. Point `PAYLOAD_PUBLIC_MEDIA_URL` at the CDN; confirm one transformed image loads.
5. Replacement of any image later is a Payload media swap; no frontend change and no key change.

## 8. Phase 4 — Seed import

```bash
node scripts/export-seed.mjs          # regenerate seed/*.json from the content layer
# then run the Payload import script (server-side, local API) in this order:
# media → destinations → experiences → tours → travel-guides → gallery → travel-seasons
#       → wildlife-calendar → faqs → globals → homepage supporting content
```

Relationship resolution and field handling are specified in `seed/README.md`. Import rules:

- Resolve every `imageKey` / `image` against the uploaded media filename and drop the interim URL.
- Resolve relationships by slug or name (never by array index).
- Convert `guides[].content` and `destinations[].description` to rich text.
- Re-run the import idempotently (upsert on `slug`, `key`, or `filename`) so it can be repeated.
- After import, `grep -c "base44" seed/*.json` must return 0 — it already does.

## 9. Phase 5 — Swap the data-access layer

Only `src/lib/cms/` changes. Exported names and shapes stay identical, so no page is touched.

```js
// src/lib/cms/content.js — after migration (shape only, not final code)
const API = import.meta.env.VITE_PAYLOAD_API_URL;

async function collection(slug, { where, limit = 100, sort = 'order' } = {}) { /* fetch + map */ }

export async function getTravelSeasons() {
  return collection('travel-seasons', { sort: 'sort_order', limit: 12 });
}
```

1. Replace the seed imports in `content.js` with Payload reads; keep every exported name.
2. Replace `getTravelSeasons()` with the `travel-seasons` read.
3. Delete `src/data/` once the reads are live (it is the export's offline fallback — keep it if an
   offline/local-run mode is wanted).
4. Set `VITE_MEDIA_BASE_URL` to the media CDN and confirm images resolve by key.
5. Update `index.html` favicon and `og:image` to the migrated absolute URLs.
6. Pages that currently call synchronous accessors (`getTour(slug)` etc.) either move to a
   `useEffect` fetch or are served by pre-rendering/ISR — the accessor signatures already support
   both, and this is the only frontend change the migration requires.

## 10. Phase 6 — Enquiry backend

Implement `submitEnquiry` behind the existing contract (`enquiry-contract.md`):

1. Validate server-side with the same rules as `validateEnquiry`.
2. Assign the reference (`TZ-<year>-<4 chars>`, unambiguous alphabet) with a collision retry.
3. Persist the enquiry, then queue notifications — an email failure must never lose or block the
   enquiry, and the response still returns the reference.
4. Rate limit at the edge (per IP and per email), keep the honeypot, add a submit-timing check.
5. Status transitions across the nine values and the explicit authorised `confirmed` action.
6. Verify with one clearly labelled test enquiry — **OWNER AUTHORISATION REQUIRED** before sending.

## 11. Phase 7 — Remove the platform

In one commit, after the Payload frontend is verified on staging:

1. Delete `src/api/base44Client.js`, `src/lib/AuthContext.jsx`, `src/lib/authMfa.js`,
   `src/lib/authMfaFlow.js`, `src/components/ProtectedRoute.jsx`, the MFA components, the auth
   pages and `src/components/UserNotRegisteredError.jsx`.
2. Reduce `src/App.jsx` to `Router` + routes (no `AuthProvider`, no auth gate).
3. Remove `@base44/sdk` and `@base44/vite-plugin` from `package.json`.
4. Delete `base44/` (entities and the serverless function) — the data now lives in Neon.
5. Confirm `grep -r "base44" src/ index.html package.json` returns nothing.

## 12. Phase 8 — Deploy, DNS and redirects

1. Deploy the frontend build to the chosen static host; set `VITE_PAYLOAD_API_URL` and
   `VITE_MEDIA_BASE_URL` in the host's environment.
2. Deploy Payload and confirm `/admin` and `/api` respond over TLS.
3. DNS: apex → frontend, `cms.` → Payload, `media.` → CDN. Enforce HTTPS and HSTS.
4. Redirects: keep every path in `src/App.jsx` stable; add 301s only if a path changes. The 404 page
   must return a real 404 status (already implemented with `prerender-status-code`).
5. Set security headers (CSP, frame-ancestors, referrer policy) at the host/CDN.
6. Submit the sitemap and confirm indexing; connect Google Search Console.

---

## 13. Verification matrix (run after staging deploy, before DNS cutover)

| Area | Check |
|---|---|
| Home | hero copy, both CTAs, all six sections, hero image |
| Tours | list, filters (destination, experience, duration), result count, empty state |
| Tour detail | highlights, itinerary, inclusions/exclusions, price basis "on request", related tours, enquiry prefill |
| Destinations / detail | cards, attractions, best time, travel info, related tours |
| Experiences | all six experience blocks and their images |
| Gallery | 12 items, category filter, lightbox with keyboard control, **no credit or wording about imagery** |
| Travel guides + detail | 3 guides, category filter, body content, last-updated date |
| When to travel | 4 seasons from `travel-seasons`, calendar, related links |
| Wildlife calendar | 8 entries, images resolve |
| FAQs | 5 groups, accordion opens, contact links |
| Plan your trip / Contact | enquiry form submits, server validation errors surface, confirmation shows reference |
| Legal pages | Privacy, Terms, Booking policy render their current text |
| Navigation / footer | every link resolves; mobile menu opens |
| Media | every image loads from the CDN; no interim host references remain |
| Errors | unknown path returns the 404 page with a 404 status |
| Responsive | 390px, 769px (tablet), 1440px |

---

## 14. DEP-03 pre-launch checklist (before DNS cutover)

- [ ] Payload + Neon running in production with backups and PITR verified
- [ ] Media on CDN, all 19 assets load, alt text present
- [ ] Content imported; drafts reviewed and published deliberately
- [ ] Verified contact details, WhatsApp number, email, address and hours in `site-settings`
- [ ] Social account URLs in place, or the links removed
- [ ] Vector logo and square icon in use (favicon, Open Graph)
- [ ] Enquiry endpoint live; one authorised test enquiry received end to end
- [ ] Email deliverability checks: SPF, DKIM, DMARC on the sending domain
- [ ] Privacy Policy, Terms of Use and Booking Policy reviewed by the owner — remove the
      "Draft for review" notice only once approved
- [ ] Security headers, TLS, HSTS; admin behind MFA
- [ ] Rate limiting and honeypot active on the enquiry endpoint
- [ ] 404 status verified; sitemap submitted; Search Console connected
- [ ] Analytics/consent decision made (none installed today)
- [ ] Base44 dependencies removed; `grep -r base44 src index.html package.json` empty
- [ ] Rollback rehearsed (see §15)

---

## 15. Rollback

1. Keep the Base44 app and its data untouched until the migrated site has run cleanly for a defined
   window (recommend 14 days). The interim host remains a working fallback.
2. Keep DNS TTLs low (300s) for 24 hours before cutover so the switch can be reversed quickly.
3. Neon branching gives an instant database rollback point; take a branch immediately before the
   seed import.
4. Frontend rollback is a redeploy of the previous build with `VITE_PAYLOAD_API_URL` unchanged.
5. Enquiries received on the migrated site must be exportable before any rollback, so none are lost.

---

## 16. What this plan does not cover

- **Content decisions.** Unverified prices, reviews, testimonials, claims and service descriptions
  remain owner-supplied content work (CONT-02) and are unaffected by DL-009, which covers imagery
  only.
- **Base44 publishing.** Nothing here requires publishing on Base44; the export ZIP is the baseline.
  The app is currently unpublished with no live URL.
- **Legal review.** Policy text is the owner's to approve.
- **Photography sourcing.** No longer pending: imagery replacement happens in Payload after
  migration (DL-009 f).

---

## 17. Open owner inputs carried into migration

1. Payload field lists confirmed against the master requirements document (MR-02).
2. Frontend delivery option A or B (§2).
3. Verified contact details and social accounts (PAGE-22 / JRN-04).
4. Vector logo and square icon (BRAND-02).
5. Authorisation for one test enquiry during verification.
6. Hosting, DNS and email accounts with access (§3).
