import { Link, useLocation } from 'react-router-dom';
import { Check, MessageCircle, Mail } from 'lucide-react';
import { site } from '@/lib/cms';

export default function EnquiryConfirmation() {
  const { state } = useLocation();
  const reference = state?.reference;
  const name = state?.name;

  return (
    <section className="bg-paper">
      <div className="mx-auto max-w-[820px] px-5 py-20 sm:px-8 lg:py-28">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-forest">
          <Check size={26} className="text-paper" aria-hidden="true" />
        </div>

        <p className="eyebrow mt-8 text-gold-bronze">Enquiry received</p>
        <h1 className="mt-4 font-heading text-[2rem] leading-[1.1] text-forest sm:text-[2.8rem]">
          {name ? `Thank you, ${name.split(' ')[0]}.` : 'Thank you — we have your enquiry.'}
        </h1>
        <p className="mt-5 max-w-xl text-[1rem] leading-relaxed text-ink/70">
          A travel specialist will read it and reply within one working day, usually with a few questions and an
          outline of what is possible.
        </p>

        {reference && (
          <div className="mt-8 inline-block border border-border bg-sand/60 px-5 py-4">
            <p className="font-body text-[0.625rem] uppercase tracking-[0.2em] text-ink/45">Your reference</p>
            <p className="mt-1 font-mono text-[1.1rem] tracking-wider text-forest">{reference}</p>
          </div>
        )}

        {!reference && (
          <p className="mt-6 border-l-2 border-gold bg-sand/50 px-5 py-4 text-[0.875rem] leading-relaxed text-ink/70">
            We could not display a reference here, which usually means this page was opened directly. If you have not
            received an acknowledgement email, please contact us so we can confirm your enquiry was recorded.
          </p>
        )}

        <div className="mt-12 border-t border-border pt-8">
          <h2 className="font-heading text-[1.4rem] text-forest">What happens next</h2>
          <ol className="mt-5 space-y-4">
            {[
              'We check availability for your dates and the places you mentioned.',
              'A specialist replies with questions and an outline itinerary.',
              'If it looks right, you receive a written quotation with clear inclusions and payment terms.',
              'Nothing is reserved or charged until you accept a quotation in writing.',
            ].map((step, i) => (
              <li key={step} className="flex gap-4">
                <span className="font-heading text-[1rem] text-gold-bronze">{String(i + 1).padStart(2, '0')}</span>
                <span className="text-[0.9375rem] leading-relaxed text-ink/70">{step}</span>
              </li>
            ))}
          </ol>
        </div>

        <div className="mt-10 border-l-2 border-gold bg-sand/50 px-5 py-4">
          <p className="text-[0.8125rem] leading-relaxed text-ink/70">
            <strong className="font-semibold text-forest">This is an enquiry, not a confirmed booking.</strong> No
            reservation has been made and no payment has been taken.
          </p>
        </div>

        <div className="mt-12 flex flex-wrap items-center gap-5 border-t border-border pt-8">
          <Link to="/" className="btn-solid">Back to homepage</Link>
          <a href={site.whatsappLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 font-body text-[0.6875rem] uppercase tracking-[0.16em] text-forest hover:text-gold-bronze">
            <MessageCircle size={14} /> WhatsApp us
          </a>
          <a href={`mailto:${site.email}`} className="inline-flex items-center gap-2 font-body text-[0.6875rem] uppercase tracking-[0.16em] text-forest hover:text-gold-bronze">
            <Mail size={14} /> {site.email}
          </a>
        </div>

        <div className="mt-10 flex flex-wrap gap-x-6 gap-y-2 font-body text-[0.75rem] text-ink/50">
          <Link to="/tours" className="hover:text-forest">Browse tours</Link>
          <Link to="/destinations" className="hover:text-forest">Browse destinations</Link>
          <Link to="/travel-guides" className="hover:text-forest">Read travel guides</Link>
        </div>
      </div>
    </section>
  );
}