import { Link } from 'react-router-dom';
import Reveal from '@/components/common/Reveal';
import { site, homepage } from '@/lib/cms';

export default function HomeCta() {
  return (
    <section className="border-y border-border bg-paper">
      <div className="mx-auto max-w-[1400px] px-5 py-20 sm:px-8 lg:px-12 lg:py-24">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
          <Reveal>
            <p className="eyebrow mb-5 text-gold-bronze">{homepage.cta.eyebrow}</p>
            <h2 className="max-w-2xl font-heading text-[2.1rem] leading-[1.08] text-forest sm:text-[2.8rem] lg:text-[3.4rem]">
              {homepage.cta.title}
            </h2>
            <p className="mt-6 max-w-xl text-[1rem] leading-relaxed text-ink/70">{homepage.cta.body}</p>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="flex flex-col gap-4 sm:flex-row lg:flex-col lg:items-start">
              <Link to="/plan-your-trip" className="btn-solid w-full sm:w-auto">
                Plan Your Trip
              </Link>
              <a
                href={site.whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline w-full sm:w-auto"
              >
                Message on WhatsApp
              </a>
              <p className="font-body text-[0.6875rem] uppercase tracking-[0.16em] text-ink/40">
                {homepage.cta.note}
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}