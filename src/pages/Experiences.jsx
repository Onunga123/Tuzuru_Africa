import { Link } from 'react-router-dom';
import { Image } from '@/components/ui/image';
import PageHero from '@/components/common/PageHero';
import Reveal from '@/components/common/Reveal';
import { experiences, IMAGES, tours } from '@/lib/cms';
import { Binoculars, Users, Waves, Mountain, Trees, UtensilsCrossed } from 'lucide-react';

const ICONS = { Binoculars, Users, Waves, Mountain, Trees, UtensilsCrossed };

export default function Experiences() {
  return (
    <>
      <PageHero
        crumbs={[{ label: 'Experiences' }]}
        eyebrow="Ways to travel"
        title="Choose the kind of days you want"
        intro="Most trips combine two or three of these. Tell us which matter most and we will build the route around them."
        image={IMAGES.balloon}
      />

      <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12">
        <nav aria-label="Experience categories" className="flex flex-wrap gap-x-6 gap-y-2 border-b border-border py-6">
          {experiences.map((e) => (
            <a
              key={e.slug}
              href={`#${e.slug}`}
              className="font-body text-[0.6875rem] uppercase tracking-[0.16em] text-ink/55 hover:text-forest"
            >
              {e.name}
            </a>
          ))}
        </nav>
      </div>

      {experiences.map((exp, i) => {
        const Icon = ICONS[exp.icon] ?? Binoculars;
        const related = tours.filter((t) => t.experiences.includes(exp.name)).slice(0, 2);
        const flip = i % 2 === 1;

        return (
          <section
            key={exp.slug}
            id={exp.slug}
            className={`scroll-mt-24 border-b border-border py-16 lg:py-20 ${i % 3 === 1 ? 'bg-sand/50' : ''}`}
          >
            <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12">
              <div className={`grid items-center gap-10 lg:grid-cols-2 lg:gap-16 ${flip ? 'lg:[&>*:first-child]:order-2' : ''}`}>
                <Reveal>
                  <div className="aspect-[4/3] w-full overflow-hidden bg-sand">
                    <Image src={exp.image} alt={exp.name} className="h-full w-full" />
                  </div>
                </Reveal>

                <Reveal delay={0.08}>
                  <div>
                    <Icon size={22} className="text-gold-bronze" aria-hidden="true" />
                    <h2 className="mt-4 font-heading text-[1.9rem] leading-tight text-forest sm:text-[2.3rem]">{exp.name}</h2>
                    <p className="mt-4 text-[0.9375rem] leading-relaxed text-ink/70">{exp.blurb}</p>
                    <p className="mt-3 text-[0.9375rem] leading-relaxed text-ink/70">{exp.detail}</p>

                    {related.length > 0 && (
                      <div className="mt-6 border-t border-border pt-5">
                        <p className="font-body text-[0.625rem] uppercase tracking-[0.18em] text-ink/40">Journeys with this</p>
                        <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2">
                          {related.map((t) => (
                            <Link
                              key={t.slug}
                              to={`/tours/${t.slug}`}
                              className="font-body text-[0.8125rem] text-forest underline decoration-gold underline-offset-4 hover:text-gold-bronze"
                            >
                              {t.title}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}

                    <Link to="/plan-your-trip" className="link-cta mt-7">
                      Enquire about this
                    </Link>
                  </div>
                </Reveal>
              </div>
            </div>
          </section>
        );
      })}

      <section className="bg-forest py-16 text-paper lg:py-20">
        <div className="mx-auto flex max-w-[1400px] flex-col gap-8 px-5 sm:px-8 lg:flex-row lg:items-center lg:justify-between lg:px-12">
          <div>
            <p className="eyebrow mb-3 text-gold">Something else in mind?</p>
            <h2 className="max-w-xl font-heading text-[1.7rem] leading-tight text-paper sm:text-[2.1rem]">
              These are starting points, not a fixed menu.
            </h2>
          </div>
          <Link to="/plan-your-trip" className="btn-solid shrink-0 !bg-gold !text-forest-deep hover:!bg-gold-light">
            Tell us your idea
          </Link>
        </div>
      </section>
    </>
  );
}