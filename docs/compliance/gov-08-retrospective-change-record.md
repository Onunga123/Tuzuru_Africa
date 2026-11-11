# GOV-08 — Retrospective change record (Base44 build)

Requirement: **GOV-08** (decision log; no silent changes). Prepared: 2026-11-11.

**How this was reconstructed:** there was no decision log during the build, so this record was rebuilt from the current codebase, the platform's live state and the build conversation. Where I cannot evidence something from the code I say so. Nothing here is ratified: each line needs the owner's **RATIFY** or **REMOVE** decision.

## A. Pages added beyond the documented page set

| ID | Change | Evidence | Owner action |
|---|---|---|---|
| CR-01 | Added **When to Travel** page (`/when-to-travel`) presenting seasonal guidance, backed by a new `TravelSeason` entity | `src/pages/WhenToTravel.jsx`, `base44/entities/TravelSeason.jsonc` | RATIFY / REMOVE |
| CR-02 | Added **Wildlife Calendar** page (`/wildlife-calendar`) with species-by-season guidance | `src/pages/WildlifeCalendar.jsx`, `src/data/wildlifeCalendar.js` | RATIFY / REMOVE |
| CR-03 | Added **Enquiry Confirmation** page (`/enquiry-confirmation`) shown after an enquiry is submitted | `src/pages/EnquiryConfirmation.jsx` | RATIFY / REMOVE |
| CR-04 | Added **FAQs** page (`/faqs`) with 5 FAQ groups (documented set is 9 categories — see PAGE-20) | `src/pages/Faqs.jsx`, `src/data/content.js` (`faqGroups`) | RATIFY / REMOVE |

## B. Navigation composition changes

| ID | Change | Evidence | Owner action |
|---|---|---|---|
| CR-05 | Desktop navigation reads **Tours, Destinations, Experiences, Gallery, Travel Guides, About** — the label "Tours & Packages" is shortened to "Tours", "About Us" to "About", Travel Guides precedes About, and **Contact is absent from the desktop bar** | `src/components/layout/SiteHeader.jsx` (`NAV`) | RATIFY / REMOVE |
| CR-06 | Mobile menu adds **When to Travel, Wildlife Calendar, Plan Your Trip, FAQs, Contact** on top of the desktop items | `src/components/layout/SiteHeader.jsx` | RATIFY / REMOVE |
| CR-07 | Footer navigation adds **When to Travel** and **Wildlife Calendar** to the documented Explore/Company/Legal groups | `src/components/layout/SiteFooter.jsx` | RATIFY / REMOVE |

## C. Platform and account surfaces

| ID | Change | Evidence | Owner action |
|---|---|---|---|
| CR-08 | Platform auth pages exist and are routable: Login, Register, Forgot Password, Reset Password, MFA, OAuth consent | `src/pages/Login.jsx`, `Register.jsx`, `ForgotPassword.jsx`, `ResetPassword.jsx`, `Mfa.jsx`, `OAuthConsent.jsx` | RATIFY / REMOVE |
| CR-09 | **Base44 badge** on the published app. This is a platform setting, not app code — I cannot verify from the code whether it is displayed; it is controlled in the dashboard's Settings page. Recorded as unverified | dashboard Settings → app badge | RATIFY / REMOVE |
| CR-10 | Enquiries are submitted through a **platform serverless function** (`submitEnquiry`) rather than a documented API endpoint; the platform's current security scan flags it as callable by anyone (low) | `base44/functions/submitEnquiry/entry.ts`; platform security scan | RATIFY / REMOVE |

## D. Data model changes

| ID | Change | Evidence | Owner action |
|---|---|---|---|
| CR-11 | `Enquiry` collection carries staff-side fields and a 9-state status workflow (`assigned_to`, `staff_notes`, `status`) in addition to the traveller fields | `base44/entities/Enquiry.jsonc` | RATIFY / REMOVE |
| CR-12 | `TravelSeason` collection added solely to support CR-01 | `base44/entities/TravelSeason.jsonc` | RATIFY / REMOVE |
| CR-13 | Tours, destinations, experiences, offers, gallery, guides and FAQs are **static content in code** (`src/data/content.js`), not CMS collections — staff cannot edit them without a code change | `src/data/content.js` | RATIFY / REMOVE |

## E. Brand and imagery decisions

| ID | Change | Evidence | Owner action |
|---|---|---|---|
| CR-14 | The site logo was replaced with an **owner-supplied logo file**, now used in the header, footer, favicon and Open Graph image | `src/components/layout/BrandMark.jsx`, `SiteFooter.jsx`, `index.html` | RATIFY / REMOVE |
| CR-15 | **18 AI-generated images** are used as illustrative photography across every page (see `docs/compliance/page-17-image-inventory.md`) | `src/data/media.js` | RATIFY / REMOVE |
| CR-16 | Homepage Travel/Stay/Explore/Experience entry points use **photographic tiles** rather than the logo's four icon motifs (see PAGE-03) | `src/components/home/ExperienceCategories.jsx` | RATIFY / REMOVE |

## F. Copy and content additions

| ID | Change | Evidence | Owner action |
|---|---|---|---|
| CR-17 | Placeholder **contact details** were entered into the site: phone `+254 700 000 000`, WhatsApp `254700000000`, email `hello@tuzuruafrica.com`, location "Nairobi, Kenya", opening hours — plus a visible note that they are unverified | `src/data/content.js` (`site`) | RATIFY / REMOVE |
| CR-18 | Draft/verification notices were added to the site (`draftNotice`, gallery illustrative-image note) — copy not in the approved document | `src/data/content.js`, `src/pages/Gallery.jsx` | RATIFY / REMOVE |
| CR-19 | Tours and offers are presented with **"price on request"** rather than prices | `src/data/content.js` | RATIFY / REMOVE |
| CR-20 | **DL-009 (2026-11-11) — owner decision on imagery.** The interim imagery is approved for publication. All imagery status/label wording was removed from the public site, launch flags were removed from the media register and seed data, statuses became `owner-approved-interim`, and replacement moved to the Payload CMS. PAGE-17's licensed-photography owner input is withdrawn; it covers imagery only, so CR-19 and CONT-02 content items remain open. | `src/data/media.js`, `src/data/content.js`, `src/lib/cms/media.js`, `src/pages/Gallery.jsx`, media register / asset manifest / page-17 inventory | DECIDED — DL-009 |

## G. Items I could not reconstruct

- The order in which navigation, page and imagery decisions were taken (no log existed).
- Whether the Base44 badge is currently displayed (platform setting, outside the code).
- Any decision on the platform itself: ARC-01/DEP-01 remain open owner decisions.

## Page inventory for GOV-10 cross-check

26 page files exist in `src/pages/` (including the six auth/consent pages); the platform's sitemap enumerated 17 public pages at the last scan. The difference is the auth/consent surface plus pages added after that scan.
