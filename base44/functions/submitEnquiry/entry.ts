import { createClientFromRequest } from 'npm:@base44/sdk@0.8.54';

const STAFF_EMAIL = 'hello@tuzuruafrica.com';
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;

function reference() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 4; i += 1) code += chars[Math.floor(Math.random() * chars.length)];
  return `TZ-${new Date().getFullYear()}-${code}`;
}

function clean(value, max = 500) {
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

export default async function (req) {
  try {
    const body = await req.json().catch(() => ({}));

    // Honeypot — a real visitor never fills this.
    if (clean(body.company, 50)) {
      return Response.json({ error: 'Submission rejected.' }, { status: 400 });
    }

    const data = {
      full_name: clean(body.full_name, 120),
      email: clean(body.email, 160),
      phone: clean(body.phone, 40),
      country: clean(body.country, 80),
      destinations: clean(body.destinations, 240),
      related_tour: clean(body.related_tour, 120),
      travel_dates: clean(body.travel_dates, 120),
      adults: Number(body.adults) > 0 ? Math.min(Number(body.adults), 50) : 1,
      children: clean(body.children, 80),
      duration: clean(body.duration, 80),
      budget: clean(body.budget, 80),
      currency: clean(body.currency, 10),
      accommodation_preference: clean(body.accommodation_preference, 80),
      travel_style: clean(body.travel_style, 80),
      enquiry_type: clean(body.enquiry_type, 40) || 'General enquiry',
      contact_preference: clean(body.contact_preference, 40) || 'Email',
      message: clean(body.message, 2000),
      privacy_acknowledged: body.privacy_acknowledged === true,
    };

    const missing = [];
    if (!data.full_name) missing.push('full name');
    if (!data.email) missing.push('email');
    if (!data.country) missing.push('country');
    if (!data.destinations && !data.related_tour) missing.push('destination or trip of interest');
    if (!data.travel_dates) missing.push('preferred travel dates');
    if (!data.privacy_acknowledged) missing.push('privacy acknowledgement');

    if (missing.length) {
      return Response.json({ error: `Please complete: ${missing.join(', ')}.` }, { status: 400 });
    }
    if (!EMAIL_RE.test(data.email)) {
      return Response.json({ error: 'Please enter a valid email address.' }, { status: 400 });
    }
    if (data.message.length > 2000) {
      return Response.json({ error: 'Please keep your message under 2000 characters.' }, { status: 400 });
    }

    const base44 = createClientFromRequest(req);

    // Simple duplicate / abuse guard: more than three enquiries from one address
    // in fifteen minutes is treated as a duplicate submission.
    const since = new Date(Date.now() - 15 * 60 * 1000).toISOString();
    const recent = await base44.asServiceRole.entities.Enquiry.filter({
      email: data.email,
      created_date: { $gte: since },
    });
    if (Array.isArray(recent) && recent.length >= 3) {
      return Response.json(
        { error: 'We have already received several enquiries from this email address. Our team will be in touch shortly.' },
        { status: 429 }
      );
    }

    const record = await base44.asServiceRole.entities.Enquiry.create({
      ...data,
      reference_number: reference(),
      status: 'new',
    });

    const summary = [
      `Reference: ${record.reference_number}`,
      `Name: ${data.full_name}`,
      `Email: ${data.email}`,
      `Phone / WhatsApp: ${data.phone || '—'}`,
      `Country of residence: ${data.country}`,
      `Interested in: ${data.destinations || data.related_tour}`,
      `Related tour: ${data.related_tour || '—'}`,
      `Travel dates: ${data.travel_dates}`,
      `Party: ${data.adults} adult(s)${data.children ? `, children: ${data.children}` : ''}`,
      `Duration: ${data.duration || '—'}`,
      `Budget: ${data.budget ? `${data.currency ? `${data.currency} ` : ''}${data.budget}` : '—'}`,
      `Accommodation preference: ${data.accommodation_preference || '—'}`,
      `Travel style: ${data.travel_style || '—'}`,
      `Enquiry type: ${data.enquiry_type}`,
      `Preferred contact: ${data.contact_preference}`,
      '',
      'Message:',
      data.message || '—',
      '',
      'This is an enquiry, not a confirmed booking.',
    ].join('\n');

    // Email delivery must never lose the enquiry, so both sends are best-effort.
    const sends = [
      base44.asServiceRole.integrations.Core.SendEmail({
        to: data.email,
        from_name: 'Tuzuru Africa',
        subject: `We have your enquiry — ${record.reference_number}`,
        body: [
          `Dear ${data.full_name},`,
          '',
          'Thank you for your enquiry. It has been received and a travel specialist will reply with questions or an outline within one working day.',
          '',
          `Your reference: ${record.reference_number}`,
          `Trip of interest: ${data.destinations || data.related_tour}`,
          `Travel dates: ${data.travel_dates}`,
          '',
          'Please note this is an enquiry and not a confirmed reservation. Nothing is booked or charged until you accept a written quotation and the stated terms are met.',
          '',
          'Warm regards,',
          'Tuzuru Africa',
        ].join('\n'),
        category: 'transactional',
      }),
      base44.asServiceRole.integrations.Core.SendEmail({
        to: STAFF_EMAIL,
        from_name: 'Tuzuru Africa Website',
        subject: `New enquiry ${record.reference_number} — ${data.full_name}`,
        body: summary,
        category: 'transactional',
      }),
    ];
    await Promise.allSettled(sends);

    return Response.json({
      reference: record.reference_number,
      name: data.full_name,
      received: true,
    });
  } catch (error) {
    return Response.json({ error: 'We could not record your enquiry. Please try again shortly.' }, { status: 500 });
  }
}