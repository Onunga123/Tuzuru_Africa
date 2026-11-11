import { Link } from 'react-router-dom';
import { Image } from '@/components/ui/image';
import Reveal from '@/components/common/Reveal';
import SectionHeading from '@/components/common/SectionHeading';
import { guides, formatDate } from '@/lib/cms';

export default function TravelInspiration() {
  return (
    <section className="mx-auto max-w-[1400px] px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
      <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <Reveal>
          <SectionHeading
            eyebrow="Travel inspiration"
            title="Notes from the ground"
            intro="Practical writing on seasons, regions and how these places actually work."
          />
        </Reveal>
        <Reveal delay={0.1}>
          <Link to="/travel-guides" className="link-cta shrink-0">
            All guides
          </Link>
        </Reveal>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-10 md:grid-cols-3">
        {guides.map((guide, i) => (
          <Reveal key={guide.slug} delay={i * 0.08}>
            <article className="group">
              <Link to={`/travel-guides/${guide.slug}`}>
                <div className="aspect-[3/2] w-full overflow-hidden bg-sand">
                  <Image
                    src={guide.image}
                    alt={guide.title}
                    className="h-full w-full transition-transform duration-[900ms] group-hover:scale-[1.04]"
                  />
                </div>
                <p className="mt-5 eyebrow text-gold-bronze">{guide.category}</p>
                <h3 className="mt-3 font-heading text-[1.3rem] leading-snug text-forest group-hover:text-gold-bronze">
                  {guide.title}
                </h3>
                <p className="mt-2 text-[0.9375rem] leading-relaxed text-ink/70">{guide.excerpt}</p>
                <p className="mt-4 font-body text-[0.6875rem] uppercase tracking-[0.16em] text-ink/40">
                  {formatDate(guide.date)} · {guide.readingTime}
                </p>
              </Link>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}