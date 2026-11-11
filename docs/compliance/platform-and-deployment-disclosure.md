# ARC-01 / ARC-02 / ARC-03 / ARC-06 / DEP-01 — Platform and deployment disclosure

Prepared: 2026-11-11. **No compliance claim is made here.** This is a written disclosure for the owner's ratify-or-migrate decision. Requirements: ARC-01, ARC-03, DEP-01 (and ARC-02/ARC-03/ARC-06 inputs, Workstream D).

## 1. Current platform state (read from the platform this turn)

| Fact | Value |
|---|---|
| Published | **No — the app is unpublished and offline** |
| Visibility when published | Anyone with the link can open it without logging in (`public_without_login`) |
| Login methods | Email and password, Google, Microsoft, Facebook, Apple |
| MFA required | Off |
| Custom domain | **None connected** |
| Secrets configured | None |
| Collaborators | 1 (owner) |
| Security scan | Out of date (app changed since it ran); 1 open finding: one backend function callable by anyone (low) |

**Discrepancy with the audit:** the audit measured `https://explore-tuzuru-africa.base44.app/`. The platform reports the app as unpublished and offline as of this turn. Nothing in this report assumes a live site; republishing is done with the Publish button at the top of the editor.

## 2. What the application is built with (verified in the codebase)

| Layer | Implementation |
|---|---|
| Frontend | React 18 single-page app built with Vite; routing via React Router; Tailwind CSS with design tokens; shadcn/ui primitives |
| Rendering model | Client-side rendering of a static build; no server-side rendering and no incremental revalidation |
| Business logic | One backend function, `base44/functions/submitEnquiry/entry.ts` (Deno runtime), plus platform SDK calls made directly from the browser |
| Data access | `@base44/sdk` entity operations (`filter`, `count`, `create`, …). Schemas live in `base44/entities/*.jsonc`: `Enquiry` (20 fields, 9 statuses) and `TravelSeason`; the `User` collection is platform-provided |
| Authentication | Platform-managed (email/password, OAuth providers, optional MFA); not implemented in app code |
| Media storage | Image host `media.base44.com` (transform pipeline); brand asset under `base44.app/api/apps/.../files/` |
| Hosting | Base44 platform (managed), HTTPS delivery |

## 3. Datastore engine (ARC-03 / ARC-06)

**Not disclosed to me and not present in the code.** The app defines entity schemas and talks to the platform's SDK; the underlying database product is a platform implementation detail I cannot inspect from here. I will not state that it is PostgreSQL, or name another engine, without platform confirmation.

**ARC-03:** OPEN — needs platform/provider confirmation of the datastore engine.
**ARC-06:** same question; recorded as open for the ARC-01 / DEP-01 decision.

## 4. Server-side calls (ARC-02)

Two patterns are in use:

1. **In-app authenticated API calls** — the browser calls the platform's entity API with the signed-in user's token; row-level security rules on each entity decide what that user may read or write.
2. **Backend function** — `submitEnquiry` runs server-side, validates input, writes the enquiry with service-role privileges and sends notifications. It is HTTP-invoked; the current security scan flags it as callable by anyone (low severity), which is intentional for a public enquiry form but is recorded for SEC-02.

There is no local/internal API layer beyond these.

## 5. Export and portability (ARC-04)

- **Source export:** editor top bar → **More actions** (three dots) → **Export project as ZIP**. This exports the project source: pages, components, styles, config and backend function code.
- **Repository sync:** editor top bar → **More actions** → **GitHub connection**.
- **What the ZIP does not contain:** the stored records (enquiries, seasons, users) and the platform's auth configuration. **I cannot see a record-export control from this assistant's position**; the dashboard's Data section is where to check for a CSV/JSON export before relying on it.
- **Portability assessment:** the frontend is portable (standard React/Vite; entity SDK calls are the only platform coupling). The backend function is portable in logic but must be re-hosted as a route handler. The data model ports as JSON schemas. What does not port directly: platform auth (users and sessions), media URLs (must be re-hosted), and any dashboards the platform provides.

## 6. Migration constraints toward the approved stack (ARC-01)

To move to Next.js + Payload as one integrated app, the work is:

1. Re-declare the two entity schemas as Payload collections (`Enquiry`, `TravelSeason`) plus `Users`, `Media` and the globals the master document specifies.
2. Migrate stored records out of the platform (export path to be confirmed — see §5).
3. Re-implement `submitEnquiry` as a Next.js route handler (its validation, reference-number generation and notification logic carry over).
4. Replace `@base44/sdk` calls in the pages with Payload's local API (server components) or REST calls.
5. Re-upload the 19 media assets into Payload media and update the media register (`src/data/media.js`).
6. Re-implement auth (Payload Users + the documented ADMIN / EDITOR / ENQUIRY_MANAGER roles) and RLS equivalents as collection access control.
7. Re-deploy on the approved VPS / PostgreSQL / container / Caddy pattern.

