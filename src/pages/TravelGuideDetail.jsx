import { Link, useParams } from 'react-router-dom';
import { Image } from '@/components/ui/image';
import { findGuide, formatDate, guides } from '@/lib/cms';

export default function TravelGuideDetail() {
  const { slug } = useParams();
  const guide = findGuide(slug);

  if (!guide) {
    return (
      <section className="mx-auto max-w-3xl px-5 py-32 text-center sm:px-8">
        <p className="eyebrow text-gold-bronze">Not found</p>
        <h1 className="mt-4 font-heading text-[2rem] text-forest">That guide is not available</h1>
        <p className="mt-4 text-[0.9375rem] text-ink/65">Browse the travel guides for current articles.</p>
        <Link to="/travel-guides" className="btn-solid mt-8">All travel guides</Link>
      </section>
    );
  }

  const others = guides.filter((g) => g.slug !== guide.slug);

  return (
    <>
      <article>
        <div className="relative min-h-[380px] w-full overflow-hidden bg-forest-deep lg:min-h-[460px]">
          <Image src={guide.image} alt="" className="absolute inset-0 h-full w-full" />
          <div className="absolute inset-0 bg-gradient-to-t from-forest-deep/95 via-forest-deep/60 to-forest-deep/25" />
          <div className="relative mx-auto flex min-h-[380px] max-w-[900px] flex-col justify-end px-5 pb-12 pt-24 sm:px-8 lg:min-h-[460px] lg:pb-16">
            <nav aria-label="Breadcrumb" className="mb-6 font-body text-[0.6875rem] uppercase tracking-[0.16em] text-paper/55">
              <Link to="/travel-guides" className="hover:text-paper">Travel Guides</Link>
              <span className="mx-2">/</span>
              <span className="text-paper/80">{guide.category}</span>
            </nav>
            <h1 className="font-heading text-[2rem] leading-[1.08] text-paper sm:text-[2.8rem]">{guide.title}</h1>
            <p className="mt-4 font-body text-[0.6875rem] uppercase tracking-[0.16em] text-paper/60">
              {formatDate(guide.date)} · {guide.readingTime} · Tuzuru editorial
            </p>
          </div>
        </div>

        <div className="mx-auto max-w-[900px] px-5 py-16 sm:px-8 lg:py-20">
          <p className="border-l-2 border-gold pl-5 font-heading text-[1.25rem] leading-relaxed text-forest">
            {guide.excerpt}
          </p>

          <nav aria-label="On this page" className="mt-10 border-y border-border py-5">
            <p className="font-body text-[0.625rem] uppercase tracking-[0.2em] text-ink/40">On this page</p>
            <ol className="mt-3 space-y-2">
              {guide.content.map((section, i) => (
                <li key={section.heading}>
                  <a
                    href={`#section-${i}`}
                    className="font-body text-[0.875rem] text-forest underline decoration-gold/60 underline-offset-4 hover:text-gold-bronze"
                  >
                    {section.heading}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <div className="prose-editorial mt-10">
            {guide.content.map((section, i) => (
              <section key={section.heading} id={`section-${i}`} className="scroll-mt-24">
                <h2>{section.heading}</h2>
                <p>{section.body}</p>
              </section>
            ))}
          </div>

          <div className="mt-14 border-t border-border pt-8">
            <p className="text-[0.8125rem] leading-relaxed text-ink/50">
              Written for travellers planning a trip with Tuzuru Africa. Seasons and conditions vary — confirm the
              specifics for your dates with our team before booking.
            </p>
            <div className="mt-6 flex flex-wrap gap-4">
              <Link to="/plan-your-trip" className="btn-solid">Plan your trip</Link>
              <Link to="/travel-guides" className="btn-outline">More guides</Link>
            </div>
          </div>
        </div>
      </article>

      <section className="border-t border-border bg-sand/50 py-16">
        <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12">
          <h2 className="font-heading text-[1.5rem] text-forest">More travel guides</h2>
          <div className="mt-8 grid gap-8 md:grid-cols-2">
            {others.map((g) => (
              <Link key={g.slug} to={`/travel-guides/${g.slug}`} className="group grid grid-cols-[110px_1fr] gap-5">
                <div className="aspect-square overflow-hidden bg-sand">
                  <Image src={g.image} alt={g.title} className="h-full w-full transition-transform duration-700 group-hover:scale-105" />
                </div>
                <div>
                  <p className="eyebrow text-gold-bronze">{g.category}</p>
                  <p className="mt-2 font-heading text-[1.15rem] leading-snug text-forest group-hover:text-gold-bronze">
                    {g.title}
                  </p>
                  <p className="mt-1.5 font-body text-[0.6875rem] uppercase tracking-[0.14em] text-ink/40">{g.readingTime}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}