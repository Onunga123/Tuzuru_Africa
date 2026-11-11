// MR-03 — Enquiry contract. The UI calls submitEnquiry() and nothing else.
//
// Contract
//  fields      : the 20 enquiry fields listed in ENQUIRY_FIELDS
//  statuses    : the 9 enquiry statuses in ENQUIRY_STATUSES (staff-only; never set by the UI)
//  reference   : /^TZ-\d{4}-[A-Z0-9]{4}$/  e.g. TZ-2026-4F8K
//  success     : { ok: true, reference, name, received: true }
//  validation  : rejected with an Error whose `.fieldErrors` maps field → message,
//                and whose `.kind` is 'validation'
//  failure     : rejected with an Error, `.kind` 'server' | 'network'
//
// The preview implementation below calls the interim serverless function. At migration the
// Payload implementation (persistence, staff notification, email-failure survival) sits behind
// this same interface — see src/docs/cms/enquiry-contract.md.
import { base44 } from '@/api/base44Client';

export const ENQUIRY_FIELDS = [
  'full_name',
  'email',
  'phone',
  'country',
  'destinations',
  'related_tour',
  'travel_dates',
  'adults',
  'children',
  'duration',
  'budget',
  'currency',
  'accommodation_preference',
  'travel_style',
  'enquiry_type',
  'contact_preference',
  'message',
  'privacy_acknowledged',
  'company', // honeypot — never persisted
  'reference_number', // assigned server-side
];

export const ENQUIRY_STATUSES = [
  'new',
  'under_review',
  'awaiting_customer',
  'quotation_sent',
  'follow_up',
  'booking_requested',
  'confirmed',
  'closed',
  'unserviceable',
];

export const REFERENCE_PATTERN = /^TZ-\d{4}-[A-Z0-9]{4}$/;

export const ENQUIRY_OPTIONS = {
  types: ['General enquiry', 'Quotation request', 'Custom itinerary', 'Booking request'],
  contactPreferences: ['Email', 'Phone call', 'WhatsApp'],
  travelStyles: ['Classic safari', 'Slow and comfortable', 'Culture focused', 'Active and adventurous', 'Family travel'],
  accommodationPreferences: ['Simple and comfortable', 'Mid-range lodges', 'Premium lodges', 'No preference'],
  currencies: ['USD', 'EUR', 'GBP', 'KES', 'ZAR'],
};

export const emptyEnquiry = {
  full_name: '',
  email: '',
  phone: '',
  country: '',
  destinations: '',
  related_tour: '',
  travel_dates: '',
  adults: '2',
  children: '',
  duration: '',
  budget: '',
  currency: 'USD',
  accommodation_preference: '',
  travel_style: '',
  enquiry_type: 'Quotation request',
  contact_preference: 'Email',
  message: '',
  privacy_acknowledged: false,
  company: '',
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;

/** Client-side validation. Returns a field → message map; empty means valid. */
export function validateEnquiry(data, { compact = false } = {}) {
  const errors = {};
  if (!String(data.full_name || '').trim()) errors.full_name = 'Please tell us your name.';
  if (!String(data.email || '').trim()) errors.email = 'Please add an email address so we can reply.';
  else if (!EMAIL_RE.test(String(data.email).trim())) errors.email = 'That email address does not look right.';
  if (!String(data.country || '').trim()) errors.country = 'Please add your country of residence.';
  if (!compact) {
    if (!String(data.destinations || '').trim())
      errors.destinations = 'Tell us where you would like to go, or what kind of trip you have in mind.';
    if (!String(data.travel_dates || '').trim()) errors.travel_dates = 'A rough month or date range is enough.';
    if (!data.adults || Number(data.adults) < 1) errors.adults = 'At least one adult is required.';
  }
  if (!data.privacy_acknowledged) errors.privacy_acknowledged = 'Please acknowledge the privacy notice so we can reply.';
  return errors;
}

/**
 * Submits an enquiry.
 * @param {Record<string, unknown>} data
 * @returns {Promise<{ok:true, reference:string, name:string, received:true}>}
 */
export async function submitEnquiry(data) {
  const payload = { ...data };
  ENQUIRY_FIELDS.forEach((field) => {
    if (payload[field] === undefined) payload[field] = '';
  });

  const response = await base44.functions.invoke('submitEnquiry', payload).catch((err) => {
    const message =
      err?.response?.data?.error ||
      'Something went wrong sending your enquiry. Please try again, or contact us on WhatsApp.';
    const error = new Error(message);
    error.kind = 'network';
    throw error;
  });

  const body = response?.data || {};
  if (body.error) {
    const error = new Error(body.error);
    error.kind = 'server';
    throw error;
  }
  if (!body.reference) {
    const error = new Error('We did not receive a reference for this enquiry. Please try again.');
    error.kind = 'server';
    throw error;
  }
  return { ok: true, reference: body.reference, name: body.name || data.full_name, received: true };
}