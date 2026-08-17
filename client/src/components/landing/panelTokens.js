// Dark-panel internals. These live here rather than in the Tailwind theme:
// they are one surface's private vocabulary, not part of the page palette.
export const PANEL = {
  face: '#101310',
  chrome: '#161A16',
  inset: '#0C0F0C',
  rule: 'rgba(255,255,255,0.08)',
  dim: '#8B938B',
  text: '#C9CFC9',
  pass: '#5E9E6E', // status only: the live dot and a passing run
};

// Near-monochrome syntax. Amber and rose are presence colours and never appear
// here; the one tinted token is drawn from the caret blue family.
export const TOKEN = {
  plain: 'text-[#C9CFC9]',
  kw: 'text-[#EFEFEA]',
  fn: 'text-[#8FA7F5]',
  op: 'text-[#6E766E]',
  prop: 'text-[#A8B0A8]',
  com: 'text-[#5E665E] italic',
};

export const EASE = [0.22, 0.61, 0.36, 1];

// What a screen reader gets instead of a soup of tokenised spans.
export const PANEL_STORY =
  'A Codio workspace with three people in one file. A teammate, @aaroh, types line 4 of users.js. @anurag messages that the line is failing because every user comes back offline. Codio AI points out that the property online is not on the User model and suggests isOnline. The fix is applied and the terminal below reports eight tests passing in 412 milliseconds with exit code 0.';
