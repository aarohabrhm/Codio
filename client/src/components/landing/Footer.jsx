import Container from './primitives/Container';
import Display from './primitives/Display';
import Mark from './primitives/Mark';
import Button from './primitives/Button';
import Reveal from './primitives/Reveal';
import PhotoBand from './primitives/PhotoBand';
import { SIGNUP_PATH, footer } from './content';

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-paper pt-20 md:pt-28">
      <Container className="relative z-10">
        <div className="grid gap-12 md:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] md:gap-16">
          <div>
            <span className="flex items-center gap-2.5">
              <Mark className="h-6" />
              <span className="font-display text-[1.22rem] leading-none tracking-[-0.02em] text-ink [font-optical-sizing:auto]">
                Codio
              </span>
            </span>

            <Reveal delay={0.04}>
              <Display
                size="d3"
                roman={footer.roman}
                italic={footer.italic}
                className="mt-7"
              />
            </Reveal>

            <div className="mt-8">
              <Button to={SIGNUP_PATH} variant="dark">
                {footer.cta}
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {footer.columns.map((col) => (
              <div key={col.heading}>
                <p className="font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-graphite/60">
                  {col.heading}
                </p>
                <ul className="mt-4 space-y-2.5">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        {...(link.external
                          ? { target: '_blank', rel: 'noreferrer' }
                          : {})}
                        className="rounded-sm font-mono text-[12.5px] tracking-[0.02em] text-graphite transition-colors duration-200 hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-caret"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-2 border-t border-ink/10 pt-6 font-mono text-[11.5px] text-graphite/70 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Codio</p>
          
        </div>
      </Container>

      {/* The page's second and last texture field, with the wordmark running
          off the bottom edge of the document. */}
      {/* Band height is derived from the wordmark's own size, so the bottom
          edge crops the letterforms by the same fraction at every width. */}
      <div
        className="relative mt-14 md:mt-20"
        style={{ '--mark': 'clamp(4.5rem, 34vw, 18.5rem)', height: 'calc(var(--mark) * 0.86)' }}
      >
        <PhotoBand focus="50% 34%" veil={0.34} />
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-paper to-transparent"
        />
        <span
          aria-hidden="true"
          className="absolute left-1/2 top-0 block -translate-x-1/2 select-none whitespace-nowrap font-display leading-[0.78] tracking-[-0.045em] text-ink/[0.92]"
          style={{ fontSize: 'var(--mark)' }}
        >
          Codio
        </span>
      </div>
    </footer>
  );
}
