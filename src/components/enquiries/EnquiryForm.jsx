import { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Check, Loader2, AlertCircle } from 'lucide-react';
import {
  destinations,
  findTour,
  emptyEnquiry,
  validateEnquiry,
  submitEnquiry,
  ENQUIRY_OPTIONS,
} from '@/lib/cms';

const inputBase =
  'w-full border border-border bg-paper px-4 py-3 font-body text-[0.875rem] text-ink placeholder:text-ink/35 focus:border-forest focus:outline-none';
const labelBase = 'mb-2 block font-body text-[0.6875rem] uppercase tracking-[0.16em] text-ink/60';

/**
 * @param {{ label: string, error?: string, children: import('react').ReactNode, htmlFor: string }} props
 */
function Field({ label, error, children, htmlFor }) {
  return (
    <div>
      <label htmlFor={htmlFor} className={labelBase}>{label}</label>
      {children}
      {error && <p className="mt-1.5 text-[0.75rem] text-destructive">{error}</p>}
    </div>
  );
}

export default function EnquiryForm({ compact = false }) {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const presetTour = params.get('tour') || '';
  const preset = presetTour ? findTour(presetTour) : null;

  const [form, setForm] = useState(() => ({
    ...emptyEnquiry,
    destinations: preset ? `${preset.destination} (${preset.title})` : '',
    related_tour: preset ? preset.title : '',
  }));
  const [errors, setErrors] = useState(/** @type {Record<string, string | undefined>} */ ({}));
  const [status, setStatus] = useState('idle');
  const [serverError, setServerError] = useState('');

  const set = (key) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const validate = () => {
    const next = validateEnquiry(form, { compact });
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = async (e) => {
    e.preventDefault();
    setServerError('');
    if (!validate()) {
      const first = document.querySelector('[data-invalid="true"]');
      if (first) first.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    setStatus('submitting');
    try {
      const result = await submitEnquiry(form);
      navigate('/enquiry-confirmation', {
        state: { reference: result.reference, name: result.name, destinations: form.destinations },
      });
    } catch (err) {
      setServerError(err?.message || 'Something went wrong sending your enquiry. Please try again, or contact us on WhatsApp.');
      setStatus('idle');
    }
  };

  const busy = status === 'submitting';

  return (
    <form onSubmit={submit} noValidate className="space-y-10">
      {preset && (
        <div className="flex items-start gap-3 border-l-2 border-gold bg-sand/60 px-5 py-4">
          <Check size={16} className="mt-0.5 shrink-0 text-forest" aria-hidden="true" />
          <p className="text-[0.875rem] leading-relaxed text-ink/75">
            Enquiring about <strong className="font-semibold text-forest">{preset.title}</strong> â€” {preset.duration}.
            You can change any of the details below.
          </p>
        </div>
      )}

      <fieldset className="space-y-5">
        <legend className="mb-4 font-heading text-[1.25rem] text-forest">About you</legend>
        <div className="grid gap-5 sm:grid-cols-2">
          <div data-invalid={!!errors.full_name}>
            <Field label="Full name *" htmlFor="full_name" error={errors.full_name}>
              <input id="full_name" className={inputBase} value={form.full_name} onChange={set('full_name')} autoComplete="name" />
            </Field>
          </div>
          <div data-invalid={!!errors.email}>
            <Field label="Email *" htmlFor="email" error={errors.email}>
              <input id="email" type="email" className={inputBase} value={form.email} onChange={set('email')} autoComplete="email" />
            </Field>
          </div>
          <div data-invalid={!!errors.country}>
            <Field label="Country of residence *" htmlFor="country" error={errors.country}>
              <input id="country" className={inputBase} value={form.country} onChange={set('country')} autoComplete="country-name" />
            </Field>
          </div>
          <Field label="Telephone / WhatsApp" htmlFor="phone">
            <input id="phone" className={inputBase} value={form.phone} onChange={set('phone')} autoComplete="tel" />
          </Field>
        </div>
      </fieldset>

      {!compact && (
        <>
          <fieldset className="space-y-5 border-t border-border pt-8">
            <legend className="mb-4 font-heading text-[1.25rem] text-forest">Your trip</legend>
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2" data-invalid={!!errors.destinations}>
                <Field label="Destinations of interest *" htmlFor="destinations" error={errors.destinations}>
                  <input
                    id="destinations"
                    className={inputBase}
                    list="destination-options"
                    value={form.destinations}
                    onChange={set('destinations')}
                    placeholder="e.g. Maasai Mara and Zanzibar"
                  />
                  <datalist id="destination-options">
                    {destinations.map((d) => (
                      <option key={d.slug} value={`${d.name}, ${d.country}`} />
                    ))}
                  </datalist>
                </Field>
              </div>

              <div data-invalid={!!errors.travel_dates}>
                <Field label="Preferred travel dates *" htmlFor="travel_dates" error={errors.travel_dates}>
                  <input
                    id="travel_dates"
                    className={inputBase}
                    value={form.travel_dates}
                    onChange={set('travel_dates')}
                    placeholder="e.g. mid-July 2027, or 12â€“22 August"
                  />
                </Field>
              </div>

              <Field label="Trip duration" htmlFor="duration">
                <input id="duration" className={inputBase} value={form.duration} onChange={set('duration')} placeholder="e.g. 10 nights" />
              </Field>

              <div data-invalid={!!errors.adults}>
                <Field label="Adults *" htmlFor="adults" error={errors.adults}>
                  <input id="adults" type="number" min="1" max="20" className={inputBase} value={form.adults} onChange={set('adults')} />
                </Field>
              </div>

              <Field label="Children and ages" htmlFor="children">
                <input id="children" className={inputBase} value={form.children} onChange={set('children')} placeholder="e.g. two children, 7 and 11" />
              </Field>

              <Field label="Budget per person" htmlFor="budget">
                <div className="flex gap-2">
                  <input id="budget" className={inputBase} value={form.budget} onChange={set('budget')} placeholder="Indicative only" />
                  <select aria-label="Currency" className={`${inputBase} w-24`} value={form.currency} onChange={set('currency')}>
                    {ENQUIRY_OPTIONS.currencies.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </Field>

              <Field label="Accommodation preference" htmlFor="accommodation_preference">
                <select id="accommodation_preference" className={inputBase} value={form.accommodation_preference} onChange={set('accommodation_preference')}>
                  <option value="">No preference yet</option>
                  {ENQUIRY_OPTIONS.accommodationPreferences.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </Field>

              <Field label="Travel style" htmlFor="travel_style">
                <select id="travel_style" className={inputBase} value={form.travel_style} onChange={set('travel_style')}>
                  <option value="">No preference yet</option>
                  {ENQUIRY_OPTIONS.travelStyles.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </Field>
            </div>
          </fieldset>

          <fieldset className="space-y-5 border-t border-border pt-8">
            <legend className="mb-4 font-heading text-[1.25rem] text-forest">How should we handle this?</legend>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Enquiry type" htmlFor="enquiry_type">
                <select id="enquiry_type" className={inputBase} value={form.enquiry_type} onChange={set('enquiry_type')}>
                  {ENQUIRY_OPTIONS.types.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </Field>
              <Field label="Preferred contact" htmlFor="contact_preference">
                <select id="contact_preference" className={inputBase} value={form.contact_preference} onChange={set('contact_preference')}>
                  {ENQUIRY_OPTIONS.contactPreferences.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </Field>
            </div>
            <p className="text-[0.75rem] leading-relaxed text-ink/50">
              A â€œBooking requestâ€ starts a conversation. It does not create a reservation â€” nothing is held or charged
              until you accept a written quotation.
            </p>
          </fieldset>
        </>
      )}

      <fieldset className="space-y-5 border-t border-border pt-8">
        <legend className="mb-4 font-heading text-[1.25rem] text-forest">
          {compact ? 'Your message' : 'Anything else'}
        </legend>
        <Field label={compact ? 'Message *' : 'Additional requests'} htmlFor="message">
          <textarea
            id="message"
            rows={compact ? 5 : 4}
            className={inputBase}
            value={form.message}
            onChange={set('message')}
            placeholder={
              compact
                ? 'How can we help?'
                : 'Anything we should know â€” pace, interests, accessibility needs, special occasions.'
            }
          />
        </Field>

        <div aria-hidden="true" className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
          <label htmlFor="company">Company</label>
          <input id="company" tabIndex={-1} autoComplete="off" value={form.company} onChange={set('company')} />
        </div>

        <div data-invalid={!!errors.privacy_acknowledged}>
          <label htmlFor="privacy_acknowledged" className="flex cursor-pointer items-start gap-3">
            <input
              id="privacy_acknowledged"
              type="checkbox"
              checked={form.privacy_acknowledged}
              onChange={set('privacy_acknowledged')}
              className="mt-1 h-4 w-4 shrink-0 accent-forest"
            />
            <span className="text-[0.8125rem] leading-relaxed text-ink/70">
              I have read the{' '}
              <Link to="/privacy-policy" className="text-forest underline decoration-gold underline-offset-4">
                privacy notice
              </Link>{' '}
              and agree that Tuzuru Africa may contact me about this enquiry. *
            </span>
          </label>
          {errors.privacy_acknowledged && (
            <p className="mt-1.5 text-[0.75rem] text-destructive">{errors.privacy_acknowledged}</p>
          )}
        </div>
      </fieldset>

      {serverError && (
        <div role="alert" className="flex items-start gap-3 border border-destructive/30 bg-destructive/5 px-5 py-4">
          <AlertCircle size={16} className="mt-0.5 shrink-0 text-destructive" aria-hidden="true" />
          <p className="text-[0.8125rem] leading-relaxed text-destructive">{serverError}</p>
        </div>
      )}

      <div className="flex flex-col gap-4 border-t border-border pt-8 sm:flex-row sm:items-center">
        <button type="submit" disabled={busy} className="btn-solid disabled:opacity-60">
          {busy ? (
            <span className="inline-flex items-center gap-2">
              <Loader2 size={14} className="animate-spin" /> Sending
            </span>
          ) : (
            'Send enquiry'
          )}
        </button>
        <p className="text-[0.75rem] leading-relaxed text-ink/50">
          Enquiries are answered within one working day. Your details are only used to respond to this enquiry.
        </p>
      </div>
    </form>
  );
}

