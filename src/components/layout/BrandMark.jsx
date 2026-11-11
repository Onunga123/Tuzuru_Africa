import { Link } from 'react-router-dom';
import { LOGO_URL } from '@/lib/cms';

export { LOGO_URL };

export default function BrandMark({ size = 'md' }) {
  const big = size === 'lg';

  return (
    <Link to="/" className="group inline-flex shrink-0 items-center" aria-label="Tuzuru Africa — home">
      <img
        src={LOGO_URL}
        alt="Tuzuru Africa"
        width={1536}
        height={1024}
        className={`w-auto object-contain ${big ? 'h-20' : 'h-11 sm:h-[3.5rem]'}`}
      />
    </Link>
  );
}