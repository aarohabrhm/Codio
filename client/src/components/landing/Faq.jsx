import { useCallback, useEffect, useRef, useState } from 'react';
import Card from './primitives/Card';
import Display from './primitives/Display';
import Eyebrow from './primitives/Eyebrow';
import Reveal from './primitives/Reveal';
import Section from './primitives/Section';
import { faq } from './content';

// The reference runs a testimonial carousel here. Codio has no users to quote
// yet and inventing them reads badly to anyone technical, so the slot keeps the
// carousel shape and carries the four questions people actually ask.
function Arrow({ dir, onClick, disabled }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={dir === 'prev' ? 'Previous questions' : 'More questions'}
      className="flex h-10 w-10 items-center justify-center rounded-full border border-ink/12 text-ink transition-all duration-200 enabled:hover:border-ink/35 enabled:hover:bg-card disabled:opacity-30 focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-caret"
    >
      <svg viewBox="0 0 12 12" fill="none" aria-hidden="true" className="h-3.5 w-3.5">
        <path
          d={dir === 'prev' ? 'M11 6H2m3.5-3.5L2 6l3.5 3.5' : 'M1 6h9M6.5 2.5 10 6l-3.5 3.5'}
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}

export default function Faq() {
  const railRef = useRef(null);
  const [edge, setEdge] = useState({ start: true, end: false });

  const measure = useCallback(() => {
    const el = railRef.current;
    if (!el) return;
    setEdge({
      start: el.scrollLeft <= 4,
      end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 4,
    });
  }, []);

  useEffect(() => {
    measure();
    const el = railRef.current;
    if (!el) return undefined;
    el.addEventListener('scroll', measure, { passive: true });
    window.addEventListener('resize', measure);
    return () => {
      el.removeEventListener('scroll', measure);
      window.removeEventListener('resize', measure);
    };
  }, [measure]);

  const nudge = (dir) => {
    const el = railRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * (el.clientWidth * 0.72), behavior: 'smooth' });
  };

  return (
    <Section id="faq" band="linen" labelledBy="faq-title" containerClassName="">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <Reveal>
          <Eyebrow>{faq.eyebrow}</Eyebrow>
          <Display
            id="faq-title"
            roman={faq.roman}
            italic={faq.italic}
            className="mt-5"
          />
        </Reveal>
        <Reveal delay={0.06} className="flex shrink-0 gap-2.5">
          <Arrow dir="prev" onClick={() => nudge(-1)} disabled={edge.start} />
          <Arrow dir="next" onClick={() => nudge(1)} disabled={edge.end} />
        </Reveal>
      </div>

      <Reveal>
        <ul
          ref={railRef}
          className="-mx-6 mt-12 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-2 md:-mx-8 md:mt-16 md:px-8 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {faq.items.map((item) => (
            <li
              key={item.q}
              className="w-[80vw] max-w-[340px] shrink-0 snap-start sm:w-[340px]"
            >
              <Card on="linen" className="flex h-full flex-col p-6">
                <h3 className="font-mono text-[13px] leading-[1.5] tracking-[0.02em] text-ink">
                  {item.q}
                </h3>
                <span aria-hidden="true" className="mt-5 block h-px w-full bg-ink/10" />
                <p className="mt-5 text-[14px] leading-[1.62] text-graphite">{item.a}</p>
              </Card>
            </li>
          ))}
        </ul>
      </Reveal>
    </Section>
  );
}
