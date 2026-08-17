import { motion as Motion } from 'framer-motion';
import Avatar from './primitives/Avatar';
import Cursor from './primitives/Cursor';
import { LINE_TOKENS, STEP } from './useHeroSequence';
import { EASE, PANEL, TOKEN } from './panelTokens';

export function Dots() {
  return (
    <span className="flex shrink-0 items-center gap-1.5" aria-hidden="true">
      {[0, 1, 2].map((i) => (
        <span key={i} className="h-2 w-2 rounded-full bg-[#3A403A]" />
      ))}
    </span>
  );
}

export function LiveDot({ animate = true }) {
  return (
    <span className="relative flex h-1.5 w-1.5 shrink-0" aria-hidden="true">
      {animate ? (
        <span
          className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-60 motion-reduce:hidden"
          style={{ background: PANEL.pass }}
        />
      ) : null}
      <span
        className="relative inline-flex h-1.5 w-1.5 rounded-full"
        style={{ background: PANEL.pass }}
      />
    </span>
  );
}

export function PresenceStack({ size = 'sm' }) {
  return (
    <span className="flex -space-x-1.5" aria-hidden="true">
      <Avatar initial="Y" name="You" color="caret" size={size} />
      <Avatar initial="A" name="Aaroh" color="amber" size={size} />
      <Avatar initial="A" name="Anurag" color="rose" size={size} />
    </span>
  );
}

// ---------------------------------------------------------------------------
// Line 4 — the line the whole sequence happens to.
// ---------------------------------------------------------------------------
export function Line4({ typed, patched, caret, indent = true, flash = true }) {
  let budget = typed;
  const parts = [];

  LINE_TOKENS.forEach((tok, i) => {
    // The narrow panel drops the leading indent so the name tag still fits.
    if (!indent && i === 0) {
      budget -= tok.t.length;
      return;
    }

    const full = tok.bug && patched ? 'isOnline' : tok.t;
    let shown;

    if (patched) {
      shown = full;
    } else {
      const take = Math.max(0, Math.min(tok.t.length, budget));
      budget -= tok.t.length;
      shown = tok.t.slice(0, take);
    }

    if (!shown) return;

    if (tok.bug) {
      parts.push(
        <Motion.span
          key={`${i}-${patched ? 'fixed' : 'buggy'}`}
          className={`rounded-[3px] ${TOKEN[tok.c]}`}
          initial={flash && patched ? { backgroundColor: 'rgba(43,75,240,0.45)' } : false}
          animate={{ backgroundColor: 'rgba(43,75,240,0)' }}
          transition={{ duration: flash ? 1.4 : 0, ease: EASE }}
        >
          {shown}
        </Motion.span>,
      );
      return;
    }

    parts.push(
      <span key={i} className={TOKEN[tok.c]}>
        {shown}
      </span>,
    );
  });

  return (
    <>
      {parts}
      {caret ? <Cursor color="amber" name="Aaroh" className="ml-[1px]" /> : null}
    </>
  );
}

export function Gutter({ n, compact = false }) {
  return (
    <span
      className={`inline-block w-3 shrink-0 select-none text-right text-[#4B534B] ${
        compact ? 'mr-2' : 'mr-4'
      }`}
      aria-hidden="true"
    >
      {n}
    </span>
  );
}

// Lines 1–7 minus line 4, which the sequence owns.
export function StaticLine({ n }) {
  if (n === 1) {
    return <span className={TOKEN.com}>{'// shared with @aaroh · saved 2s ago'}</span>;
  }
  if (n === 3) {
    return (
      <>
        <span className={TOKEN.kw}>export function</span>{' '}
        <span className={TOKEN.fn}>activeUsers</span>
        <span className={TOKEN.plain}>(users) {'{'}</span>
      </>
    );
  }
  if (n === 5) {
    return <span className={TOKEN.plain}>{'}'}</span>;
  }
  if (n === 7) {
    return (
      <>
        <span className={TOKEN.kw}>export const</span>{' '}
        <span className={TOKEN.fn}>countActive</span>{' '}
        <span className={TOKEN.op}>=</span>{' '}
        <span className={TOKEN.plain}>(u) </span>
        <span className={TOKEN.op}>{'=>'}</span>{' '}
        <span className={TOKEN.fn}>activeUsers</span>
        <span className={TOKEN.plain}>(u).length</span>
      </>
    );
  }
  return <span> </span>;
}

