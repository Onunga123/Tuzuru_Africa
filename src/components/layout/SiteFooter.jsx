import { Link } from 'react-router-dom';
import { Mail, MapPin, Phone, MessageCircle } from 'lucide-react';
import { site, footer, LOGO_URL as LOGO } from '@/lib/cms';

const EXPLORE = footer.explore;
const COMPANY = footer.company;
const LEGAL = footer.legal;

export default function SiteFooter() {
  return (
    <footer className="bg-forest-deep text-paper">
      <div className="mx-auto max-w-[1400px] px-5 pt-16 sm:px-8 lg:px-12 lg:pt-20">
        <div className="grid gap-12 border-b border-paper/15 pb-14 md:grid-cols-2 lg:grid-cols-[1.4fr_0.8fr_0.8fr_1fr]">
          <div>
            <div className="inline-block bg-white p-4">
              <img
                src={LOGO}
                alt="Tuzuru Africa logo"
                width={1536}
                height={1024}
                className="h-32 w-auto max-w-[260px] object-contain"
              />
            </div>
            <p className="mt-6 max-w-xs text-[0.9375rem] leading-relaxed text-paper/65">
              {site.shortDescription}
            </p>
            <a
              href={site.whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 font-body text-[0.7rem] uppercase tracking-[0.2em] text-gold hover:text-paper"
            >
              <MessageCircle size={14} /> Chat on WhatsApp
            </a>
          </div>

          <nav aria-label="Explore" className="space-y-3">
            <p className="eyebrow mb-5 text-gold">Explore</p>
            {EXPLORE.map((l) => (
              <Link key={l.to} to={l.to} className="block text-[0.875rem] text-paper/70 hover:text-paper">
                {l.label}
              </Link>
            ))}
          </nav>

          <nav aria-label="Company" className="space-y-3">
            <p className="eyebrow mb-5 text-gold">Company</p>
            {COMPANY.map((l) => (
              <Link key={l.to} to={l.to} className="block text-[0.875rem] text-paper/70 hover:text-paper">
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="space-y-3">
            <p className="eyebrow mb-5 text-gold">Get in touch</p>
            <a href={`tel:${site.phone.replace(/\s/g, '')}`} className="flex items-start gap-3 text-[0.875rem] text-paper/70 hover:text-paper">
              <Phone size={15} className="mt-1 shrink-0 text-gold" aria-hidden="true" /> {site.phone}
            </a>
            <a href={`mailto:${site.email}`} className="flex items-start gap-3 text-[0.875rem] text-paper/70 hover:text-paper">
              <Mail size={15} className="mt-1 shrink-0 text-gold" aria-hidden="true" /> {site.email}
            </a>
            <p className="flex items-start gap-3 text-[0.875rem] leading-relaxed text-paper/70">
              <MapPin size={15} className="mt-1 shrink-0 text-gold" aria-hidden="true" /> {site.location}
            </p>
            <p className="flex items-start gap-3 text-[0.8125rem] leading-relaxed text-paper/55">{site.hours}</p>
            <p className="pt-3 text-[0.6875rem] leading-relaxed text-paper/40">{site.contactNote}</p>
          </div>
        </div>

        <div className="flex flex-col gap-5 py-8 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            {LEGAL.map((l) => (
              <Link key={l.to} to={l.to} className="text-[0.75rem] text-paper/50 hover:text-paper">
                {l.label}
              </Link>
            ))}
          </div>
          <p className="text-[0.75rem] text-paper/40">
            © {new Date().getFullYear()} Tuzuru Africa. All rights reserved.
          </p>
        </div>
      </div>

      <div aria-hidden="true" className="overflow-hidden px-2">
        <p className="select-none text-center font-heading leading-[0.8] text-paper/[0.07] text-[22vw] tracking-[0.04em]">
          TUZURU
        </p>
      </div>
    </footer>
  );
}