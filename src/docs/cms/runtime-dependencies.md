# MR-06 — Runtime dependency register

Every Base44 / platform dependency the frontend still has, what it does, and what replaces it after
migration. The goal of this batch is that no page or component depends on the platform: what
remains is confined to `src/lib/cms/` (two implementations), the platform's own auth boilerplate,
and the media host configured in one place.

## A. Application code that touches the platform

| # | File | What it calls | Why it exists | Replacement at migration |
|---|---|---|---|---|
| 1 | `src/lib/cms/content.js` → `getTravelSeasons()` | `base44.entities.TravelSeason.list()` | The only collection read in the app (When to Travel page) | Payload read of `travel-seasons`; same function signature |
| 2 | `src/lib/cms/enquiry.js` → `submitEnquiry()` | `base44.functions.invoke('submitEnquiry')` | Enquiry submission | Payload-backed endpoint behind the documented contract (`enquiry-contract.md`) |
| 3 | `src/data/media.js` | Absolute interim media URLs (data only, never in a component) | Asset locations | Payload media base via `VITE_MEDIA_BASE_URL`; keys unchanged |
| 4 | `src/api/base44Client.js` | SDK client construction | Used only by 1 and 2 above | Delete with 1 and 2 |

Nothing else in `src/pages`, `src/components` or `src/lib` imports the SDK. Verified with
`grep -rn "@/api/base44Client" src` — the remaining hits are the platform auth files in section B.

## B. Platform-owned auth surface (not ours to replace while hosted on Base44)

| File | Purpose |
|---|---|
| `src/lib/AuthContext.jsx`, `src/lib/authMfa.js`, `src/lib/authMfaFlow.js`, `src/components/ProtectedRoute.jsx`, `src/components/MfaFlow.jsx`, `src/components/MfaManage.jsx`, `src/components/MfaMethodSetup.jsx`, `src/components/MfaParts.jsx`, `src/components/AuthLayout.jsx` | Session, login, MFA plumbing supplied by the platform |
| `src/pages/Login.jsx`, `Register.jsx`, `ForgotPassword.jsx`, `ResetPassword.jsx`, `Mfa.jsx`, `OAuthConsent.jsx` | Auth screens |
| `src/components/UserNotRegisteredError.jsx`, `src/lib/PageNotFound.jsx` | Platform error surfaces |
| `src/App.jsx` → `AuthProvider`, `useAuth` | Auth bootstrapping for the whole app |

**Visitor impact:** no public page requires a session. The public site renders for anyone; the auth
screens exist because the platform's app shell requires them. At migration these files are deleted
(Payload provides admin authentication for the CMS itself), which removes the platform from the
delivery path entirely.

**DEP-01 note:** the app is still hosted on Base44 and is unpublished, so these files remain in
place deliberately. Removing them now would break the interim build without producing a compliant
architecture (A1/DEP-01).

## C. Platform configuration and data

| Item | Location | Replacement |
|---|---|---|
| `TravelSeason` collection | `base44/entities/TravelSeason.jsonc` (4 records) | Payload `travel-seasons` — exported to `seed/travel-seasons.json` |
| `Enquiry` collection | `base44/entities/Enquiry.jsonc` | Payload `enquiries` — schema documented in `payload-schema-mapping.md` |
| `submitEnquiry` function | `base44/functions/submitEnquiry/entry.ts` | Payload endpoint + queued email |
| Build + hosting | `@base44/vite-plugin`, platform publish | Any static host / Next.js host + Payload server |
| Media host | `media.base44.com`, `base44.app/api/.../files/mp/public` | Object storage behind the Payload media collection |

## D. Rules already enforced in the code

1. No component holds a URL, a content array or a platform call (MR-01 / MR-05).
2. No secret exists in the frontend; `.env.example` documents the single `VITE_` variable (MR-07).
3. Content records reference media by key, so the media host is one configuration value.
4. The two platform implementations sit behind functions with stable signatures, so the swap at
   migration changes no page (MR-10 §6).