No work on this has been started; per the directive, ARC-01 stays **not compliant** until the owner records a decision to ratify Base44 as the interim platform or to schedule migration.

## 7. Deployment disclosure (DEP-01)

| Item | Current position |
|---|---|
| Hosting arrangement | Base44 managed hosting; no owner-controlled infrastructure |
| HTTPS | Supported and served over HTTPS when published; no certificate management needed by the owner |
| Custom domain | Not supported by me from this build; connected in the dashboard's Domains page (owner action), no domain currently connected |
| Backups | **I cannot see backup configuration or a restore test from here.** No restore has been tested. Recorded as open. |
| Production email | Not configured. Enquiries are stored server-side; acknowledgement email depends on the platform email service and is not verified (PAGE-21). |
| Export / exit | Source ZIP + GitHub sync; data export path unconfirmed (§5) |
| Operational dependency | The app depends on Base44 runtime (entity API, auth, function runtime, media host). Taking the app off the platform requires the migration in §6. |

## 8. Open items for the owner's decision log

- ARC-01 / DEP-01: **ratify Base44 as interim platform, or schedule migration.**
- ARC-03 / ARC-06: obtain the datastore engine confirmation from the platform.
- ARC-04: confirm the record-export path before relying on portability.
- DEP-01: confirm backup and restore guarantees.
- DEP-03 (Workstream B): domain name and DNS access if a custom domain is required.

## 9. Migration baseline status (updated after MR-01–MR-05)

DL-008 recorded: the frontend is completed here and migrated. Base44 is the interim frontend build
environment only. Nothing below claims ARC-01 or DEP-01 compliant.

The frontend has been made backend-agnostic in the ways the migration depends on:

| Concern | Interim implementation | What the Payload + Neon phase replaces |
|---|---|---|
| Content reads | One module, `src/lib/cms` (`content.js`), over bundled seed data | Payload collection reads; the page-facing exports stay identical |
| Collection read in use | `getTravelSeasons()` — interim `TravelSeason` collection (the only collection read in the app) | Payload `travel-seasons` collection |
| Media | Media module keyed to the interim image host; base URL is configuration | Payload `media` uploads re-pointed through `VITE_MEDIA_BASE_URL` |
| Contact / navigation / footer / homepage copy | One settings module (`settings.js`) | Payload globals `site-settings`, `homepage`, `navigation`, `footer` |
| Enquiry submission | One interface, `submitEnquiry()`, over the interim serverless function | Payload-backed persistence, notifications, email-failure survival behind the same interface |
| Types | `src/lib/cms/types.js`, shaped on the documented collections | Payload collection definitions |

Deliverables held with this baseline: `src/docs/cms/data-dependency-map.md`,
`payload-schema-mapping.md`, `enquiry-contract.md`, `settings-globals.md`, `asset-manifest.md`.
The source package (editor → More actions → Export project as ZIP) must be re-exported after every
completed batch; the export is the migration baseline and is **not** a compliance claim.

Remaining Base44 runtime dependencies that the migration must reproduce or remove: entity API,
platform authentication and sessions, the serverless function runtime and its email service, the
media host, and the platform's 404/redirect behaviour. `MIGRATION.md` (MR-10) carries the step-by-step
replacement path and the DEP-03 pre-launch checklist.

## 10. Handover pack (MR-06 – MR-10) and DL-009

Delivered with this disclosure:

| Item | Where |
|---|---|
| Runtime dependency register — every platform touchpoint and its replacement | `src/docs/cms/runtime-dependencies.md` |
| Configuration manifest, no secret in the frontend | `.env.example` |
| Runnable export — `npm install`, `npm run build`, `npm run preview`, documented | `README.md` |
| Seed data for the Payload import, generated by a checked-in script | `seed/`, `scripts/export-seed.mjs` |
| Migration plan, verification matrix, DEP-03 pre-launch checklist, rollback | `MIGRATION.md` |

**DL-009 (2026-11-11) — imagery.** The interim imagery is approved by the owner for publication.
Statuses in the media register, asset manifest and image inventory are `owner-approved-interim`;
launch flags are removed from code and seed data; all imagery wording is removed from the public
site; provenance is retained internally as Payload-ready structure; replacement happens through the
Payload CMS after migration. The licensed-photography owner input is withdrawn. DL-009 covers
imagery only — unverified prices, reviews, testimonials, claims and service descriptions remain
content items under CONT-02.

**Export status.** The workspace source is current for this batch; the source package must be
re-exported by the owner (editor → More actions → Export project as ZIP) after each completed
batch. The ZIP is the migration baseline and is not a compliance claim. The app remains unpublished
with no live URL.
