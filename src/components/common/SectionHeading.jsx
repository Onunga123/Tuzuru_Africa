export default function SectionHeading({ eyebrow, title, intro, align = 'left', tone = 'light' }) {
  const isCenter = align === 'center';
  const titleColor = tone === 'dark' ? 'text-paper' : 'text-forest';
  const introColor = tone === 'dark' ? 'text-paper/75' : 'text-ink/70';

  return (
    <div className={isCenter ? 'mx-auto max-w-2xl text-center' : 'max-w-2xl'}>
      {eyebrow && (
        <p className={`eyebrow mb-5 ${tone === 'dark' ? 'text-gold' : 'text-gold-bronze'}`}>{eyebrow}</p>
      )}
      <h2 className={`font-heading text-[2rem] leading-[1.12] sm:text-[2.6rem] lg:text-[3.1rem] ${titleColor}`}>
        {title}
      </h2>
      {intro && <p className={`mt-5 text-[1rem] leading-relaxed ${introColor}`}>{intro}</p>}
    </div>
  );
}