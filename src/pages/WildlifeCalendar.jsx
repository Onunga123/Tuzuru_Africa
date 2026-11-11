import { Link } from 'react-router-dom';
import { Image } from '@/components/ui/image';
import PageHero from '@/components/common/PageHero';
import SectionHeading from '@/components/common/SectionHeading';
import Reveal from '@/components/common/Reveal';
import { WILDLIFE_CALENDAR } from '@/lib/cms';
import { IMAGES } from '@/lib/cms';

export default function WildlifeCalendar() {
  return (
    <>
      <PageHero
        image={IMAGES.migration}
        eyebrow="Wildlife calendar"
        title="Where and when to see Africa's wildlife"
        intro="A month-by-month view of the continent's most sought-after wildlife experiences — from the migration to gorillas, whales and nesting turtles."
        crumbs={[{ label: 'Wildlife calendar' }]}
      />

      <section className="mx-auto max-w-[1100px] px-5 py-16 sm:px-8 lg:py-24">
        <div className="prose-editorial max-w-3xl">
          <p>
            Africa's wildlife does not run to a fixed timetable, but it does follow the rain. Where water and grazing
            are scarce, animals concentrate around rivers and pans, which is why the dry months make game easier to
            find. Where rain has fallen, herds spread out across the plains and the bush thickens — harder to see into,
            but greener, quieter and full of newborn animals.
          </p>
          <p>
            That single pattern explains most of the timing decisions in a safari itinerary. In East Africa, the
            wildebeest herds move between the southern Serengeti calving grounds early in the year and the Mara River
            crossings in the second half. In Southern Africa, the dry winter from June to October pulls elephants,
            buffalo and predators towards permanent water. On the coast, the pattern shifts again: whales pass the Cape
            in the southern spring, and turtles nest on East African beaches during the warm, wet months.
          </p>
          <p>
            Below is how those windows line up for the wildlife most travellers ask about. Treat the months as reliable
            guidance rather than a guarantee — local conditions vary year to year, and the best guides plan around what
            has actually happened this season, not what happened last year.
          </p>
        </div>
      </section>

      <section className="border-t border-border bg-sand/40">
        <div className="mx-auto max-w-[1100px] px-5 py-16 sm:px-8 lg:py-24">
          <Reveal>
            <SectionHeading
              eyebrow="Wildlife windows"
              title="Eight experiences worth timing a trip around"
              intro="Species, the regions where they are most reliably seen, and the months that give you the best chance."
            />
          </Reveal>

          <div className="mt-12 space-y-10">
            {WILDLIFE_CALENDAR.map((entry, i) => (
              <Reveal key={entry.species} delay={i * 0.04}>
                <article className="grid gap-6 border-t border-border pt-8 sm:grid-cols-[0.35fr_1fr] sm:gap-10">
                  {entry.image && (
                    <div className="aspect-[4/3] w-full overflow-hidden bg-sand">
                      <Image src={entry.image} alt={entry.species} className="h-full w-full" />
                    </div>
                  )}
                  <div>
                    <h3 className="font-heading text-[1.5rem] leading-tight text-forest">{entry.species}</h3>
                    <dl className="mt-4 space-y-3 text-[0.9375rem] leading-relaxed">
                      <div>
                        <dt className="font-body text-[0.625rem] uppercase tracking-[0.18em] text-ink/45">Where</dt>
                        <dd className="text-ink/75">{entry.where}</dd>
                      </div>
                      <div>
                        <dt className="font-body text-[0.625rem] uppercase tracking-[0.18em] text-ink/45">Best months</dt>
                        <dd className="text-ink/75">{entry.when}</dd>
                      </div>
                      <div>
                        <dt className="font-body text-[0.625rem] uppercase tracking-[0.18em] text-ink/45">Worth knowing</dt>
                        <dd className="text-ink/60">{entry.note}</dd>
                      </div>
                    </dl>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1100px] px-5 py-16 sm:px-8 lg:py-24">
        <div className="flex flex-col gap-5 border-t border-border pt-10 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-xl text-[0.9375rem] leading-relaxed text-ink/70">
            If a particular sighting matters most to you, tell us and we will build the itinerary and the dates around
            it — including the regions where the odds are best.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link to="/plan-your-trip" className="btn-solid">Plan your trip</Link>
            <Link to="/when-to-travel" className="btn-outline">Season-by-season guide</Link>
          </div>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          {[
            { label: 'Tours & packages', to: '/tours' },
            { label: 'Destinations', to: '/destinations' },
            { label: 'Travel guides', to: '/travel-guides' },
          ].map((link) => (
            <Link key={link.to} to={link.to} className="group border-t border-border pt-4">
              <span className="font-heading text-[1.05rem] text-forest group-hover:text-gold-bronze">{link.label}</span>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}