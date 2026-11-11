import { Link } from 'react-router-dom';
import { Image } from '@/components/ui/image';
import Reveal from '@/components/common/Reveal';
import { experiences } from '@/lib/cms';

export default function ExperienceCategories() {
  return (
    <section className="bg-forest py-20 text-paper lg:py-28">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <Reveal>
            <div className="max-w-2xl">
              <p className="eyebrow mb-5 text-gold">Ways to travel</p>
              <h2 className="font-heading text-[2rem] leading-[1.12] text-paper sm:text-[2.6rem] lg:text-[3.1rem]">
                Choose the kind of days you want
              </h2>
              <p className="mt-5 max-w-lg text-[1rem] leading-relaxed text-paper/70">
                Most trips combine two or three of these. Tell us which matter and we will build the route around
                them.
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <Link to="/experiences" className="link-cta shrink-0 !text-gold !border-gold/60 hover:!text-paper hover:!border-paper">
              All experiences
            </Link>
          </Reveal>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {experiences.map((exp, i) => (
            <Reveal key={exp.slug} delay={i * 0.06}>
              <Link to={`/experiences#${exp.slug}`} className="group block">
                <div className="aspect-[3/2] w-full overflow-hidden bg-forest-deep">
                  <Image
                    src={exp.image}
                    alt={exp.name}
                    className="h-full w-full opacity-90 transition-all duration-[900ms] group-hover:scale-[1.04] group-hover:opacity-100"
                  />
                </div>
                <h3 className="mt-5 font-heading text-[1.3rem] text-paper group-hover:text-gold">{exp.name}</h3>
                <p className="mt-2 text-[0.875rem] leading-relaxed text-paper/60">{exp.blurb}</p>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}