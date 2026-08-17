// Every section label is preceded by a blinking text cursor. It is the one
// ornament on the page, and it is the product's own instrument rather than a
// decorative bullet.
export default function Eyebrow({ children, className = '' }) {
  return (
    <p
      className={`inline-flex items-center gap-[9px] font-mono text-[11px] uppercase tracking-[0.14em] text-graphite ${className}`}
    >
      <span
        aria-hidden="true"
        className="block h-3 w-[7px] shrink-0 rounded-[1px] bg-caret animate-caret motion-reduce:animate-none"
      />
      {children}
    </p>
  );
}
