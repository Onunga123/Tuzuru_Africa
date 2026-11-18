import { useState } from 'react';
import PageHero from '@/components/common/PageHero';
import GalleryGrid from '@/components/gallery/GalleryGrid';
import { gallery, IMAGES } from '@/lib/cms';

export default function Gallery() {
  const [category, setCategory] = useState('All');

  const categories = ['All', ...Array.from(new Set(gallery.map((g) => g.category)))];
  const items = category === 'All' ? gallery : gallery.filter((g) => g.category === category);

  return (
    <>
      <PageHero
        eyebrow="Gallery"
        title="The places, in pictures"
        intro="A visual journey through the wildlife, coastlines, landscapes and cultures of East and Southern Africa."
        image={IMAGES.gorilla}
        compact
      />

      <section className="border-b border-border bg-sand/50">
        <div className="mx-auto flex max-w-[1400px] flex-wrap gap-2 px-5 py-6 sm:px-8 lg:px-12">
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
              <span className="ml-2 text-[0.625rem] tabular-nums opacity-60">
                {c === 'All' ? gallery.length : gallery.filter((g) => g.category === c).length}
              </span>
            </button>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-5 py-14 sm:px-8 lg:px-12 lg:py-20">
        <GalleryGrid items={items} />
      </section>
    </>
  );
}
