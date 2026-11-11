import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Image } from '@/components/ui/image';
import { IMAGES } from '@/lib/cms';

export default function NotFound() {
  useEffect(() => {
    const meta = document.createElement('meta');
    meta.name = 'prerender-status-code';
    meta.content = '404';
    document.head.appendChild(meta);
    return () => {
      document.head.removeChild(meta);
    };
  }, []);

  return (
    <section className="relative">
      <div className="relative min-h-[440px] w-full overflow-hidden bg-forest-deep">
        <Image src={IMAGES.serengeti} alt="" className="absolute inset-0 h-full w-full opacity-40" />
        <div className="absolute inset-0 bg-forest-deep/70" />
        <div className="relative mx-auto max-w-[820px] px-5 py-24 text-center sm:px-8">
          <p className="eyebrow text-gold">404 · Page not found</p>
          <h1 className="mt-5 font-heading text-[2.2rem] leading-[1.1] text-paper sm:text-[3rem]">
            This path leads nowhere.
          </h1>
          <p className="mx-auto mt-5 max-w-lg text-[0.9375rem] leading-relaxed text-paper/75">
            The page may have moved or the link may be out of date. Everything below will get you back on the trail.
          </p>

          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <Link to="/" className="btn-solid !bg-gold !text-forest-deep hover:!bg-gold-light">
              Back to homepage
            </Link>
            <Link to="/tours" className="btn-ghost-light">Browse tours</Link>
            <Link to="/destinations" className="btn-ghost-light">Destinations</Link>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1000px] px-5 py-16 sm:px-8">
        <p className="eyebrow mb-6 text-gold-bronze">Popular starting points</p>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: 'All tours & packages', to: '/tours' },
            { label: 'Experiences', to: '/experiences' },
            { label: 'Travel guides', to: '/travel-guides' },
            { label: 'Plan your trip', to: '/plan-your-trip' },
          ].map((link) => (
            <Link key={link.to} to={link.to} className="group border-t border-border pt-4">
              <span className="font-heading text-[1.05rem] text-forest group-hover:text-gold-bronze">{link.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}