# MR-04 — Settings and globals module

Implementation: `src/lib/cms/settings.js`. Nothing in this file is repeated in a component — the
header, footer, contact blocks, homepage hero and homepage CTA all read from here.

## SiteSettings (`siteSettings`, alias `site`)

| Field | Current value | Target Payload global |
|---|---|---|
| `name` | Tuzuru Africa | `site-settings.companyName` |
| `tagline` | Explore Africa. Experience More. | `site-settings.tagline` |
| `shortDescription` | brand description | `site-settings.description` |
| `phone` | **placeholder** `+254 700 000 000` | `site-settings.phone` |
| `whatsapp` | **placeholder** `+254700000000` | `site-settings.whatsapp` |
| `whatsappLink` | `https://wa.me/254700000000` | derived from `whatsapp` |
| `email` | **placeholder** `hello@tuzuruafrica.com` | `site-settings.email` |
| `location` | **placeholder** `Nairobi, Kenya` | `site-settings.address` |
| `hours` | placeholder opening hours | `site-settings.openingHours` |
| `contactNote` | "details shown are placeholders" | `site-settings.contactNote` |
| `draftNotice` | draft-content notice | `site-settings.contentNotice` |
| `socialLinks` | `[]` (empty — no accounts supplied) | `site-settings.socialLinks` |

**OWNER INPUT REQUIRED (PAGE-22 / JRN-04):** verified phone, WhatsApp number, email, physical
address, opening hours, and the URLs of any official social accounts. Replacement is a data edit in
this file only; every page updates at once, and `tel:`, `mailto:` and WhatsApp links are already
generated from these values.

## Navigation (`navigation`)

| Key | Value | Target |
|---|---|---|
| `primary` | Tours, Destinations, Experiences, Gallery, Travel Guides, About | `navigation.main` |
| `secondary` | Contact | `navigation.secondary` |
| `mobileExtra` | When to Travel, Wildlife Calendar, Plan Your Trip, FAQs, Contact | `navigation.mobileExtra` |
| `cta` | Plan Your Trip → `/plan-your-trip` | `navigation.cta` |
| `mobileCta` | Enquire → `/plan-your-trip` | `navigation.mobileCta` |

Values are lifted verbatim from the previous hardcoded header, so this batch changes no visible
navigation. **PAGE-28 (B-Low) is fixed by editing these arrays only** — documented order is
Tours & Packages, Destinations, Experiences, Gallery, About Us, Travel Guides, Contact, plus the
Plan Your Trip button; pages kept outside that list are already recorded in the GOV-08 change
record.

## Footer (`footer`)

`explore` (7 links), `company` (4), `legal` (3) → `footer.linkGroups` at migration. Contact block
and copyright read from `siteSettings`.

## Homepage (`homepage`)

| Key | Contents | Target |
|---|---|---|
| `hero` | `eyebrow`, `headline`, `headlineAccent`, `intro`, `primaryCta`, `secondaryCta`, `imageKey` | `homepage.hero` |
| `cta` | `eyebrow`, `title`, `body`, `note` | `homepage.cta` |

Section headings and labels inside the remaining home sections (Why Tuzuru, Featured Tours,
Featured Destinations, Travel Inspiration, Experience Categories) are structural UI copy; their
content records come from the data module. Moving those headings into the Homepage global is
CMS-15 work.

## Why a module and not a component export

The three previous hardcoded copies of the logo URL, the header's `NAV` array, the footer's three
link arrays, and the placeholder contact block inside `src/data/content.js` were four sources of
truth for the same facts (ARC-11). They are now one each, and the Payload globals can be swapped in
without touching a component.
