import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { Image } from '@/components/ui/image';

export default function DestinationCard({ destination, tall = false }) {
  return (
    <article className="group relative">
      <Link to={`/destinations/${destination.slug}`} className="block">
        <div className={`w-full overflow-hidden bg-sand ${tall ? 'aspect-[3/4]' : 'aspect-[4/5]'}`}>
          <Image
            src={destination.image}
            alt={`${destination.name}, ${destination.country}`}
            className="h-full w-full transition-transform duration-[900ms] ease-out group-hover:scale-[1.05]"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-forest-deep/85 via-forest-deep/10 to-transparent" />

        <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
          <p className="eyebrow text-gold">{destination.country}</p>
          <h3 className="mt-2 font-heading text-[1.5rem] leading-tight text-paper">{destination.name}</h3>
          <p className="mt-2 line-clamp-2 text-[0.8125rem] leading-relaxed text-paper/75">{destination.tagline}</p>
          <span className="mt-4 inline-flex items-center gap-2 font-body text-[0.625rem] uppercase tracking-[0.18em] text-paper/85 group-hover:text-gold">
            Explore destination <ArrowUpRight size={13} />
          </span>
        </div>
      </Link>
    </article>
  );
}