import { Link } from 'react-router-dom';
import PageHero from '@/components/common/PageHero';
import EnquiryForm from '@/components/enquiries/EnquiryForm';
import { IMAGES, site } from '@/lib/cms';
import { Clock, MessageCircle, ShieldCheck } from 'lucide-react';

export default function PlanYourTrip() {
  return (
    <>
      <PageHero
        crumbs={[{ label: 'Plan Your Trip' }]}
        eyebrow="Plan your trip"
        title="Tell us what you have in mind"
        intro="A few details is enough to start. A specialist will reply within one working day with questions and an outline — no obligation, no cost."
        image={IMAGES.hero}
        compact
      />

      <section className="mx-auto max-w-[1400px] px-5 py-16 sm:px-8 lg:px-12 lg:py-24">
        <div className="grid gap-14 lg:grid-cols-[1.4fr_0.6fr] lg:gap-16">
          <div>
            <EnquiryForm />
          </div>

          <aside className="space-y-8 lg:sticky lg:top-24 lg:self-start">
            <div className="border border-border bg-paper p-6">
              <p className="eyebrow text-gold-bronze">What happens next</p>
              <ol className="mt-4 space-y-4">
                {[
                  'We read your enquiry and check availability for your dates.',
                  'A specialist replies with questions and an outline itinerary.',
                  'You receive a written quotation with clear inclusions.',
                  'Only when you accept it does anything get reserved.',
                ].map((step, i) => (
                  <li key={step} className="flex gap-3">
                    <span className="font-heading text-[0.95rem] text-gold-bronze">{String(i + 1).padStart(2, '0')}</span>
                    <span className="text-[0.875rem] leading-relaxed text-ink/70">{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="space-y-4 border-t border-border pt-6">
              <p className="flex items-start gap-3 text-[0.8125rem] leading-relaxed text-ink/65">
                <Clock size={15} className="mt-0.5 shrink-0 text-gold-bronze" aria-hidden="true" />
                {site.hours}
              </p>
              <a
                href={site.whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3 text-[0.8125rem] leading-relaxed text-forest hover:text-gold-bronze"
              >
                <MessageCircle size={15} className="mt-0.5 shrink-0" aria-hidden="true" />
                Prefer to message? Use WhatsApp
              </a>
              <p className="flex items-start gap-3 text-[0.75rem] leading-relaxed text-ink/45">
                <ShieldCheck size={15} className="mt-0.5 shrink-0 text-forest/60" aria-hidden="true" />
                Your details are used only to respond to this enquiry and are never sold or shared for marketing.
              </p>
            </div>

            <div className="bg-sand/60 p-5">
              <p className="text-[0.75rem] leading-relaxed text-ink/55">
                Please read the{' '}
                <Link to="/booking-policy" className="text-forest underline decoration-gold underline-offset-4">
                  booking and cancellation policy
                </Link>{' '}
                before confirming any trip.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}