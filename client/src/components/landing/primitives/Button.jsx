import { Link } from 'react-router-dom';

// A 9px rounded rect in mono, not a pill. The dark variant turns caret blue on
// hover — the one place the accent moves into UI chrome.
const VARIANTS = {
  dark: 'bg-ink text-paper shadow-[0_1px_2px_rgba(0,0,0,0.18)] hover:bg-caret hover:-translate-y-px',
  ghost:
    'border border-ink/[0.13] bg-transparent text-ink hover:border-ink/[0.28] hover:bg-white/55',
  light: 'border border-ink/[0.08] bg-card text-ink hover:-translate-y-px hover:bg-white',
};

const SIZES = {
  sm: 'px-[13px] py-[9px] text-[11.5px]',
  md: 'px-[17px] py-[11px] text-[12.5px]',
};

const FOCUS =
  'focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-caret';

function Arrow() {
  return (
    <svg
      viewBox="0 0 12 12"
      fill="none"
      aria-hidden="true"
      className="h-3 w-3 shrink-0 transition-transform duration-200 group-hover:translate-x-[3px]"
    >
      <path
        d="M1 6h9M6.5 2.5 10 6l-3.5 3.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function Button({
  to,
  href,
  external = false,
  variant = 'dark',
  size = 'md',
  arrow = true,
  className = '',
  children,
}) {
  const cls = `group inline-flex items-center justify-center gap-[9px] whitespace-nowrap rounded-btn font-mono tracking-[0.02em] transition-[background-color,border-color,transform,box-shadow] duration-200 motion-reduce:transform-none ${VARIANTS[variant]} ${SIZES[size]} ${FOCUS} ${className}`;

  const inner = (
    <>
      {children}
      {arrow ? <Arrow /> : null}
    </>
  );

  if (to) {
    return (
      <Link to={to} className={cls}>
        {inner}
      </Link>
    );
  }

  return (
    <a
      href={href}
      className={cls}
      {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}
    >
      {inner}
    </a>
  );
}
