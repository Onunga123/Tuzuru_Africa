import { useState } from 'react';
import { Link } from 'react-router-dom';
import PageHero from '@/components/common/PageHero';
import TourCard from '@/components/tours/TourCard';
import TourFilters, { defaultFilters, filterTours } from '@/components/tours/TourFilters';
import EmptyState from '@/components/common/EmptyState';
import { IMAGES, tours } from '@/lib/cms';

export default function Tours() {
  const [filters, setFilters] = useState(defaultFilters);
  const results = filterTours(tours, filters);

  return (
    <>
      <PageHero
        crumbs={[{ label: 'Tours & Packages' }]}
        eyebrow="Tours & packages"
        title="Journeys to start from"
        intro="Eight starting points across East and Southern Africa. Every one of them can be reshaped around your dates, your party and the pace you want."
        image={IMAGES.migration}
      />

      <TourFilters filters={filters} setFilters={setFilters} />

      <section className="mx-auto max-w-[1400px] px-5 py-14 sm:px-8 lg:px-12 lg:py-20">
        <div className="mb-10 flex flex-wrap items-baseline justify-between gap-4">
          <p className="font-body text-[0.75rem] uppercase tracking-[0.18em] text-ink/50">
            {results.length} {results.length === 1 ? 'journey' : 'journeys'}
            {filters.query ? ` matching “${filters.query}”` : ''}
          </p>
          <p className="font-body text-[0.6875rem] uppercase tracking-[0.16em] text-ink/40">
            Prices are quoted per itinerary
          </p>
        </div>

        {results.length === 0 ? (
          <EmptyState
            title="No journeys match those filters"
            body="Try a broader search — or tell us what you have in mind and we will build something around it."
            action={
              <Link to="/plan-your-trip" className="btn-solid">
                Plan a custom trip
              </Link>
            }
          />
        ) : (
          <div className="grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((tour) => (
              <TourCard key={tour.slug} tour={tour} />
            ))}
          </div>
        )}

        <div className="mt-16 border-t border-border pt-10">
          <p className="max-w-2xl text-[0.875rem] leading-relaxed text-ink/60">
            Nothing here quite fits? Most of the trips we plan are built from scratch. Send us your dates and a
            rough idea of the trip, and we will suggest a route.
          </p>
          <Link to="/plan-your-trip" className="link-cta mt-6">
            Tell us what you are looking for
          </Link>
        </div>
      </section>
    </>
  );
}