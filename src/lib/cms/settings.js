// MR-04 â€” Settings and globals. The single source of truth for contact details,
// navigation, footer and homepage configuration. Mapped to the Payload globals
// site-settings, navigation, footer and homepage. Nothing here may be repeated in a component.
//
// OWNER INPUT REQUIRED: verified phone, WhatsApp number, email, address, opening hours and
// social account URLs. The values below are placeholders and must be replaced through this
// module only â€” see PAGE-22 / JRN-04.

/** @type {import('./types').SiteSettings} */
export const siteSettings = {
  name: 'Tuzuru Africa',
  tagline: 'Explore Africa. Experience More.',
  shortDescription:
    'A travel platform for thoughtfully planned journeys across East and Southern Africa — wildlife, coastlines, culture and the people who make each place what it is.',
  phone: '+254 791 019 668',
  whatsapp: '+254791019668',
  whatsappLink: 'https://wa.me/254791019668',
  email: 'hello@tuzuruafrica.com',
  location: 'Nairobi, Kenya',
  hours:
    'Monday to Friday, 08:30 – 17:30 (EAT). Enquiries received at weekends are answered on the next working day.',
  contactNote:
    'Our team is based in Nairobi, Kenya. Reach us by telephone, email or WhatsApp during the office hours listed above.',
  draftNotice:
    'Planning notes: tour names, itineraries and destination descriptions on this site are draft content prepared for review. Live availability, pricing and operating details are confirmed by our travel team before any trip is agreed.',
  socialLinks: [],
};

/** Legacy alias used by existing pages. */
export const site = siteSettings;

// Current composition, lifted verbatim from the header so behaviour does not change in this
// batch. PAGE-28 (Workstream B-Low) is fixed by editing these arrays only.
export const navigation = {
  primary: [
    { label: 'Tours', to: '/tours' },
    { label: 'Destinations', to: '/destinations' },
    { label: 'Experiences', to: '/experiences' },
    { label: 'Gallery', to: '/gallery' },
    { label: 'Travel Guides', to: '/travel-guides' },
    { label: 'About', to: '/about' },
  ],
  secondary: [{ label: 'Contact', to: '/contact' }],
  mobileExtra: [
    { label: 'When to Travel', to: '/when-to-travel' },
    { label: 'Wildlife Calendar', to: '/wildlife-calendar' },
    { label: 'Plan Your Trip', to: '/plan-your-trip' },
    { label: 'FAQs', to: '/faqs' },
    { label: 'Contact', to: '/contact' },
  ],
  cta: { label: 'Plan Your Trip', to: '/plan-your-trip' },
  mobileCta: { label: 'Enquire', to: '/plan-your-trip' },
};

export const footer = {
  explore: [
    { label: 'Tours & Packages', to: '/tours' },
    { label: 'Destinations', to: '/destinations' },
    { label: 'Experiences', to: '/experiences' },
    { label: 'Gallery', to: '/gallery' },
    { label: 'Travel Guides', to: '/travel-guides' },
    { label: 'When to Travel', to: '/when-to-travel' },
    { label: 'Wildlife Calendar', to: '/wildlife-calendar' },
  ],
  company: [
    { label: 'About Us', to: '/about' },
    { label: 'Plan Your Trip', to: '/plan-your-trip' },
    { label: 'FAQs', to: '/faqs' },
    { label: 'Contact', to: '/contact' },
  ],
  legal: [
    { label: 'Privacy Policy', to: '/privacy-policy' },
    { label: 'Terms of Use', to: '/terms-of-use' },
    { label: 'Booking & Cancellation', to: '/booking-policy' },
  ],
};

export const homepage = {
  hero: {
    eyebrow: 'East & Southern Africa Â· Tailor-made journeys',
    headline: 'Explore Africa.',
    headlineAccent: 'Experience More.',
    intro:
      'Safaris, coastlines, culture and open country, planned with specialists who know the ground â€” and arranged around how you actually want to travel.',
    primaryCta: { label: 'Explore Our Tours', to: '/tours' },
    secondaryCta: { label: 'Plan Your Trip', to: '/plan-your-trip' },
    imageKey: 'hero',
  },
  cta: {
    eyebrow: 'Start planning',
    title: 'Tell us when you can travel, and we will tell you what is possible.',
    body:
      'An enquiry costs nothing and commits you to nothing. Send your dates and a rough idea of the trip, and a specialist will reply with questions and an outline.',
    note: 'Enquiries are never treated as confirmed bookings.',
  },
};


