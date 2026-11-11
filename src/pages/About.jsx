import PageHero from '@/components/common/PageHero';
import Reveal from '@/components/common/Reveal';
import SectionHeading from '@/components/common/SectionHeading';
import { Image } from '@/components/ui/image';
import { IMAGES, site, whyTuzuru } from '@/lib/cms';
import { Link } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';

export default function About() {
  return (
    <>
      <PageHero
        crumbs={[{ label: 'About' }]}
        eyebrow="Who we are"
        title="A travel platform built around the places, not the packages."
        intro="Tuzuru Africa plans journeys across East and Southern Africa — wildlife, coastlines, culture and open country — with specialists who know the ground."
        image={IMAGES.mara}
      />

      <section className="mx-auto max-w-[1400px] px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
        <div className="grid gap-14 lg:grid-cols-[1fr_0.85fr] lg:gap-20">
          <Reveal>
            <div>
              <p className="eyebrow mb-5 text-gold-bronze">Introduction</p>
              <h2 className="font-heading text-[1.9rem] leading-[1.15] text-forest sm:text-[2.4rem]">
                We start with a conversation, not a catalogue.
              </h2>
              <div className="prose-editorial mt-7">
                <p>
                  Most travel websites begin with a list of packages. We begin with questions: when can you travel,
                  how far do you want to move, and what would make the trip worth it for you? The itinerary comes
                  after that, and it usually looks different for every traveller.
                </p>
                <p>
                  Our work sits between you and the people who run the places you will visit — guides, camps, lodge
                  owners, host families and drivers. Getting those relationships right is what makes a trip feel
                  effortless on the ground.
                </p>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="aspect-[4/5] w-full overflow-hidden bg-sand">
              <Image
                src={IMAGES.craft}
                alt="Detail of hand-woven basket fibre in natural and ochre tones"
                className="h-full w-full"
              />
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-sand/60 py-20 lg:py-28">
        <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12">
          <Reveal>
            <SectionHeading
              eyebrow="Mission, vision, values"
              title="What we are trying to do"
              intro="Three statements we can actually stand behind, and the principles that follow from them."
            />
          </Reveal>

          <div className="mt-14 grid gap-10 md:grid-cols-3">
            {[
              {
                title: 'Mission',
                body: 'To make travelling in Africa feel considered rather than rushed — well planned, honestly described, and shaped around the people who live in the places visited.',
              },
              {
                title: 'Vision',
                body: 'A travel business where the value stays close to the ground: local guides employed, communities paid directly, and visitors who leave knowing more than they arrived with.',
              },
              {
                title: 'Values',
                body: 'Accuracy over salesmanship. Patience over pressure. Care for the places and wildlife that make this work possible, and respect for the people who host it.',
              },
            ].map((item, i) => (
              <Reveal key={item.title} delay={i * 0.08}>
                <div className="border-t border-border pt-6">
                  <p className="eyebrow text-gold-bronze">{item.title}</p>
                  <p className="mt-4 text-[0.9375rem] leading-relaxed text-ink/75">{item.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
        <div className="grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <Reveal>
            <SectionHeading
              eyebrow="What we do"
              title="The work behind the itinerary"
              intro="Planning, guiding, accommodation and support — handled by one team so nothing falls between suppliers."
            />
            <div className="mt-8 border-l-2 border-gold bg-paper px-5 py-4">
              <p className="flex items-start gap-3 text-[0.8125rem] leading-relaxed text-ink/70">
                <ShieldCheck size={16} className="mt-0.5 shrink-0 text-forest" aria-hidden="true" />
                {site.draftNotice}
              </p>
            </div>
          </Reveal>

          <div>
            {whyTuzuru.map((item, i) => (
              <Reveal key={item.title} delay={i * 0.05}>
                <div className="border-t border-border py-6">
                  <h3 className="font-heading text-[1.2rem] text-forest">{item.title}</h3>
                  <p className="mt-2 text-[0.9375rem] leading-relaxed text-ink/70">{item.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-forest py-20 text-paper lg:py-24">
        <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12">
          <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
            <Reveal>
              <p className="eyebrow mb-5 text-gold">Travel philosophy</p>
              <h2 className="max-w-2xl font-heading text-[1.9rem] leading-[1.1] text-paper sm:text-[2.5rem]">
                Fewer places, longer stays, better days.
              </h2>
              <p className="mt-6 max-w-xl text-[0.9375rem] leading-relaxed text-paper/70">
                Big itineraries photograph well and travel badly. We would rather give you three regions properly
                than six in a blur — more time in one place usually means better sightings, quieter encounters and
                a guide who has time to explain what you are looking at.
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="flex flex-col gap-4">
                <Link to="/tours" className="btn-solid !bg-gold !text-forest-deep hover:!bg-gold-light">
                  Explore our tours
                </Link>
                <Link to="/plan-your-trip" className="btn-ghost-light">
                  Plan your trip
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}