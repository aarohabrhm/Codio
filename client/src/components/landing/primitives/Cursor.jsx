import { PRESENCE } from './presence';

// A collaborator's caret with its name tag.
export default function Cursor({ color = 'amber', name, className = '' }) {
  const c = PRESENCE[color] ?? PRESENCE.amber;

  return (
    <span
      className={`pointer-events-none relative inline-block align-middle ${className}`}
      aria-hidden="true"
    >
      <span
        className="inline-block w-[2px] align-middle"
        style={{ background: c.raw, height: '1.15em' }}
      />
      {/* The tag sits beside the caret rather than above it: at editor
          line-heights an above-caret tag lands on the previous line of code. */}
      {name ? (
        <span
          className={`absolute left-[5px] top-1/2 -translate-y-1/2 whitespace-nowrap rounded-[4px] px-1.5 py-[2px] font-mono text-[10px] font-medium leading-none ${c.bg} ${c.text}`}
        >
          {name}
        </span>
      ) : null}
    </span>
  );
}
