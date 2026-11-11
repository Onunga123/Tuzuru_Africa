import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowLeft, X } from 'lucide-react';
import { Image } from '@/components/ui/image';

export default function GalleryGrid({ items }) {
  const [index, setIndex] = useState(null);
  const active = index === null ? null : items[index];

  useEffect(() => {
    if (index === null) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') setIndex(null);
      if (e.key === 'ArrowRight') setIndex((i) => (i + 1) % items.length);
      if (e.key === 'ArrowLeft') setIndex((i) => (i - 1 + items.length) % items.length);
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [index, items.length]);

  if (!items.length) {
    return (
      <p className="border border-dashed border-border px-6 py-16 text-center text-[0.9375rem] text-ink/60">
        No images match that filter yet. Try another category or destination.
      </p>
    );
  }

  return (
    <>
      <div className="columns-1 gap-5 sm:columns-2 lg:columns-3 [&>*]:mb-5">
        {items.map((item, i) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setIndex(i)}
            className="group block w-full break-inside-avoid text-left"
            aria-label={`Open image: ${item.caption}`}
          >
            <div className="overflow-hidden bg-sand">
              <Image
                src={item.image}
                alt={item.caption}
                className="h-full w-full transition-transform duration-[900ms] group-hover:scale-[1.04]"
              />
            </div>
            <div className="flex items-start justify-between gap-4 pt-3">
              <p className="text-[0.8125rem] leading-snug text-ink/70">{item.caption}</p>
              <span className="shrink-0 font-body text-[0.5625rem] uppercase tracking-[0.16em] text-ink/35">
                {item.destination}
              </span>
            </div>
          </button>
        ))}
      </div>

      {active && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={active.caption}
          className="fixed inset-0 z-[100] flex flex-col bg-forest-deep/97 p-4 sm:p-8"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIndex(null);
          }}
        >
          <div className="flex items-center justify-between">
            <p className="font-body text-[0.6875rem] uppercase tracking-[0.2em] text-paper/60">
              {index + 1} / {items.length} · {active.destination}
            </p>
            <button
              type="button"
              onClick={() => setIndex(null)}
              className="flex h-10 w-10 items-center justify-center border border-paper/30 text-paper hover:bg-paper/10"
              aria-label="Close image"
            >
              <X size={18} />
            </button>
          </div>

          <div className="flex flex-1 items-center justify-center py-4">
            <div className="relative h-[58vh] w-full max-w-5xl sm:h-[64vh]">
              <Image src={active.image} alt={active.caption} className="h-full w-full" fittingType="fit" />
            </div>
          </div>

          <div className="flex items-center justify-between gap-6">
            <button
              type="button"
              onClick={() => setIndex((i) => (i - 1 + items.length) % items.length)}
              className="inline-flex items-center gap-2 font-body text-[0.6875rem] uppercase tracking-[0.18em] text-paper/80 hover:text-paper"
            >
              <ArrowLeft size={14} /> Previous
            </button>
            <div className="hidden text-center sm:block">
              <p className="text-[0.8125rem] text-paper/70">{active.caption}</p>
              {active.credit && (
                <p className="mt-1 font-body text-[0.5625rem] uppercase tracking-[0.16em] text-paper/40">
                  {active.credit}
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={() => setIndex((i) => (i + 1) % items.length)}
              className="inline-flex items-center gap-2 font-body text-[0.6875rem] uppercase tracking-[0.18em] text-paper/80 hover:text-paper"
            >
              Next <ArrowRight size={14} />
            </button>
          </div>
        </div>
      )}

      <div className="mt-12 text-center">
        <Link to="/plan-your-trip" className="btn-outline">
          Plan a trip
        </Link>
      </div>
    </>
  );
}