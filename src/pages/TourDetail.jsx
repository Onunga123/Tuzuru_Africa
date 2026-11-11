import { Link, useParams } from 'react-router-dom';
import { Check, X, Clock, MapPin, Users } from 'lucide-react';
import PageHero from '@/components/common/PageHero';
import Reveal from '@/components/common/Reveal';
import TourCard from '@/components/tours/TourCard';
import { findTour, tours } from '@/lib/cms';

export default function TourDetail() {
  const { slug } = useParams();
  const tour = findTour(slug);

  if (!tour) {
    return (
      <section className="mx-auto max-w-3xl px-5 py-32 text-center sm:px-8">
        <p className="eyebrow text-gold-bronze">Not found</p>
        <h1 className="mt-4 font-heading text-[2rem] text-forest">That journey is no longer listed</h1>
        <p className="mt-4 text-[0.9375rem] text-ink/65">
          It may have been renamed or retired. Browse the current tours, or tell us what you are looking for.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Link to="/tours" className="btn-solid">Browse tours</Link>
          <Link to="/plan-your-trip" className="btn-outline">Plan your trip</Link>
        </div>
      </section>
    );
  }

  const related = tours.filter((t) => t.slug !== tour.slug && (t.destinationSlug === tour.destinationSlug || t.experiences.some((e) => tour.experiences.includes(e)))).slice(0, 3);

  return (
    <>
      <PageHero
        image={tour.image}
        crumbs={[{ label: 'Tours', to: '/tours' }, { label: tour.title }]}
        eyebrow={tour.destination}
        title={tour.title}
        intro={tour.overview}
      />

      <section className="border-b border-border bg-sand/50">
        <div className="mx-auto grid max-w-[1400px] grid-cols-2 divide-x divide-border px-5 sm:px-8 lg:grid-cols-4 lg:px-12">
          {[
            { icon: Clock, label: 'Duration', value: tour.duration },
            { icon: MapPin, label: 'Destination', value: tour.destination },
            { icon: Users, label: 'Style', value: tour.experiences.join(' · ') },
            { icon: Check, label: 'Pricing', value: 'Quoted per itinerary' },
          ].map((item) => (
            <div key={item.label} className="px-4 py-6 first:pl-0 lg:px-7">
              <p className="font-body text-[0.5625rem] uppercase tracking-[0.22em] text-ink/40">{item.label}</p>
              <p className="mt-2 flex items-start gap-2 text-[0.875rem] leading-snug text-forest">
                <item.icon size={14} className="mt-1 shrink-0 text-gold-bronze" aria-hidden="true" />
                {item.value}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-5 py-16 sm:px-8 lg:px-12 lg:py-24">
        <div className="grid gap-14 lg:grid-cols-[1.35fr_0.65fr] lg:gap-16">
          <div>
            <Reveal>
              <h2 className="font-heading text-[1.6rem] text-forest">Highlights</h2>
              <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                {tour.highlights.map((h) => (
                  <li key={h} className="flex items-start gap-3 text-[0.9375rem] leading-relaxed text-ink/75">
                    <Check size={15} className="mt-1 shrink-0 text-gold-bronze" aria-hidden="true" />
                    {h}
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={0.05}>
              <div className="mt-14">
                <h2 className="font-heading text-[1.6rem] text-forest">Itinerary</h2>
                <p className="mt-2 font-body text-[0.6875rem] uppercase tracking-[0.16em] text-ink/40">
                  Day by day · indicative and adjustable
                </p>
                <ol className="mt-8 space-y-0">
                  {tour.itinerary.map((day) => (
                    <li key={day.day} className="grid grid-cols-[auto_1fr] gap-5 border-t border-border py-6">
                      <span className="font-heading text-[1.1rem] text-gold-bronze">
                        {String(day.day).padStart(2, '0')}
                      </span>
                      <div>
                        <h3 className="font-heading text-[1.1rem] text-forest">{day.title}</h3>
                        <p className="mt-1.5 text-[0.9375rem] leading-relaxed text-ink/70">{day.detail}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            </Reveal>

            <Reveal delay={0.05}>
              <div className="mt-14 grid gap-10 sm:grid-cols-2">
                <div>
                  <h2 className="font-heading text-[1.35rem] text-forest">Accommodation</h2>
                  <p className="mt-3 text-[0.9375rem] leading-relaxed text-ink/70">{tour.accommodation}</p>
                </div>
                <div>
                  <h2 className="font-heading text-[1.35rem] text-forest">Transport</h2>
                  <p className="mt-3 text-[0.9375rem] leading-relaxed text-ink/70">{tour.transport}</p>
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.05}>
              <div className="mt-14 grid gap-10 sm:grid-cols-2">
                <div>
                  <h2 className="font-heading text-[1.35rem] text-forest">Included</h2>
                  <ul className="mt-4 space-y-2">
                    {tour.inclusions.map((i) => (
                      <li key={i} className="flex items-start gap-3 text-[0.9375rem] leading-relaxed text-ink/70">
                        <Check size={14} className="mt-1.5 shrink-0 text-forest" aria-hidden="true" />
                        {i}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h2 className="font-heading text-[1.35rem] text-forest">Not included</h2>
                  <ul className="mt-4 space-y-2">
                    {tour.exclusions.map((i) => (
                      <li key={i} className="flex items-start gap-3 text-[0.9375rem] leading-relaxed text-ink/60">
                        <X size={14} className="mt-1.5 shrink-0 text-ink/35" aria-hidden="true" />
                        {i}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.05}>
              <div className="mt-14 border-l-2 border-gold bg-sand/50 px-6 py-5">
                <h2 className="font-heading text-[1.2rem] text-forest">Important travel information</h2>
                <p className="mt-2 text-[0.9375rem] leading-relaxed text-ink/70">{tour.important}</p>
                <p className="mt-3 text-[0.8125rem] leading-relaxed text-ink/50">
                  Park fees, permits and seasonal rates change. Everything in your written quotation is confirmed
                  before you commit; nothing on this page is a live availability claim.
                </p>
              </div>
            </Reveal>
          </div>

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="border border-border bg-paper p-6 lg:p-7">
              <p className="eyebrow text-gold-bronze">Enquire</p>
              <p className="mt-3 font-heading text-[1.5rem] leading-tight text-forest">Price on request</p>
              <p className="mt-3 text-[0.875rem] leading-relaxed text-ink/65">
                Tell us your dates and party size and we will send a written quotation with what is included.
              </p>
              <Link to={`/plan-your-trip?tour=${tour.slug}`} className="btn-solid mt-6 w-full">
                Enquire about this tour
              </Link>
              <p className="mt-4 text-[0.6875rem] leading-relaxed text-ink/45">
                An enquiry is not a booking or a reservation. Nothing is held or charged until you accept a quotation.
              </p>

              <div className="mt-6 space-y-2 border-t border-border pt-5 text-[0.8125rem] text-ink/60">
                <p className="flex justify-between gap-4">
                  <span>Duration</span>
                  <span className="text-forest">{tour.duration}</span>
                </p>
                <p className="flex justify-between gap-4">
                  <span>Departs</span>
                  <span className="text-right text-forest">On your dates</span>
                </p>
                <p className="flex justify-between gap-4">
                  <span>Group</span>
                  <span className="text-right text-forest">Private or small group</span>
                </p>
              </div>

              <Link
                to={`/destinations/${tour.destinationSlug}`}
                className="link-cta mt-6 !text-[0.6875rem]"
              >
                About {tour.destination}
              </Link>
            </div>
          </aside>
        </div>
      </section>

      {related.length > 0 && (
        <section className="border-t border-border bg-sand/50 py-16 lg:py-20">
          <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12">
            <h2 className="font-heading text-[1.7rem] text-forest">Related journeys</h2>
            <div className="mt-10 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((t) => (
                <TourCard key={t.slug} tour={t} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}