// ---------------------------------------------------------------------------
// Chat + AI
// ---------------------------------------------------------------------------
export function ChatBubble({ show, compact = false }) {
  return (
    <Motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={show ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
      transition={{ duration: 0.45, ease: EASE }}
      className={`rounded-[10px] border p-2.5 ${compact ? 'text-[11px]' : 'text-[11.5px]'}`}
      style={{ background: PANEL.inset, borderColor: PANEL.rule }}
    >
      <span className="mb-1 flex items-center gap-1.5">
        <Avatar initial="A" name="Anurag" color="rose" size="sm" ring="ring-[#0C0F0C]" />
        <span className="font-mono text-[10.5px]" style={{ color: PANEL.dim }}>
          @anurag
        </span>
      </span>
      <p className="leading-[1.5]" style={{ color: PANEL.text }}>
        line 4&apos;s failing — every user comes back offline
      </p>
    </Motion.div>
  );
}

export function AiCard({ show, patched, compact = false }) {
  return (
    <Motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={show ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
      transition={{ duration: 0.45, ease: EASE }}
      className={`rounded-[10px] border p-2.5 ${compact ? 'text-[11px]' : 'text-[11.5px]'}`}
      style={{ background: PANEL.inset, borderColor: 'rgba(43,75,240,0.28)' }}
    >
      <span className="mb-1.5 flex items-center gap-1.5 font-mono text-[10.5px] text-[#8FA7F5]">
        <span aria-hidden="true">◈</span> Codio AI
      </span>
      <p className="leading-[1.5]" style={{ color: PANEL.text }}>
        <code className="font-mono text-[10.5px] text-[#A8B0A8]">online</code> isn&apos;t on the
        User model. Closest match:{' '}
        <code className="font-mono text-[10.5px] text-[#8FA7F5]">isOnline</code>.
      </p>
      <span className="mt-2 flex items-center gap-1.5">
        <span
          className={`rounded-full px-2 py-[3px] font-mono text-[10px] transition-colors duration-300 ${
            patched ? 'bg-[#1E2A1E] text-[#5E9E6E]' : 'bg-caret text-white'
          }`}
        >
          {patched ? '✓ Applied' : 'Apply fix'}
        </span>
        <span
          className="rounded-full px-2 py-[3px] font-mono text-[10px]"
          style={{ background: '#171B17', color: PANEL.dim }}
        >
          Explain
        </span>
      </span>
    </Motion.div>
  );
}

// ---------------------------------------------------------------------------
// Terminal
// ---------------------------------------------------------------------------
export function Terminal({ step, compact = false }) {
  const size = compact ? 'text-[10.5px]' : 'text-[11.5px]';

  return (
    <div
      className={`border-t px-4 py-3 font-mono leading-[1.75] ${size}`}
      style={{ borderColor: PANEL.rule, background: PANEL.inset }}
    >
      <Motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: step >= STEP.RUNNING ? 1 : 0 }}
        transition={{ duration: 0.25 }}
        style={{ color: PANEL.text }}
      >
        <span style={{ color: PANEL.dim }}>$</span> npm test
      </Motion.p>
      <Motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: step >= STEP.PASSED ? 1 : 0 }}
        transition={{ duration: 0.3, ease: EASE }}
        style={{ color: PANEL.pass }}
      >
        ✓ 8 passing <span style={{ color: PANEL.dim }}>· 412ms · exit 0</span>
      </Motion.p>
    </div>
  );
}
