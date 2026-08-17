import Card from './primitives/Card';
import Display from './primitives/Display';
import Eyebrow from './primitives/Eyebrow';
import Reveal from './primitives/Reveal';
import Section from './primitives/Section';
import Avatar from './primitives/Avatar';
import { PANEL } from './panelTokens';
import { process } from './content';

function Mini({ children }) {
  return (
    <div
      className="flex h-full min-h-[132px] flex-col justify-center gap-2 rounded-[12px] p-4 font-mono text-[11px] leading-[1.7]"
      style={{ background: PANEL.face }}
    >
      {children}
    </div>
  );
}

const MOCKS = {
  '01': (
    <Mini>
      <p style={{ color: '#5E665E' }}>new workspace</p>
      <p
        className="flex items-center justify-between rounded-[7px] border px-2.5 py-2"
        style={{ borderColor: PANEL.rule, background: PANEL.inset, color: PANEL.text }}
      >
        api-service
        <span
          className="inline-block h-[1.1em] w-[2px]"
          style={{ background: '#2B4BF0' }}
          aria-hidden="true"
        />
      </p>
      <p style={{ color: '#5E665E' }}>◻ index.js</p>
      <p className="mt-1">
        <span className="rounded-full bg-caret px-2.5 py-1 text-[10px] text-white">Create</span>
      </p>
    </Mini>
  ),
  '02': (
    <Mini>
      <p style={{ color: '#5E665E' }}>share</p>
      <p
        className="truncate rounded-[7px] border px-2.5 py-2"
        style={{ borderColor: PANEL.rule, background: PANEL.inset, color: PANEL.text }}
      >
        codio.dev/w/9f3a2c
      </p>
      <p className="mt-1 flex items-center gap-2" style={{ color: '#8B938B' }}>
        <span className="flex -space-x-1.5">
          <Avatar initial="Y" name="You" color="caret" ring="ring-[#101310]" />
          <Avatar initial="A" name="Aaroh" color="amber" ring="ring-[#101310]" />
          <Avatar initial="A" name="Anurag" color="rose" ring="ring-[#101310]" />
        </span>
        joined
      </p>
    </Mini>
  ),
  '03': (
    <Mini>
      <p style={{ color: PANEL.text }}>
        <span style={{ color: '#8B938B' }}>$</span> node index.js
      </p>
      <p style={{ color: PANEL.pass }}>
        ✓ done <span style={{ color: '#8B938B' }}>· exit 0</span>
      </p>
      <p
        className="mt-1 flex items-center justify-between gap-2 whitespace-nowrap rounded-[7px] border px-2.5 py-2"
        style={{ borderColor: PANEL.rule, background: PANEL.inset, color: '#8B938B' }}
      >
        checkpoint 14:02
        <span style={{ color: PANEL.pass }}>saved</span>
      </p>
    </Mini>
  ),
};

export default function Process() {
  return (
    <Section id="process" band="linen" labelledBy="process-title">
      <Reveal className="text-center">
        <Eyebrow className="mx-auto">{process.eyebrow}</Eyebrow>
        <Display
          id="process-title"
          roman={process.roman}
          italic={process.italic}
          className="mx-auto mt-5"
        />
      </Reveal>

      <ol className="relative mx-auto mt-14 max-w-[780px] md:mt-20">
        {/* the spine */}
        <span
          aria-hidden="true"
          className="absolute bottom-8 left-[15px] top-8 w-px bg-ink/12 md:left-[19px]"
        />

        {process.steps.map((step, i) => (
          <Reveal as="li" key={step.n} delay={i * 0.06} className="relative pb-5 last:pb-0">
            <div className="grid grid-cols-[32px_minmax(0,1fr)] gap-4 md:grid-cols-[40px_minmax(0,1fr)] md:gap-8">
              <span className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full bg-ink font-mono text-[11px] font-medium tracking-[0.06em] text-paper md:h-10 md:w-10 md:text-[12px]">
                {step.n}
              </span>

              <Card on="linen" className="grid gap-5 p-4 sm:grid-cols-[minmax(0,190px)_minmax(0,1fr)] sm:items-center sm:gap-7 sm:p-5">
                {MOCKS[step.n]}
                <div className="sm:pr-4">
                  <h3 className="text-[17px] font-semibold leading-[1.3] text-ink">
                    {step.title}
                  </h3>
                  <p className="mt-2.5 max-w-[46ch] text-[14.5px] leading-[1.62] text-graphite">
                    {step.body}
                  </p>
                </div>
              </Card>
            </div>
          </Reveal>
        ))}
      </ol>
    </Section>
  );
}
