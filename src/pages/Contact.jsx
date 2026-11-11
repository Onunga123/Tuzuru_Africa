import { Link } from 'react-router-dom';
import PageHero from '@/components/common/PageHero';
import EnquiryForm from '@/components/enquiries/EnquiryForm';
import { IMAGES, site } from '@/lib/cms';
import { Mail, MapPin, MessageCircle, Phone, Clock } from 'lucide-react';

export default function Contact() {
  return (
    <>
      <PageHero
        crumbs={[{ label: 'Contact' }]}
        eyebrow="Contact"
        title="Talk to a specialist"
        intro="Ask a question, check whether an idea is workable, or start planning properly. Either way, a person will reply."
        image={IMAGES.capetown}
        compact
      />

      <section className="mx-auto max-w-[1400px] px-5 py-16 sm:px-8 lg:px-12 lg:py-24">
        <div className="grid gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <div>
            <h2 className="font-heading text-[1.6rem] text-forest">Ways to reach us</h2>
            <div className="mt-7 space-y-0">
              <a href={`tel:${site.phone.replace(/\s/g, '')}`} className="group flex items-start gap-4 border-t border-border py-5">
                <Phone size={17} className="mt-0.5 shrink-0 text-gold-bronze" aria-hidden="true" />
                <span>
                  <span className="block font-body text-[0.625rem] uppercase tracking-[0.18em] text-ink/40">Telephone</span>
                  <span className="mt-1 block text-[0.9375rem] text-forest group-hover:text-gold-bronze">{site.phone}</span>
                </span>
              </a>
              <a href={`mailto:${site.email}`} className="group flex items-start gap-4 border-t border-border py-5">
                <Mail size={17} className="mt-0.5 shrink-0 text-gold-bronze" aria-hidden="true" />
                <span>
                  <span className="block font-body text-[0.625rem] uppercase tracking-[0.18em] text-ink/40">Email</span>
                  <span className="mt-1 block text-[0.9375rem] text-forest group-hover:text-gold-bronze">{site.email}</span>
                </span>
              </a>
              <a
                href={site.whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-start gap-4 border-t border-border py-5"
              >
                <MessageCircle size={17} className="mt-0.5 shrink-0 text-gold-bronze" aria-hidden="true" />
                <span>
                  <span className="block font-body text-[0.625rem] uppercase tracking-[0.18em] text-ink/40">WhatsApp</span>
                  <span className="mt-1 block text-[0.9375rem] text-forest group-hover:text-gold-bronze">Message the team</span>
                </span>
              </a>
              <div className="flex items-start gap-4 border-y border-border py-5">
                <MapPin size={17} className="mt-0.5 shrink-0 text-gold-bronze" aria-hidden="true" />
                <span>
                  <span className="block font-body text-[0.625rem] uppercase tracking-[0.18em] text-ink/40">Based in</span>
                  <span className="mt-1 block text-[0.9375rem] text-ink/75">{site.location}</span>
                  <span className="mt-1 block text-[0.75rem] leading-relaxed text-ink/45">
                    A verified visiting address will be published once confirmed. We have not shown a map for that
                    reason.
                  </span>
                </span>
              </div>
              <p className="flex items-start gap-4 border-b border-border py-5 text-[0.8125rem] leading-relaxed text-ink/60">
                <Clock size={17} className="mt-0.5 shrink-0 text-gold-bronze" aria-hidden="true" />
                {site.hours}
              </p>
            </div>

            <p className="mt-6 text-[0.75rem] leading-relaxed text-ink/45">{site.contactNote}</p>

            <div className="mt-8 border-l-2 border-gold bg-sand/50 px-5 py-4">
              <p className="text-[0.8125rem] leading-relaxed text-ink/65">
                Looking for something specific? The{' '}
                <Link to="/faqs" className="text-forest underline decoration-gold underline-offset-4">FAQs</Link>{' '}
                cover pricing, reservations and travel practicalities.
              </p>
            </div>
          </div>

          <div className="border border-border bg-paper p-6 sm:p-8">
            <h2 className="font-heading text-[1.6rem] text-forest">Send a message</h2>
            <p className="mt-2 text-[0.875rem] leading-relaxed text-ink/60">
              For a full trip enquiry, the{' '}
              <Link to="/plan-your-trip" className="text-forest underline decoration-gold underline-offset-4">
                planning form
              </Link>{' '}
              asks the right questions. For anything else, use this.
            </p>
            <div className="mt-8">
              <EnquiryForm compact />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}