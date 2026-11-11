import { Link } from 'react-router-dom';
import { Image } from '@/components/ui/image';
import { ChevronRight } from 'lucide-react';

export default function PageHero({ image, eyebrow, title, intro, crumbs = [], compact = false }) {
  return (
    <section className="relative">
      <div className={`relative w-full overflow-hidden bg-forest-deep ${compact ? 'min-h-[300px]' : 'min-h-[420px] lg:min-h-[500px]'}`}>
        {image && <Image src={image} alt="" className="absolute inset-0 h-full w-full" />}
        <div className="absolute inset-0 bg-gradient-to-r from-forest-deep/90 via-forest-deep/60 to-forest-deep/25" />
        <div className="relative mx-auto flex max-w-[1400px] flex-col justify-end px-5 pb-12 pt-20 sm:px-8 lg:px-12 lg:pb-16">
          {crumbs.length > 0 && (
            <nav aria-label="Breadcrumb" className="mb-6">
              <ol className="flex flex-wrap items-center gap-2 font-body text-[0.6875rem] uppercase tracking-[0.16em] text-paper/55">
                <li>
                  <Link to="/" className="hover:text-paper">Home</Link>
                </li>
                {crumbs.map((c) => (
                  <li key={c.label} className="flex items-center gap-2">
                    <ChevronRight size={11} aria-hidden="true" />
                    {c.to ? (
                      <Link to={c.to} className="hover:text-paper">{c.label}</Link>
                    ) : (
                      <span className="text-paper/85">{c.label}</span>
                    )}
                  </li>
                ))}
              </ol>
            </nav>
          )}
          {eyebrow && <p className="eyebrow mb-4 text-gold">{eyebrow}</p>}
          <h1 className="max-w-3xl font-heading text-[2.2rem] leading-[1.05] text-paper sm:text-[3rem] lg:text-[3.8rem]">
            {title}
          </h1>
          {intro && <p className="mt-5 max-w-2xl text-[0.9375rem] leading-relaxed text-paper/75 sm:text-[1.0625rem]">{intro}</p>}
        </div>
      </div>
    </section>
  );
}