import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Minus, Plus } from 'lucide-react';
import PageHero from '@/components/common/PageHero';
import { faqGroups, IMAGES, site } from '@/lib/cms';

export default function Faqs() {
  const [open, setOpen] = useState(/** @type {string | null} */ (`${faqGroups[0].group}-0`));

  return (
    <>
      <PageHero
        crumbs={[{ label: 'FAQs' }]}
        eyebrow="Help & information"
        title="Questions travellers ask before booking"
        intro="If something is not covered here, ask us directly â€” a specialist will answer properly rather than point you at a form."
        image={IMAGES.vehicle}
        compact
      />

      <section className="mx-auto max-w-[1400px] px-5 py-16 sm:px-8 lg:px-12 lg:py-24">
        <div className="grid gap-12 lg:grid-cols-[240px_1fr] lg:gap-16">
          <nav aria-label="FAQ categories" className="lg:sticky lg:top-24 lg:self-start">
            <p className="eyebrow mb-4 text-gold-bronze">Categories</p>
            <ul className="space-y-2 border-l border-border pl-4">
              {faqGroups.map((group) => (
                <li key={group.group}>
                  <a
                    href={`#${group.group.replace(/\s+/g, '-').toLowerCase()}`}
                    className="font-body text-[0.8125rem] text-ink/65 hover:text-forest"
                  >
                    {group.group}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="max-w-3xl">
            {faqGroups.map((group) => (
              <section
                key={group.group}
                id={group.group.replace(/\s+/g, '-').toLowerCase()}
                className="mb-14 scroll-mt-24 last:mb-0"
              >
                <h2 className="font-heading text-[1.6rem] text-forest">{group.group}</h2>
                <div className="mt-5">
                  {group.items.map((item, i) => {
                    const key = `${group.group}-${i}`;
                    const isOpen = open === key;
                    return (
                      <div key={key} className="border-b border-border">
                        <h3>
                          <button
                            type="button"
                            onClick={() => setOpen(isOpen ? null : key)}
                            aria-expanded={isOpen}
                            aria-controls={`panel-${key}`}
                            id={`trigger-${key}`}
                            className="flex w-full items-start justify-between gap-6 py-5 text-left"
                          >
                            <span className="font-body text-[0.9375rem] font-medium leading-relaxed text-ink">
                              {item.q}
                            </span>
                            <span className="mt-0.5 shrink-0 text-gold-bronze" aria-hidden="true">
                              {isOpen ? <Minus size={16} /> : <Plus size={16} />}
                            </span>
                          </button>
                        </h3>
                        {isOpen && (
                          <div
                            id={`panel-${key}`}
                            role="region"
                            aria-labelledby={`trigger-${key}`}
                            className="pb-6 pr-8 text-[0.9375rem] leading-relaxed text-ink/70"
                          >
                            {item.a}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>
            ))}

            <div className="border-l-2 border-gold bg-sand/50 px-6 py-5">
              <p className="font-heading text-[1.15rem] text-forest">Still unsure about something?</p>
              <p className="mt-2 text-[0.9375rem] leading-relaxed text-ink/70">
                Email <a href={`mailto:${site.email}`} className="text-forest underline decoration-gold underline-offset-4">{site.email}</a>{' '}
                or send an enquiry â€” you will get a written answer, not a brochure.
              </p>
              <Link to="/contact" className="link-cta mt-5">Contact us</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

