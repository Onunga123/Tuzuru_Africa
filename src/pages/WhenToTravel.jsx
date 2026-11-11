import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PageHero from '@/components/common/PageHero';
import SectionHeading from '@/components/common/SectionHeading';
import Reveal from '@/components/common/Reveal';
import SeasonCard from '@/components/seasons/SeasonCard';
import {
  IMAGES,
  getTravelSeasons,
  seasonCalendar as CALENDAR,
  seasonRelatedLinks as CALENDAR_LINKS,
} from '@/lib/cms';

export default function WhenToTravel() {
  const [seasons, setSeasons] = useState(null);

  useEffect(() => {
    let active = true;
    getTravelSeasons()
      .then((records) => {
        if (active) setSeasons(records);
      })
      .catch(() => {
        if (active) setSeasons([]);
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <>
      <PageHero
        image={IMAGES.seasons}
        eyebrow="When to travel"
        title="When to travel in Africa: a season-by-season guide"
        intro="Timing shapes a safari more than almost any other decision. Here is how the rains, the dry months and the wildlife calendar line up across East and Southern Africa."
        crumbs={[{ label: 'When to travel' }]}
      />

      <section className="mx-auto max-w-[1100px] px-5 py-16 sm:px-8 lg:py-24">
        <div className="prose-editorial max-w-3xl">
          <p>
            Africa is a continent, not a single climate, so there is no one best month to visit. What matters is
            matching your dates to the place and the wildlife you most want to see. Broadly speaking, East Africa —
            Kenya and Tanzania — runs on two rainy periods: the long rains of roughly March to May and the short rains
            of November, with long dry spells either side. Southern Africa inverts the pattern, with a dry winter from
            about June to October that concentrates game around water, and a green, wetter summer from November.
          </p>
          <p>
            The dry season is the classic safari window: thin vegetation, animals gathered at rivers, and reliable
            sunshine. It is also the busiest and most expensive. The green season brings dramatic skies, newborn
            animals, migratory birds and significantly lower rates, at the cost of some afternoon rain and a few camps
            closing for maintenance. Neither is better in the abstract — they simply suit different trips.
          </p>
          <p>
            Because conditions shift year to year, we plan by region rather than by a fixed calendar. A trip that
            combines the Mara with Zanzibar, for example, can be timed so the wildlife comes first in the dry months and
            the coast follows after the rains have passed.
          </p>
        </div>
      </section>

      <section className="border-t border-border bg-sand/40">
        <div className="mx-auto max-w-[1100px] px-5 py-16 sm:px-8 lg:py-24">
          <Reveal>
            <SectionHeading
              eyebrow="The four travel windows"
              title="What each season actually looks like"
              intro="The trade-offs between wildlife, weather, crowds and cost — the same four windows our itineraries are built around."
            />
          </Reveal>

          <div className="mt-12 space-y-10">
            {seasons === null &&
              [0, 1, 2].map((i) => (
                <div key={i} className="grid animate-pulse gap-6 border-t border-border pt-8 sm:grid-cols-2 sm:gap-10">
                  <div className="space-y-3">
                    <div className="h-2 w-24 bg-ink/10" />
                    <div className="h-6 w-2/3 bg-ink/10" />
                    <div className="h-3 w-full bg-ink/10" />
                    <div className="h-3 w-5/6 bg-ink/10" />
                  </div>
                  <div className="aspect-[4/3] w-full bg-ink/5" />
                </div>
              ))}

            {seasons?.map((season, i) => (
              <Reveal key={season.id || season.name} delay={i * 0.05}>
                <SeasonCard season={season} index={i} />
              </Reveal>
            ))}

            {seasons?.length === 0 && (
              <p className="border-t border-border pt-8 text-[0.9375rem] text-ink/60">
                Our seasonal notes are being updated. Ask us for current conditions and we will advise on the best
                window for your dates.
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1100px] px-5 py-16 sm:px-8 lg:py-24">
        <Reveal>
          <SectionHeading
            eyebrow="The calendar"
            title="What happens when, across the year"
            intro="Four moments travellers most often plan around — useful when your dates are fixed and you want to know what is possible."
          />
        </Reveal>

        <dl className="mt-12 divide-y divide-border border-y border-border">
          {CALENDAR.map((item) => (
            <div key={item.event} className="grid gap-2 py-6 sm:grid-cols-[200px_1fr] sm:gap-8">
              <dt className="font-body text-[0.7rem] uppercase tracking-[0.18em] text-gold-bronze">{item.months}</dt>
              <dd>
                <p className="font-heading text-[1.15rem] text-forest">{item.event}</p>
                <p className="mt-1.5 text-[0.9375rem] leading-relaxed text-ink/70">{item.detail}</p>
              </dd>
            </div>
          ))}
        </dl>

        <div className="mt-14 flex flex-col gap-5 border-t border-border pt-10 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-xl text-[0.9375rem] leading-relaxed text-ink/70">
            Send us your dates and we will tell you honestly what each region will be like — and whether shifting a
            week or two would give you a better trip.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link to="/plan-your-trip" className="btn-solid">Plan your trip</Link>
            <Link to="/tours" className="btn-outline">Browse tours</Link>
          </div>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          {CALENDAR_LINKS.map((link) => (
            <Link key={link.to} to={link.to} className="group border-t border-border pt-4">
              <span className="font-heading text-[1.05rem] text-forest group-hover:text-gold-bronze">{link.label}</span>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}