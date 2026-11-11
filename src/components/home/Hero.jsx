import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Image } from '@/components/ui/image';
import { site, discoveryPaths, homepage, getImage } from '@/lib/cms';
import { Plane, BedDouble, Camera, MapPin } from 'lucide-react';

const ICONS = { Plane, BedDouble, Camera, MapPin };

export default function Hero() {
  const hero = homepage.hero;
  const heroImage = getImage(hero.imageKey);

  return (
    <section className="relative">
      <div className="relative min-h-[600px] w-full overflow-hidden lg:min-h-[760px]">
        <motion.div
          initial={{ scale: 1.08 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0"
        >
          <Image
            src={heroImage?.src}
            alt={heroImage?.alt || ''}
            className="h-full w-full"
            fittingType="fill"
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-r from-forest-deep/85 via-forest-deep/45 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-forest-deep/70 via-transparent to-forest-deep/25" />

        <div className="relative mx-auto flex min-h-[600px] max-w-[1400px] flex-col justify-end px-5 pb-16 pt-28 sm:px-8 lg:min-h-[760px] lg:px-12 lg:pb-24">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-3xl"
          >
            <p className="eyebrow text-gold">{hero.eyebrow}</p>
            <h1 className="mt-6 font-heading text-[2.6rem] leading-[1.02] text-paper sm:text-[4rem] lg:text-[5.2rem]">
              {hero.headline}
              <br />
              <span className="italic text-gold-light">{hero.headlineAccent}</span>
            </h1>
            <p className="mt-7 max-w-xl text-[1rem] leading-relaxed text-paper/80 sm:text-[1.0625rem]">
              {hero.intro}
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link to={hero.primaryCta.to} className="btn-solid">
                {hero.primaryCta.label}
              </Link>
              <Link to={hero.secondaryCta.to} className="btn-ghost-light">
                {hero.secondaryCta.label}
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Travel · Stay · Explore · Experience */}
      <div className="relative z-10 bg-forest">
        <div className="mx-auto grid max-w-[1400px] grid-cols-2 divide-paper/15 px-5 sm:px-8 lg:grid-cols-4 lg:divide-x lg:px-12">
          {discoveryPaths.map((path) => {
            const Icon = ICONS[path.icon] ?? MapPin;
            return (
              <Link
                key={path.key}
                to={path.to}
                className="group flex items-start gap-4 border-b border-paper/15 px-0 py-6 lg:border-b-0 lg:px-7 lg:py-8 lg:first:pl-0"
              >
                <Icon size={20} className="mt-1 shrink-0 text-gold transition-transform duration-300 group-hover:-translate-y-0.5" />
                <span>
                  <span className="block font-body text-[0.7rem] uppercase tracking-[0.22em] text-paper">{path.label}</span>
                  <span className="mt-1.5 block text-[0.8125rem] leading-snug text-paper/55">{path.blurb}</span>
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      <p className="sr-only">{site.tagline}</p>
    </section>
  );
}