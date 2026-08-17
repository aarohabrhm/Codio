import { motion as Motion } from 'framer-motion';
import useHeroSequence, { STEP } from './useHeroSequence';
import {
  AiCard,
  ChatBubble,
  Dots,
  Gutter,
  Line4,
  LiveDot,
  PresenceStack,
  StaticLine,
  Terminal,
} from './panelParts';
import { EASE, PANEL, PANEL_STORY } from './panelTokens';

const TREE = [
  { label: 'src', kind: 'dir' },
  { label: 'index.js', kind: 'file', depth: 1 },
  { label: 'users.js', kind: 'file', depth: 1, active: true },
  { label: 'schema.js', kind: 'file', depth: 1 },
  { label: 'tests', kind: 'dir' },
  { label: 'users.test.js', kind: 'file', depth: 1 },
];

export default function HeroPanel() {
  const { step, typed, reduced } = useHeroSequence();
  const patched = step >= STEP.PATCHED;

  return (
    <Motion.div
      role="img"
      aria-label={PANEL_STORY}
      initial={reduced ? false : { opacity: 0, y: 12, filter: 'blur(6px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      transition={{ duration: 0.6, ease: EASE }}
      className="overflow-hidden rounded-panel shadow-[0_40px_80px_-40px_rgba(23,26,23,0.55)]"
      style={{ background: PANEL.face }}
    >
      {/* chrome */}
      <div
        className="flex h-11 items-center gap-4 border-b px-4"
        style={{ borderColor: PANEL.rule, background: PANEL.chrome }}
      >
        <Dots />
        <span className="font-mono text-[11.5px]" style={{ color: PANEL.dim }}>
          codio / api-service — <span style={{ color: PANEL.text }}>users.js</span>
        </span>
        <span
          className="ml-auto flex items-center gap-1.5 font-mono text-[11px]"
          style={{ color: PANEL.dim }}
        >
          <LiveDot />3 in this file
        </span>
        <PresenceStack />
      </div>

      <div className="grid grid-cols-[152px_minmax(0,1fr)_232px]">
        {/* explorer */}
        <aside
          className="border-r py-3.5"
          style={{ borderColor: PANEL.rule, background: PANEL.inset }}
        >
          <p
            className="px-4 pb-2.5 font-mono text-[10px] font-medium uppercase tracking-[0.08em]"
            style={{ color: '#5E665E' }}
          >
            Explorer
          </p>
          {TREE.map((item) => (
            <p
              key={item.label}
              className="flex items-center gap-2 px-4 py-[3px] font-mono text-[11px]"
              style={{
                paddingLeft: item.depth ? 30 : 16,
                color: item.active ? PANEL.text : PANEL.dim,
                background: item.active ? 'rgba(255,255,255,0.05)' : 'transparent',
              }}
            >
              <span aria-hidden="true" style={{ color: '#4B534B' }}>
                {item.kind === 'dir' ? '▾' : '◻'}
              </span>
              {item.label}
            </p>
          ))}
        </aside>

        {/* code */}
        <div className="overflow-hidden py-3.5 pl-5 pr-4 font-mono text-[12.5px] leading-[1.75]">
          {[1, 2, 3, 4, 5, 6, 7].map((n) => (
            <p key={n} className="whitespace-pre">
              <Gutter n={n} />
              {n === 4 ? (
                <Line4
                  typed={typed}
                  patched={patched}
                  caret={step >= STEP.CARET}
                  flash={!reduced}
                />
              ) : (
                <StaticLine n={n} />
              )}
            </p>
          ))}
        </div>

        {/* chat */}
        <aside
          className="flex flex-col gap-2.5 border-l p-3.5"
          style={{ borderColor: PANEL.rule, background: PANEL.chrome }}
        >
          <p
            className="flex items-center justify-between font-mono text-[10px] font-medium uppercase tracking-[0.08em]"
            style={{ color: '#5E665E' }}
          >
            Chat <span className="normal-case tracking-normal">#api-service</span>
          </p>
          <ChatBubble show={step >= STEP.CHAT} />
          <AiCard show={step >= STEP.AI} patched={patched} />
        </aside>
      </div>

      <Terminal step={step} />
    </Motion.div>
  );
}
