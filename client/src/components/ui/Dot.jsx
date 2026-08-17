// The live indicator from the landing panel: a small dot with a slow ping.
// `tone` picks the semantic colour; the ping is suppressed under
// prefers-reduced-motion.
const TONES = {
  ok: 'bg-ok',
  accent: 'bg-accent',
  danger: 'bg-danger',
  muted: 'bg-muted',
};

export default function Dot({ tone = 'ok', pulse = true, className = '' }) {
  const fill = TONES[tone] ?? TONES.ok;

  return (
    <span className={`relative flex h-1.5 w-1.5 shrink-0 ${className}`} aria-hidden="true">
      {pulse ? (
        <span
          className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-60 motion-reduce:hidden ${fill}`}
        />
      ) : null}
      <span className={`relative inline-flex h-1.5 w-1.5 rounded-full ${fill}`} />
    </span>
  );
}
