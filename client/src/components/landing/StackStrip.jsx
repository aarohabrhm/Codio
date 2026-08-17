import Reveal from './primitives/Reveal';
import Section from './primitives/Section';
import { stack } from './content';

// Where the reference runs customer logos. Codio has none, so this runs the
// actual stack instead — developers trust specifics more than logo walls.
export default function StackStrip() {
  return (
    <Section band="paper" pad="none" className="border-y border-linen">
      <Reveal className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 py-7 md:gap-x-9">
        <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-graphite/60">
          Built on
        </span>
        {stack.map((item) => (
          <span
            key={item}
            className="font-mono text-[12.5px] tracking-[0.02em] text-graphite/75"
          >
            {item}
          </span>
        ))}
      </Reveal>
    </Section>
  );
}
