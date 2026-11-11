import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Image } from '@/components/ui/image';
import PageHero from '@/components/common/PageHero';
import Reveal from '@/components/common/Reveal';
import { formatDate, guides, IMAGES } from '@/lib/cms';

export default function TravelGuides() {
  const [category, setCategory] = useState('All');
  const featured = guides[0];
  const categories = ['All', ...Array.from(new Set(guides.map((g) => g.category)))];
  const list = guides.filter((g) => (category === 'All' ? true : g.category === category));

  return (
    <>
      <PageHero
        crumbs={[{ label: 'Travel Guides' }]}
        eyebrow="Travel guides"
        title="Notes from the ground"
        intro="Practical writing on seasons, regions and how travel in these places actually works — written to be useful before you book."
        image={IMAGES.seasons}
        compact
      />

      <section className="mx-auto max-w-[1400px] px-5 py-16 sm:px-8 lg:px-12 lg:py-20">
        <Reveal>
          <Link to={`/travel-guides/${featured.slug}`} className="group grid gap-8 border-b border-border pb-14 lg:grid-cols-2 lg:gap-14">
            <div className="aspect-[3/2] w-full overflow-hidden bg-sand">
              <Image
                src={featured.image}
                alt={featured.title}
                className="h-full w-full transition-transform duration-[900ms] group-hover:scale-[1.03]"
              />
            </div>
            <div className="flex flex-col justify-center">
              <p className="eyebrow text-gold-bronze">Featured · {featured.category}</p>
              <h2 className="mt-4 font-heading text-[1.9rem] leading-tight text-forest group-hover:text-gold-bronze sm:text-[2.4rem]">
                {featured.title}
              </h2>
              <p className="mt-4 text-[0.9375rem] leading-relaxed text-ink/70">{featured.excerpt}</p>
              <p className="mt-5 font-body text-[0.6875rem] uppercase tracking-[0.16em] text-ink/40">
                {formatDate(featured.date)} · {featured.readingTime}
              </p>
              <span className="link-cta mt-7 self-start">Read the guide</span>
            </div>
          </Link>
        </Reveal>

        <div className="mt-10 flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCategory(c)}
              aria-pressed={category === c}
              className={`border px-4 py-2.5 font-body text-[0.6875rem] uppercase tracking-[0.14em] transition-colors ${
                category === c ? 'border-forest bg-forest text-paper' : 'border-border text-ink/60 hover:border-forest/40'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="mt-10 grid gap-x-10 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
          {list.map((guide, i) => (
            <Reveal key={guide.slug} delay={i * 0.06}>
              <article className="group">
                <Link to={`/travel-guides/${guide.slug}`}>
                  <div className="aspect-[3/2] w-full overflow-hidden bg-sand">
                    <Image
                      src={guide.image}
                      alt={guide.title}
                      className="h-full w-full transition-transform duration-[900ms] group-hover:scale-[1.04]"
                    />
                  </div>
                  <p className="mt-5 eyebrow text-gold-bronze">{guide.category}</p>
                  <h3 className="mt-3 font-heading text-[1.3rem] leading-snug text-forest group-hover:text-gold-bronze">
                    {guide.title}
                  </h3>
                  <p className="mt-2 text-[0.9375rem] leading-relaxed text-ink/70">{guide.excerpt}</p>
                  <p className="mt-4 font-body text-[0.6875rem] uppercase tracking-[0.16em] text-ink/40">
                    {formatDate(guide.date)} · {guide.readingTime}
                  </p>
                </Link>
              </article>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}