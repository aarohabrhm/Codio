import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Container from './primitives/Container';
import Mark from './primitives/Mark';
import Button from './primitives/Button';
import { nav, SIGNUP_PATH } from './content';

// A full-bleed sticky strip, blurred over whatever scrolls beneath it, with a
// hairline that only appears once the page has moved. The pill is the link
// group inside the bar, not the bar itself.
export default function Nav() {
  const [stuck, setStuck] = useState(false);

  useEffect(() => {
    const onScroll = () => setStuck(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className="sticky top-0 z-50">
      <div
        className={`border-b backdrop-blur-[14px] transition-colors duration-300 ${
          stuck ? 'border-ink/[0.07] bg-paper/[0.88]' : 'border-transparent bg-paper/[0.72]'
        }`}
      >
        <Container>
          <div className="flex items-center justify-between gap-4 py-4">
            <Link
              to="/"
              className="flex shrink-0 items-center gap-2.5 font-display text-[1.22rem] leading-none tracking-[-0.02em] text-ink [font-optical-sizing:auto] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-caret"
            >
              <Mark className="h-6" />
              Codio
            </Link>

            <nav
              aria-label="Primary"
              className="hidden gap-1.5 rounded-full border border-ink/[0.07] bg-white/50 p-1 md:flex"
            >
              {nav.links.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  {...(link.external ? { target: '_blank', rel: 'noreferrer' } : {})}
                  className="rounded-full px-3.5 py-[7px] font-mono text-[11.5px] tracking-[0.03em] text-graphite transition-colors duration-200 hover:bg-white/85 hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-caret"
                >
                  {link.label}
                </a>
              ))}
            </nav>

            <Button to={SIGNUP_PATH} variant="dark" size="sm" arrow>
              {nav.cta}
            </Button>
          </div>
        </Container>
      </div>
    </header>
  );
}
