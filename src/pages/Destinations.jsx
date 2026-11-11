import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import PageHero from '@/components/common/PageHero';
import DestinationCard from '@/components/destinations/DestinationCard';
import EmptyState from '@/components/common/EmptyState';
import { destinations, IMAGES } from '@/lib/cms';

export default function Destinations() {
  const [query, setQuery] = useState('');
  const [country, setCountry] = useState('all');

  const countries = useMemo(() => Array.from(new Set(destinations.map((d) => d.country))), []);

  const results = destinations.filter((d) => {
    const q = query.trim().toLowerCase();
    const matchesQuery =
      !q ||
      [d.name, d.country, d.region, d.tagline, d.intro].join(' ').toLowerCase().includes(q);
    const matchesCountry = country === 'all' || d.country === country;
    return matchesQuery && matchesCountry;
  });

  return (
    <>
      <PageHero
        crumbs={[{ label: 'Destinations' }]}
        eyebrow="Where to go"
        title="Six regions we plan around most"
        intro="Each has its own season, its own rhythm and its own reason to go. Start with a place, and we will build the trip outward from there."
        image={IMAGES.serengeti}
      />

      <section className="border-b border-border bg-sand/50">
        <div className="mx-auto flex max-w-[1400px] flex-col gap-4 px-5 py-6 sm:flex-row sm:items-center sm:px-8 lg:px-12">
          <label className="relative block flex-1">
            <span className="sr-only">Search destinations</span>
            <Search size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink/40" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search destinations, countries or regions"
              className="w-full border border-border bg-paper py-3 pl-11 pr-4 font-body text-[0.8125rem] text-ink placeholder:text-ink/40 focus:border-forest focus:outline-none"
            />
          </label>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setCountry('all')}
              className={`border px-4 py-2.5 font-body text-[0.6875rem] uppercase tracking-[0.14em] transition-colors ${
                country === 'all' ? 'border-forest bg-forest text-paper' : 'border-border text-ink/60 hover:border-forest/40'
              }`}
            >
              All countries
            </button>
            {countries.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCountry(c)}
                className={`border px-4 py-2.5 font-body text-[0.6875rem] uppercase tracking-[0.14em] transition-colors ${
                  country === c ? 'border-forest bg-forest text-paper' : 'border-border text-ink/60 hover:border-forest/40'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-5 py-16 sm:px-8 lg:px-12 lg:py-20">
        <p className="mb-10 font-body text-[0.75rem] uppercase tracking-[0.18em] text-ink/50">
          {results.length} {results.length === 1 ? 'destination' : 'destinations'}
        </p>

        {results.length === 0 ? (
          <EmptyState
            title="Nothing matches that search"
            body="Try a country name or a broader term — or tell us where you are drawn to and we will advise."
          />
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((d) => (
              <DestinationCard key={d.slug} destination={d} tall />
            ))}
          </div>
        )}
      </section>
    </>
  );
}