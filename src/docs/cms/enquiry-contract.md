# MR-03 — Enquiry contract

Implementation: `src/lib/cms/enquiry.js`. The UI calls `submitEnquiry(data)` and nothing else; no
component imports the platform SDK or calls the serverless function directly.

## Interface

```js
import { submitEnquiry } from '@/lib/cms';
const result = await submitEnquiry(formValues);
// → { ok: true, reference: 'TZ-2026-4F8K', name: 'Ada Njoroge', received: true }
```

## Fields (20)

| # | Field | Type | Required |
|---|---|---|---|
| 1 | `full_name` | string | yes |
| 2 | `email` | string (email) | yes |
| 3 | `phone` | string | no |
| 4 | `country` | string | yes |
| 5 | `destinations` | string | yes, unless `related_tour` |
| 6 | `related_tour` | string | yes, unless `destinations` |
| 7 | `travel_dates` | string | yes |
| 8 | `adults` | number ≥ 1 | yes |
| 9 | `children` | string (count + ages) | no |
| 10 | `duration` | string | no |
| 11 | `budget` | string | no |
| 12 | `currency` | string (USD, EUR, GBP, KES, ZAR) | no |
| 13 | `accommodation_preference` | string | no |
| 14 | `travel_style` | string | no |
| 15 | `enquiry_type` | string (4 options) | yes (defaults to Quotation request) |
| 16 | `contact_preference` | string (Email, Phone call, WhatsApp) | yes (default Email) |
| 17 | `message` | string ≤ 2000 | no |
| 18 | `privacy_acknowledged` | boolean, must be true | yes |
| 19 | `company` | string — honeypot, never persisted | n/a |
| 20 | `reference_number` | string, assigned server-side | server-only |

## Statuses (9)

`new` · `under_review` · `awaiting_customer` · `quotation_sent` · `follow_up` ·
`booking_requested` · `confirmed` · `closed` · `unserviceable`

Every enquiry is created as `new`. The UI never sets or reads a status; transitions are staff-side and
belong to CMS-13 at migration. `confirmed` requires an explicit authorised action and is never
reached by submission.

## Reference number

Format `TZ-<year>-<4 chars>` from the alphabet `ABCDEFGHJKLMNPQRSTUVWXYZ23456789`
(no `I`, `O`, `0`, `1`), e.g. `TZ-2026-4F8K`. Validated by `REFERENCE_PATTERN`.
The reference is generated server-side, returned on success, and displayed on the confirmation page
(PAGE-26).

## Responses

| Outcome | Shape |
|---|---|
| Success | `{ ok: true, reference, name, received: true }` |
| Validation rejection (server) | throws `Error` with `.kind = 'server'`, message listing the missing items |
| Rate limited / rejected | throws `Error` with `.kind = 'server'` (HTTP 429 text) |
| Network failure | throws `Error` with `.kind = 'network'`, generic retry message |
| Client-side validation | `validateEnquiry(data, {compact})` → `{ field: 'message' }` map, checked before submit |

## Preview implementation (current)

`submitEnquiry` posts to the interim `submitEnquiry` serverless function, which validates input,
rejects honeypot submissions, rate-limits duplicate submissions (3 per email in 15 minutes),
creates the record with its reference number, and sends acknowledgement and staff emails
best-effort. Documented in `src/docs/cms/enquiry-contract.md` rather than extended here.

## Migration implementation (Payload + Neon)

Behind the same interface, the Payload phase must implement:

1. Persistence into the `enquiries` collection with server-side validation mirroring the client rules.
2. Unique reference generation with a retry on collision.
3. Staff notification and traveller acknowledgement, queued so an email failure never loses or
   blocks the enquiry.
4. Email-failure survival: the enquiry persists and the response still returns a reference; the
   failure is recorded for follow-up.
5. Rate limiting at the edge, plus server-side honeypot and timing checks.
6. Status transitions and the authorised `confirmed` action — not part of this interface.

**OWNER INPUT REQUIRED:** authorisation to submit one clearly labelled test enquiry for verification
(PAGE-21 acceptance). No test enquiry has been submitted.
