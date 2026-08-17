import { motion as Motion } from 'framer-motion';
import useHeroSequence, { STEP } from './useHeroSequence';
import {
  AiCard,
  ChatBubble,
  Gutter,
  Line4,
  LiveDot,
  PresenceStack,
  StaticLine,
  Terminal,
} from './panelParts';
import { EASE, PANEL, PANEL_STORY } from './panelTokens';

// Not the desktop panel scaled down. The explorer and the chat column are
// dropped outright; chat and the AI card become bubbles that rise over the
// code, and the same four beats play in about six seconds.
export default function HeroPanelMobile() {
  const { step, typed, reduced } = useHeroSequence({ scale: 0.75 });
  const patched = step >= STEP.PATCHED;

  return (
    <Motion.div
      role="img"
      aria-label={PANEL_STORY}
      initial={reduced ? false : { opacity: 0, y: 12, filter: 'blur(6px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      transition={{ duration: 0.6, ease: EASE }}
      className="overflow-hidden rounded-[16px] shadow-[0_28px_56px_-32px_rgba(23,26,23,0.55)]"
      style={{ background: PANEL.face }}
    >
      <div
        className="flex h-10 items-center gap-2.5 border-b px-3"
        style={{ borderColor: PANEL.rule, background: PANEL.chrome }}
      >
        <LiveDot />
        <span className="font-mono text-[11px]" style={{ color: PANEL.text }}>
          users.js
        </span>
        <span className="ml-auto">
          <PresenceStack />
        </span>
      </div>

      <div className="overflow-hidden px-2.5 pb-1 pt-3 font-mono text-[10.5px] leading-[1.85]">
        {[3, 4, 5].map((n) => (
          <p key={n} className="whitespace-pre">
            <Gutter n={n} compact />
            {n === 4 ? (
              <Line4
                typed={typed}
                patched={patched}
                caret={step >= STEP.CARET}
                indent={false}
                flash={!reduced}
              />
            ) : (
              <StaticLine n={n} />
            )}
          </p>
        ))}
      </div>

      <div className="flex flex-col gap-2 px-3 pb-3 pt-2">
        <ChatBubble show={step >= STEP.CHAT} compact />
        <AiCard show={step >= STEP.AI} patched={patched} compact />
      </div>

      <Terminal step={step} compact />
    </Motion.div>
  );
}
