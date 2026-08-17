import Display from './primitives/Display';
import Eyebrow from './primitives/Eyebrow';
import Reveal from './primitives/Reveal';
import Section from './primitives/Section';
import Avatar from './primitives/Avatar';
import { audience } from './content';

// Deliberately not a card grid. Capabilities is already a card grid one
// section up, and a paper card on a paper band barely registers anyway. This
// runs type-led between hairlines, and leads each column with the one thing
// that actually differs between these three audiences: who is in the room.
function Presence({ people, note }) {
  return (
    <p className="flex items-center gap-2.5">
      <span className="flex -space-x-1.5">
        {people.map((p) => (
          <Avatar
            key={p.initial}
            initial={p.initial}
            name={p.name}
            color={p.color}
            ring="ring-paper"
          />
        ))}
      </span>
      <span className="font-mono text-[11px] tracking-[0.02em] text-graphite/80">{note}</span>
    </p>
  );
}

const PRESENCE = [
  {
    note: 'two rooms, one file',
    people: [
      { initial: 'Y', name: 'You', color: 'caret' },
      { initial: 'A', name: 'Aaroh', color: 'amber' },
    ],
  },
  {
    note: 'three people, one workspace',
    people: [
      { initial: 'Y', name: 'You', color: 'caret' },
      { initial: 'A', name: 'Aaroh', color: 'amber' },
      { initial: 'A', name: 'Anurag', color: 'rose' },
    ],
  },
  {
    note: 'one typing, one watching',
    people: [
      { initial: 'A', name: 'Candidate', color: 'amber' },
      { initial: 'Y', name: 'You', color: 'caret' },
    ],
  },
];

export default function Audience() {
  return (
    <Section id="audience" band="paper" labelledBy="audience-title">
      <Reveal className="text-center">
        <Eyebrow>{audience.eyebrow}</Eyebrow>
        <Display
          id="audience-title"
          roman={audience.roman}
          italic={audience.italic}
          className="mx-auto mt-5"
        />
      </Reveal>

      <ul className="mt-14 grid border-t border-ink/12 md:mt-20 md:grid-cols-3">
        {audience.columns.map((col, i) => (
          <Reveal
            as="li"
            key={col.title}
            delay={i * 0.07}
            className="border-b border-ink/12 py-8 md:border-b-0 md:border-l md:border-l-ink/12 md:px-7 md:py-9 md:first:border-l-0 md:first:pl-0 md:last:pr-0"
          >
            <Presence people={PRESENCE[i].people} note={PRESENCE[i].note} />
            <h3 className="mt-6 text-[17px] font-semibold leading-[1.3] text-ink">{col.title}</h3>
            <p className="mt-2.5 text-[14.5px] leading-[1.62] text-graphite">{col.body}</p>
          </Reveal>
        ))}
      </ul>
    </Section>
  );
}
