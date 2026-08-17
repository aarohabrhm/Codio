// A panel title bar in the language of the landing page's product panel:
// raised surface, hairline underneath, mono path on the left, status on the
// right. Additive chrome — it wraps existing panel headers, it doesn't
// replace any component.
export default function ChromeBar({ left, right, className = '', children }) {
  return (
    <div
      className={`flex h-10 shrink-0 items-center gap-3 border-b border-line bg-surface-raised px-3 ${className}`}
    >
      {left ? (
        <span className="flex min-w-0 items-center gap-2 font-mono text-[11.5px] text-primary">
          {left}
        </span>
      ) : null}
      {children}
      {right ? (
        <span className="ml-auto flex items-center gap-2 font-mono text-[11px] text-dim">
          {right}
        </span>
      ) : null}
    </div>
  );
}
