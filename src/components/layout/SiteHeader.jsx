import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import BrandMark from './BrandMark';
import { navigation } from '@/lib/cms';

const NAV = navigation.primary;

export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-colors duration-300 ${
        scrolled ? 'border-border bg-paper/95 backdrop-blur-md' : 'border-transparent bg-paper/80 backdrop-blur-sm'
      }`}
    >
      <div className="mx-auto flex h-[74px] max-w-[1400px] items-center justify-between px-5 sm:px-8 lg:px-12">
        <BrandMark />

        <nav aria-label="Main navigation" className="hidden items-center gap-7 lg:flex">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `font-body text-[0.7rem] uppercase tracking-[0.2em] transition-colors ${
                  isActive ? 'text-forest' : 'text-ink/60 hover:text-forest'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
          {navigation.secondary.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="font-body text-[0.7rem] uppercase tracking-[0.2em] text-ink/60 hover:text-forest"
            >
              {item.label}
            </Link>
          ))}
          <Link to={navigation.cta.to} className="btn-solid !px-6 !py-3">
            {navigation.cta.label}
          </Link>
        </nav>

        <div className="flex items-center gap-3 lg:hidden">
          <Link to={navigation.mobileCta.to} className="btn-solid !px-4 !py-2.5 !text-[0.625rem]">
            {navigation.mobileCta.label}
          </Link>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? 'Close menu' : 'Open menu'}
            className="flex h-10 w-10 items-center justify-center border border-forest/25 text-forest"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {open && (
        <div id="mobile-nav" className="fixed inset-x-0 top-[74px] bottom-0 z-40 overflow-y-auto bg-paper lg:hidden">
          <nav aria-label="Mobile navigation" className="flex flex-col px-6 py-6">
            {[...NAV, ...navigation.mobileExtra].map(
              (item, index) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-baseline justify-between border-b border-border py-5 font-heading text-[1.6rem] ${
                      isActive ? 'text-gold-bronze' : 'text-forest'
                    }`
                  }
                >
                  {item.label}
                  <span className="font-body text-[0.6rem] tracking-[0.25em] text-ink/35">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </NavLink>
              )
            )}
          </nav>
        </div>
      )}
    </header>
  );
}