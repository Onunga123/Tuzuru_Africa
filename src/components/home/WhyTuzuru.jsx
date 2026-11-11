import { Image } from '@/components/ui/image';
import Reveal from '@/components/common/Reveal';
import SectionHeading from '@/components/common/SectionHeading';
import { IMAGES, whyTuzuru } from '@/lib/cms';
import { Map, Compass, HeartHandshake, BedDouble, LifeBuoy } from 'lucide-react';

const ICONS = { Map, Compass, HeartHandshake, BedDouble, LifeBuoy };

export default function WhyTuzuru() {
  return (
    <section className="mx-auto max-w-[1400px] px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
      <div className="grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        <Reveal>
          <div className="relative">
            <div className="aspect-[4/5] w-full overflow-hidden bg-sand">
              <Image
                src={IMAGES.craft}
                alt="Detail of hand-woven basket fibre in natural and ochre tones"
                className="h-full w-full"
              />
            </div>
            <div className="absolute -bottom-6 -right-4 hidden max-w-[220px] bg-forest p-6 text-paper sm:block lg:-right-8">
              <p className="font-heading text-[1.05rem] leading-snug">
                Enquiry first. Confirmation only when you say so.
              </p>
            </div>
          </div>
        </Reveal>

        <div>
          <Reveal>
            <SectionHeading
              eyebrow="Why travel with us"
              title="How we work"
              intro="A small number of principles run through every trip we plan. They are the reason the itineraries hold up on the ground."
            />
          </Reveal>

          <div className="mt-10 space-y-0">
            {whyTuzuru.map((item, i) => {
              const Icon = ICONS[item.icon] ?? Compass;
              return (
                <Reveal key={item.title} delay={i * 0.06}>
                  <div className="flex gap-5 border-t border-border py-6">
                    <Icon size={20} className="mt-1 shrink-0 text-gold-bronze" aria-hidden="true" />
                    <div>
                      <h3 className="font-heading text-[1.2rem] text-forest">{item.title}</h3>
                      <p className="mt-2 text-[0.9375rem] leading-relaxed text-ink/70">{item.body}</p>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}