import { Link, useParams } from 'react-router-dom';
import { Compass, CalendarDays, Info, Check } from 'lucide-react';
import PageHero from '@/components/common/PageHero';
import Reveal from '@/components/common/Reveal';
import TourCard from '@/components/tours/TourCard';
import { destinations, findDestination, toursByDestination } from '@/lib/cms';

export default function DestinationDetail() {
  const { slug } = useParams();
  const destination = findDestination(slug);

  if (!destination) {
    return (
      <section className="mx-auto max-w-3xl px-5 py-32 text-center sm:px-8">
        <p className="eyebrow text-gold-bronze">Not found</p>
        <h1 className="mt-4 font-heading text-[2rem] text-forest">We could not find that destination</h1>
        <p className="mt-4 text-[0.9375rem] text-ink/65">It may have been renamed. Browse all destinations to find it.</p>
        <Link to="/destinations" className="btn-solid mt-8">All destinations</Link>
      </section>
    );
  }

  const relatedTours = toursByDestination(destination.slug);
  const others = destinations.filter((d) => d.slug !== destination.slug).slice(0, 3);

  return (
    <>
      <PageHero
        image={destination.image}
        crumbs={[{ label: 'Destinations', to: '/destinations' }, { label: destination.name }]}
        eyebrow={`${destination.country} · ${destination.region}`}
        title={destination.name}
        intro={destination.tagline}
      />

      <section className="mx-auto max-w-[1400px] px-5 py-16 sm:px-8 lg:px-12 lg:py-24">
        <div className="grid gap-14 lg:grid-cols-[1.35fr_0.65fr] lg:gap-16">
          <div>
            <Reveal>
              <p className="eyebrow mb-4 text-gold-bronze">Overview</p>
              <p className="prose-editorial">{destination.description}</p>
            </Reveal>

            <Reveal delay={0.05}>
              <div className="mt-12 grid gap-10 sm:grid-cols-2">
                <div>
                  <h2 className="flex items-center gap-2 font-heading text-[1.35rem] text-forest">
                    <Compass size={17} className="text-gold-bronze" aria-hidden="true" /> Main attractions
                  </h2>
                  <ul className="mt-4 space-y-2">
                    {destination.attractions.map((a) => (
                      <li key={a} className="flex items-start gap-3 text-[0.9375rem] leading-relaxed text-ink/70">
                        <Check size={14} className="mt-1.5 shrink-0 text-gold-bronze" aria-hidden="true" />
                        {a}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h2 className="flex items-center gap-2 font-heading text-[1.35rem] text-forest">
                    <CalendarDays size={17} className="text-gold-bronze" aria-hidden="true" /> Best time to visit
                  </h2>
                  <p className="mt-4 text-[0.9375rem] leading-relaxed text-ink/70">{destination.bestTime}</p>
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.05}>
              <div className="mt-12 border-l-2 border-gold bg-sand/50 px-6 py-5">
                <h2 className="flex items-center gap-2 font-heading text-[1.2rem] text-forest">
                  <Info size={16} className="text-gold-bronze" aria-hidden="true" /> Travel information
                </h2>
                <p className="mt-2 text-[0.9375rem] leading-relaxed text-ink/70">{destination.travelInfo}</p>
                <p className="mt-3 text-[0.8125rem] leading-relaxed text-ink/50">
                  Visa, health and safety requirements change often. We will point you to current official guidance,
                  but confirmation should always come from the relevant authority.
                </p>
              </div>
            </Reveal>
          </div>

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="border border-border bg-paper p-6 lg:p-7">
              <p className="eyebrow text-gold-bronze">Plan a trip here</p>
              <p className="mt-3 text-[0.9375rem] leading-relaxed text-ink/70">
                Tell us when you can travel and we will suggest a route through {destination.name} with the right
                balance of driving, rest and time on the ground.
              </p>
              <Link to="/plan-your-trip" className="btn-solid mt-6 w-full">
                Start an enquiry
              </Link>
              <Link to="/tours" className="link-cta mt-5 !text-[0.6875rem]">
                Browse tours
              </Link>
            </div>
          </aside>
        </div>
      </section>

      {relatedTours.length > 0 && (
        <section className="border-t border-border bg-sand/50 py-16 lg:py-20">
          <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12">
            <h2 className="font-heading text-[1.7rem] text-forest">Journeys including {destination.name}</h2>
            <div className="mt-10 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {relatedTours.map((t) => (
                <TourCard key={t.slug} tour={t} />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="mx-auto max-w-[1400px] px-5 py-16 sm:px-8 lg:px-12">
        <h2 className="font-heading text-[1.5rem] text-forest">Other places to consider</h2>
        <div className="mt-8 grid gap-8 sm:grid-cols-3">
          {others.map((d) => (
            <Link key={d.slug} to={`/destinations/${d.slug}`} className="group border-t border-border pt-5">
              <p className="eyebrow text-gold-bronze">{d.country}</p>
              <p className="mt-2 font-heading text-[1.2rem] text-forest group-hover:text-gold-bronze">{d.name}</p>
              <p className="mt-2 text-[0.875rem] leading-relaxed text-ink/60">{d.tagline}</p>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}