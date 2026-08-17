import Container from './primitives/Container';
import Display from './primitives/Display';
import Eyebrow from './primitives/Eyebrow';
import Button from './primitives/Button';
import Reveal from './primitives/Reveal';
import HeroBackdrop from './primitives/HeroBackdrop';
import HeroPanel from './HeroPanel';
import HeroPanelMobile from './HeroPanelMobile';
import useMediaQuery from './useMediaQuery';
import { GITHUB_URL, SIGNUP_PATH, hero } from './content';

export default function HeroSection() {
  const isDesktop = useMediaQuery('(min-width: 768px)');

  return (
    <section
      aria-labelledby="hero-title"
      className="relative isolate bg-paper pb-14 pt-14 md:pb-32 md:pt-20"
    >
      <HeroBackdrop />

      <Container className="relative z-10 text-center">
        <Reveal>
          <Eyebrow>{hero.eyebrow}</Eyebrow>
        </Reveal>

        <Reveal delay={0.06}>
          <Display
            as="h1"
            id="hero-title"
            size="d1"
            roman={hero.roman}
            italic={hero.italic}
            className="mt-6"
          />
        </Reveal>

        <Reveal delay={0.12}>
          <p className="mx-auto mt-7 max-w-[58ch] text-[clamp(1rem,1.35vw,1.125rem)] leading-[1.6] text-graphite">
            {hero.sub}
          </p>
        </Reveal>

        <Reveal delay={0.18}>
          <div className="mt-9 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-center">
            <Button to={SIGNUP_PATH} variant="dark">
              {hero.primary}
            </Button>
            <Button href={GITHUB_URL} external variant="ghost">
              {hero.secondary}
            </Button>
          </div>
        </Reveal>
      </Container>

      {/* The panel floats on the exposed part of the photograph. */}
      <div className="relative z-10 mt-14 md:mt-28">
        <Container>{isDesktop ? <HeroPanel /> : <HeroPanelMobile />}</Container>
      </div>
    </section>
  );
}
