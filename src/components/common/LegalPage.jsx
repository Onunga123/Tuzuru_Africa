import PageHero from '@/components/common/PageHero';
import { Link } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';

export default function LegalPage({ title, intro, updated, sections, image, crumb }) {
  return (
    <>
      <PageHero crumbs={[{ label: crumb || title }]} eyebrow="Legal & policies" title={title} intro={intro} image={image} compact />

      <section className="mx-auto max-w-[900px] px-5 py-16 sm:px-8 lg:py-20">
        <div className="flex items-start gap-3 border border-gold/40 bg-sand/60 px-5 py-4">
          <AlertTriangle size={16} className="mt-0.5 shrink-0 text-gold-bronze" aria-hidden="true" />
          <p className="text-[0.8125rem] leading-relaxed text-ink/70">
            <strong className="font-semibold text-forest">Draft for review.</strong> This document is a working draft
            prepared for Tuzuru Africa. It must be reviewed by a qualified legal adviser and completed with the
            company’s registered details before publication. A policy page is not, in itself, evidence of compliance.
          </p>
        </div>

        <p className="mt-8 font-body text-[0.6875rem] uppercase tracking-[0.16em] text-ink/40">
          Last updated: {updated}
        </p>

        <div className="prose-editorial mt-8">
          {sections.map((section) => (
            <section key={section.heading}>
              <h2>{section.heading}</h2>
              {section.paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
              {section.list && (
                <ul>
                  {section.list.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>

        <div className="mt-14 border-t border-border pt-8">
          <p className="text-[0.875rem] leading-relaxed text-ink/65">
            Questions about this document? Write to us and we will route it to the right person.
          </p>
          <div className="mt-5 flex flex-wrap gap-4">
            <Link to="/contact" className="btn-outline">Contact us</Link>
            <Link to="/plan-your-trip" className="btn-solid">Plan your trip</Link>
          </div>
        </div>
      </section>
    </>
  );
}