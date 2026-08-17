import { MessageSquare, Sparkles, TerminalSquare, Users } from 'lucide-react';
import Card from './primitives/Card';
import Display from './primitives/Display';
import Eyebrow from './primitives/Eyebrow';
import Reveal from './primitives/Reveal';
import Section from './primitives/Section';
import { capabilities } from './content';

const ICONS = {
  users: Users,
  chat: MessageSquare,
  terminal: TerminalSquare,
  sparkles: Sparkles,
};

export default function Capabilities() {
  return (
    <Section id="capabilities" band="linen" labelledBy="capabilities-title">
      <div className="grid gap-8 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] md:items-end md:gap-16">
        <div>
          <Reveal>
            <Eyebrow>{capabilities.eyebrow}</Eyebrow>
          </Reveal>
          <Reveal delay={0.04}>
            <Display
              id="capabilities-title"
              roman={capabilities.roman}
              italic={capabilities.italic}
              className="mt-5"
            />
          </Reveal>
        </div>
        <Reveal delay={0.08}>
          <p className="text-[14px] leading-[1.6] text-graphite md:text-right">
            {capabilities.aside}
          </p>
        </Reveal>
      </div>

      <ul className="mt-12 grid gap-4 md:mt-16 md:grid-cols-2">
        {capabilities.items.map((item, i) => {
          const Icon = ICONS[item.icon];
          return (
            <Reveal as="li" key={item.title} delay={i * 0.07}>
              <Card on="linen" className="h-full p-6 md:p-7">
                <div className="flex items-start justify-between gap-4">
                  <span className="flex h-9 w-9 items-center justify-center rounded-[10px] border border-ink/[0.08] bg-linen">
                    <Icon size={16} strokeWidth={1.6} className="text-ink" aria-hidden="true" />
                  </span>
                  <a
                    href="#workspace"
                    className="group inline-flex items-center gap-1.5 rounded-full border border-ink/[0.09] px-3 py-1.5 font-mono text-[11px] text-graphite transition-colors duration-200 hover:border-ink/25 hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-caret"
                  >
                    Learn more
                    <span
                      aria-hidden="true"
                      className="transition-transform duration-300 group-hover:translate-x-0.5"
                    >
                      →
                    </span>
                  </a>
                </div>

                <h3 className="mt-7 text-[16px] font-semibold leading-[1.35] text-ink">
                  {item.title}
                </h3>
                <p className="mt-2.5 max-w-[46ch] text-[14.5px] leading-[1.62] text-graphite">
                  {item.body}
                </p>
              </Card>
            </Reveal>
          );
        })}
      </ul>
    </Section>
  );
}
