import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';

// The eight seconds that carry the whole product. One orchestrated pass, then
// it holds — no loop. Under prefers-reduced-motion nothing is scheduled at
// all; the finished frame renders immediately.

export const STEP = {
  IDLE: 0,
  CARET: 1, // @aaroh's caret appears on line 4
  TYPING: 2, // they type the line, character by character
  CHAT: 3, // @anurag points at the bug
  AI: 4, // Codio AI proposes the fix
  PATCHED: 5, // online -> isOnline, with a decaying highlight
  RUNNING: 6, // $ npm test
  PASSED: 7, // 8 passing, exit 0
  DONE: 8,
};

// Line 4, pre-tokenised. Typing reveals characters across the flattened run.
export const LINE_TOKENS = [
  { t: '  ', c: 'plain' },
  { t: 'return', c: 'kw' },
  { t: ' users.', c: 'plain' },
  { t: 'filter', c: 'fn' },
  { t: '(u ', c: 'plain' },
  { t: '=>', c: 'op' },
  { t: ' u.', c: 'plain' },
  { t: 'online', c: 'prop', bug: true },
  { t: ')', c: 'plain' },
];

export const TOTAL_CHARS = LINE_TOKENS.reduce((n, tok) => n + tok.t.length, 0);

const MARKS = [
  [800, STEP.CARET],
  [1000, STEP.TYPING],
  [3400, STEP.CHAT],
  [4400, STEP.AI],
  [5400, STEP.PATCHED],
  [6000, STEP.RUNNING],
  [6900, STEP.PASSED],
  [7600, STEP.DONE],
];

const TYPE_START = 1000;
const TYPE_DURATION = 2200;

export default function useHeroSequence({ scale = 1 } = {}) {
  const reduced = useReducedMotion();
  const [step, setStep] = useState(reduced ? STEP.DONE : STEP.IDLE);
  const [typed, setTyped] = useState(reduced ? TOTAL_CHARS : 0);
  const timers = useRef([]);

  useEffect(() => {
    if (reduced) {
      setStep(STEP.DONE);
      setTyped(TOTAL_CHARS);
      return undefined;
    }

    setStep(STEP.IDLE);
    setTyped(0);

    MARKS.forEach(([at, next]) => {
      timers.current.push(setTimeout(() => setStep(next), at * scale));
    });

    const perChar = (TYPE_DURATION * scale) / TOTAL_CHARS;
    timers.current.push(
      setTimeout(() => {
        let n = 0;
        const id = setInterval(() => {
          n += 1;
          setTyped(n);
          if (n >= TOTAL_CHARS) clearInterval(id);
        }, perChar);
        timers.current.push(id);
      }, TYPE_START * scale),
    );

    const scheduled = timers.current;
    return () => {
      scheduled.forEach(clearTimeout);
      scheduled.forEach(clearInterval);
      timers.current = [];
    };
  }, [reduced, scale]);

  return { step, typed, reduced, done: step >= STEP.DONE };
}
