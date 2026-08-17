import Container from './primitives/Container';
import Display from './primitives/Display';
import Eyebrow from './primitives/Eyebrow';
import Button from './primitives/Button';
import Reveal from './primitives/Reveal';
import TextureField from './primitives/TextureField';
import Avatar from './primitives/Avatar';
import { LiveDot } from './panelParts';
import { PANEL } from './panelTokens';
import { SIGNUP_PATH, workspace } from './content';

function Column({ label, children }) {
  return (
    <div className="flex flex-col gap-3.5 p-5 md:p-6">
      <p
        className="font-mono text-[10px] font-medium uppercase tracking-[0.08em]"
        style={{ color: '#5E665E' }}
      >
        {label}
      </p>
      {children}
    </div>
  );
}

export default function Workspace() {
  return (
    <section
      id="workspace"
      aria-labelledby="workspace-title"
      className="relative bg-paper py-14 md:py-28"
    >
      <Container>
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between md:gap-12">
          <div>
            <Reveal>
              <Eyebrow>{workspace.eyebrow}</Eyebrow>
            </Reveal>
            <Reveal delay={0.04}>
              <Display
                id="workspace-title"
                roman={workspace.roman}
                italic={workspace.italic}
                className="mt-5"
              />
            </Reveal>
          </div>
          <Reveal delay={0.08} className="shrink-0">
            <Button to={SIGNUP_PATH} variant="dark">
              {workspace.cta}
            </Button>
          </Reveal>
        </div>
      </Container>

      <div className="relative mt-12 md:mt-16">
        <div aria-hidden="true" className="absolute inset-x-0 -top-10 bottom-[30%]">
          <TextureField flip />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-paper" />
        </div>

        <Container className="relative z-10">
          <Reveal>
            <div
              className="overflow-hidden rounded-panel shadow-[0_40px_80px_-44px_rgba(23,26,23,0.55)]"
              style={{ background: PANEL.face }}
            >
              <div
                className="flex h-11 items-center gap-3 border-b px-5 font-mono text-[11.5px]"
                style={{ borderColor: PANEL.rule, background: PANEL.chrome, color: PANEL.dim }}
              >
                <LiveDot />
                <span style={{ color: PANEL.text }}>codio / api-service</span>
                <span className="ml-auto hidden sm:inline">one workspace · three people</span>
              </div>

              <div className="grid divide-y md:grid-cols-3 md:divide-x md:divide-y-0" style={{ borderColor: PANEL.rule }}>
                <Column label="Editing">
                  <p className="font-mono text-[12px]" style={{ color: PANEL.text }}>
                    users.js
                  </p>
                  <div
                    className="rounded-[10px] border p-3 font-mono text-[11px] leading-[1.8]"
                    style={{ background: PANEL.inset, borderColor: PANEL.rule }}
                  >
                    <p style={{ color: '#C9CFC9' }}>
                      <span style={{ color: '#4B534B' }}>4 </span>
                      {'  '}return users.
                      <span className="text-[#8FA7F5]">filter</span>
                      <span style={{ color: '#A8B0A8' }}>(u {'=>'} u.isOnline)</span>
                      <span
                        className="ml-[1px] inline-block h-[1.1em] w-[2px] align-middle"
                        style={{ background: '#E9A227' }}
                        aria-hidden="true"
                      />
                    </p>
                    <p style={{ color: '#C9CFC9' }}>
                      <span style={{ color: '#4B534B' }}>5 </span>
                      {'}'}
                      <span
                        className="ml-[1px] inline-block h-[1.1em] w-[2px] align-middle"
                        style={{ background: '#2B4BF0' }}
                        aria-hidden="true"
                      />
                    </p>
                  </div>
                  <p className="flex items-center gap-2 font-mono text-[11px]" style={{ color: PANEL.dim }}>
                    <span className="flex -space-x-1.5">
                      <Avatar initial="A" name="Aaroh" color="amber" ring="ring-[#101310]" />
                      <Avatar initial="Y" name="You" color="caret" ring="ring-[#101310]" />
                    </span>
                    2 cursors on this file
                  </p>
                </Column>

                <Column label="Chat">
                  {[
                    { who: 'anurag', color: 'rose', initial: 'A', text: 'schema renamed it last week — it’s isOnline now' },
                    { who: 'aaroh', color: 'amber', initial: 'A', text: 'patched. re-running the suite' },
                  ].map((m) => (
                    <div
                      key={m.who}
                      className="rounded-[10px] border p-3"
                      style={{ background: PANEL.inset, borderColor: PANEL.rule }}
                    >
                      <span className="mb-1.5 flex items-center gap-1.5">
                        <Avatar
                          initial={m.initial}
                          name={m.who}
                          color={m.color}
                          ring="ring-[#0C0F0C]"
                        />
                        <span className="font-mono text-[10.5px]" style={{ color: PANEL.dim }}>
                          @{m.who}
                        </span>
                      </span>
                      <p className="text-[12px] leading-[1.5]" style={{ color: PANEL.text }}>
                        {m.text}
                      </p>
                    </div>
                  ))}
                </Column>

                <Column label="Running">
                  <div
                    className="rounded-[10px] border p-3 font-mono text-[11px] leading-[1.8]"
                    style={{ background: PANEL.inset, borderColor: PANEL.rule }}
                  >
                    <p style={{ color: PANEL.text }}>
                      <span style={{ color: PANEL.dim }}>$</span> npm test
                    </p>
                    <p style={{ color: PANEL.dim }}>› users.test.js</p>
                    <p style={{ color: PANEL.pass }}>✓ 8 passing · 412ms</p>
                  </div>
                  <p className="font-mono text-[11px]" style={{ color: PANEL.dim }}>
                    exit code <span style={{ color: PANEL.pass }}>0</span> · checkpoint saved
                  </p>
                </Column>
              </div>
            </div>
          </Reveal>
        </Container>
      </div>
    </section>
  );
}
