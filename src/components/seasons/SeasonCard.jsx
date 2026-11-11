import { Image } from '@/components/ui/image';

export default function SeasonCard({ season, index }) {
  return (
    <article className="grid gap-6 border-t border-border pt-8 sm:grid-cols-[0.9fr_1.1fr] sm:gap-10">
      <div>
        <div className="flex items-baseline gap-3">
          <span className="font-body text-[0.6rem] tracking-[0.25em] text-ink/35">
            {String(index + 1).padStart(2, '0')}
          </span>
          <p className="eyebrow text-gold-bronze">{season.months}</p>
        </div>
        <h3 className="mt-3 font-heading text-[1.6rem] leading-tight text-forest">{season.name}</h3>
        <p className="mt-3 text-[0.9375rem] leading-relaxed text-ink/70">{season.description}</p>

        <dl className="mt-5 space-y-2 border-l border-gold/50 pl-4 text-[0.8125rem] text-ink/65">
          {season.highlights && (
            <div>
              <dt className="font-body text-[0.625rem] uppercase tracking-[0.18em] text-ink/45">Wildlife</dt>
              <dd>{season.highlights}</dd>
            </div>
          )}
          {season.weather && (
            <div>
              <dt className="font-body text-[0.625rem] uppercase tracking-[0.18em] text-ink/45">Conditions</dt>
              <dd>{season.weather}</dd>
            </div>
          )}
          {season.best_for && (
            <div>
              <dt className="font-body text-[0.625rem] uppercase tracking-[0.18em] text-ink/45">Best for</dt>
              <dd>{season.best_for}</dd>
            </div>
          )}
        </dl>

        <div className="mt-5 flex flex-wrap gap-2">
          {season.price_band && (
            <span className="border border-forest/25 px-2.5 py-1 font-body text-[0.625rem] uppercase tracking-[0.16em] text-forest">
              {season.price_band}
            </span>
          )}
          {season.crowd_level && (
            <span className="border border-border px-2.5 py-1 font-body text-[0.625rem] uppercase tracking-[0.16em] text-ink/55">
              {season.crowd_level} crowds
            </span>
          )}
        </div>
      </div>

      {season.image && (
        <div className="aspect-[4/3] w-full overflow-hidden bg-sand">
          <Image src={season.image} alt={`${season.name} in Africa`} className="h-full w-full" />
        </div>
      )}
    </article>
  );
}