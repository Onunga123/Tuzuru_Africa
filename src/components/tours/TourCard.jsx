import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Image } from '@/components/ui/image';

export default function TourCard({ tour }) {
  return (
    <article className="group flex h-full flex-col">
      <Link to={`/tours/${tour.slug}`} className="relative block overflow-hidden">
        <div className="aspect-[4/3] w-full overflow-hidden bg-sand">
          <Image
            src={tour.image}
            alt={tour.title}
            className="h-full w-full transition-transform duration-[900ms] ease-out group-hover:scale-[1.04]"
          />
        </div>
        <span className="absolute left-0 top-0 bg-paper/95 px-3 py-1.5 font-body text-[0.625rem] uppercase tracking-[0.2em] text-forest">
          {tour.duration}
        </span>
      </Link>

      <div className="flex flex-1 flex-col pt-5">
        <p className="eyebrow text-gold-bronze">{tour.destination}</p>
        <h3 className="mt-3 font-heading text-[1.4rem] leading-snug text-forest">
          <Link to={`/tours/${tour.slug}`} className="hover:text-gold-bronze">
            {tour.title}
          </Link>
        </h3>
        <p className="mt-3 flex-1 text-[0.9375rem] leading-relaxed text-ink/70">{tour.overview}</p>

        <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
          <span className="font-body text-[0.6875rem] uppercase tracking-[0.16em] text-ink/50">
            Price on request
          </span>
          <Link
            to={`/tours/${tour.slug}`}
            className="inline-flex items-center gap-2 font-body text-[0.6875rem] uppercase tracking-[0.16em] text-forest hover:text-gold-bronze"
          >
            View details <ArrowRight size={13} />
          </Link>
        </div>
      </div>
    </article>
  );
}