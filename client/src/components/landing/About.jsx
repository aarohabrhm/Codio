import Display from './primitives/Display';
import Eyebrow from './primitives/Eyebrow';
import Reveal from './primitives/Reveal';
import Section from './primitives/Section';
import { LiveDot } from './panelParts';
import { PANEL } from './panelTokens';
import Avatar from './primitives/Avatar';
import { about } from './content';

export default function About() {
  return (
    <Section id="about" band="paper" pad="normal" labelledBy="about-title">
      <Reveal>
        <Eyebrow>{about.label}</Eyebrow>
      </Reveal>

      <div className="mt-8 grid gap-10 md:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] md:items-end md:gap-16">
        <div>
          <Reveal delay={0.04}>
            <Display
              id="about-title"
              size="d3"
              flow="inline"
              roman={about.roman}
              italic={about.italic}
              className="max-w-[24ch]"
            />
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-6 max-w-[52ch] text-[15px] leading-[1.62] text-graphite">
              {about.body}
            </p>
          </Reveal>
        </div>

        {/* No metric here. A real project doesn't have one yet — so this shows
            presence, which is the thing Codio actually does. */}
        <Reveal delay={0.14}>
          <div
            className="rounded-card p-5 shadow-[0_24px_48px_-32px_rgba(23,26,23,0.5)] md:ml-auto md:max-w-[360px]"
            style={{ background: PANEL.face }}
          >
            <p
              className="flex items-center gap-2 font-mono text-[11px]"
              style={{ color: PANEL.dim }}
            >
              <LiveDot />
              {about.presence.file}
            </p>

            <div className="mt-5 flex -space-x-2">
              {about.presence.people.map((p) => (
                <Avatar
                  key={p.initial}
                  initial={p.initial}
                  name={p.name}
                  color={p.color}
                  size="md"
                  ring="ring-[#101310]"
                />
              ))}
            </div>

            <p className="mt-4 font-mono text-[12px]" style={{ color: PANEL.text }}>
              {about.presence.status}
            </p>
            <p className="mt-1 font-mono text-[11px]" style={{ color: PANEL.dim }}>
              no screen share running
            </p>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
