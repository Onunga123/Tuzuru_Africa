import { Link } from 'react-router-dom';
import SectionHeading from '@/components/common/SectionHeading';
import Reveal from '@/components/common/Reveal';
import TourCard from '@/components/tours/TourCard';
import { tours } from '@/lib/cms';

export default function FeaturedTours() {
  const featured = tours.filter((t) => t.featured).slice(0, 3);

  return (
    <section className="bg-sand/60 py-20 lg:py-28">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <Reveal>
            <SectionHeading
              eyebrow="Tours & packages"
              title="Journeys to start from"
              intro="Each of these can be taken as it stands or reshaped around your dates, your pace and the people travelling with you."
            />
          </Reveal>
          <Reveal delay={0.1}>
            <Link to="/tours" className="link-cta shrink-0">
              Browse all tours
            </Link>
          </Reveal>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((tour, i) => (
            <Reveal key={tour.slug} delay={i * 0.08}>
              <TourCard tour={tour} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}