import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { destinations, experiences, tourDurationFilters } from '@/lib/cms';

/** @typedef {{ query: string, destination: string, experience: string, duration: string }} TourFiltersState */
/** @type {TourFiltersState} */
export const defaultFilters = { query: '', destination: 'any', experience: 'any', duration: 'any' };

/**
 * @param {import('../../lib/cms/types').Tour[]} tours
 * @param {TourFiltersState} filters
 * @returns {import('../../lib/cms/types').Tour[]}
 */
export function filterTours(tours, filters) {
  const q = filters.query.trim().toLowerCase();
  return tours.filter((tour) => {
    if (q) {
      const haystack = [tour.title, tour.destination, tour.overview, ...(tour.highlights || [])]
        .join(' ')
        .toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    if (filters.destination !== 'any' && tour.destinationSlug !== filters.destination) return false;
    if (filters.experience !== 'any' && !(tour.experiences || []).includes(filters.experience)) return false;
    if (filters.duration === 'short' && tour.days > 4) return false;
    if (filters.duration === 'medium' && (tour.days < 5 || tour.days > 7)) return false;
    if (filters.duration === 'long' && tour.days < 8) return false;
    return true;
  });
}

export default function TourFilters({ filters, setFilters }) {
  const [search, setSearch] = useState(filters.query);
  const destinationOptions = useMemo(() => destinations.map((d) => ({ value: d.slug, label: d.name })), []);
  const experienceOptions = useMemo(() => experiences.map((e) => ({ value: e.name, label: e.name })), []);

  const update = (patch) => setFilters({ ...filters, ...patch });

  const submitSearch = (e) => {
    e.preventDefault();
    update({ query: search });
  };

  const selectClass =
    'w-full appearance-none border border-border bg-paper px-4 py-3 font-body text-[0.8125rem] text-ink focus:border-forest focus:outline-none';

  return (
    <div className="border-y border-border bg-sand/50 py-6">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12">
        <form onSubmit={submitSearch} className="grid gap-3 lg:grid-cols-[1.4fr_1fr_1fr_1fr_auto]">
          <label className="relative block">
            <span className="sr-only">Search tours</span>
            <Search size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink/40" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search tours, parks, experiences"
              className="w-full border border-border bg-paper py-3 pl-11 pr-4 font-body text-[0.8125rem] text-ink placeholder:text-ink/40 focus:border-forest focus:outline-none"
            />
          </label>

          <label>
            <span className="sr-only">Destination</span>
            <select
              value={filters.destination}
              onChange={(e) => update({ destination: e.target.value })}
              className={selectClass}
            >
              <option value="any">Any destination</option>
              {destinationOptions.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </label>

          <label>
            <span className="sr-only">Experience</span>
            <select
              value={filters.experience}
              onChange={(e) => update({ experience: e.target.value })}
              className={selectClass}
            >
              <option value="any">Any experience</option>
              {experienceOptions.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </label>

          <label>
            <span className="sr-only">Duration</span>
            <select
              value={filters.duration}
              onChange={(e) => update({ duration: e.target.value })}
              className={selectClass}
            >
              {tourDurationFilters.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </label>

          <button type="submit" className="btn-solid w-full lg:w-auto">
            Search
          </button>
        </form>

        {(filters.query || filters.destination !== 'any' || filters.experience !== 'any' || filters.duration !== 'any') && (
          <button
            type="button"
            onClick={() => {
              setSearch('');
              setFilters(defaultFilters);
            }}
            className="mt-4 font-body text-[0.6875rem] uppercase tracking-[0.16em] text-forest underline decoration-gold underline-offset-4"
          >
            Clear all filters
          </button>
        )}
      </div>
    </div>
  );
}
