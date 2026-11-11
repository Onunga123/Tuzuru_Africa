import { Link } from 'react-router-dom';
import SectionHeading from '@/components/common/SectionHeading';
import Reveal from '@/components/common/Reveal';
import DestinationCard from '@/components/destinations/DestinationCard';
import { destinations } from '@/lib/cms';

export default function FeaturedDestinations() {
  const featured = destinations.slice(0, 4);

  return (
    <section className="mx-auto max-w-[1400px] px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
      <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <Reveal>
          <SectionHeading
            eyebrow="Where to go"
            title="Places worth the journey"
            intro="The regions we plan around most often — chosen for the wildlife, the landscape and the kind of days they make possible."
          />
        </Reveal>
        <Reveal delay={0.1}>
          <Link to="/destinations" className="link-cta shrink-0">
            All destinations
          </Link>
        </Reveal>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {featured.map((destination, i) => (
          <Reveal key={destination.slug} delay={i * 0.07}>
            <DestinationCard destination={destination} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}