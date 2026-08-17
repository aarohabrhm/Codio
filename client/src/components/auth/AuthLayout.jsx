import { ArrowRight, ChevronLeft } from "lucide-react";
import Mark from "../landing/primitives/Mark";
import PhotoBand from "../landing/primitives/PhotoBand";
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
} from "../landing/panelParts";
import { PANEL } from "../landing/panelTokens";
import { STEP, TOTAL_CHARS } from "../landing/useHeroSequence";

// The showcase side is the landing page's product panel, held at its final
// frame. Same components, no timers — a login screen shouldn't run an
// eight-second animation while someone is typing a password.
function RestingPanel() {
  return (
    <div
      className="w-full max-w-[420px] overflow-hidden rounded-panel shadow-[0_40px_80px_-40px_rgba(0,0,0,0.6)]"
      style={{ background: PANEL.face }}
      role="img"
      aria-label="A Codio workspace with three people in one file: the line is patched to isOnline, chat and AI agree on the fix, and the terminal reports eight tests passing."
    >
      <div
        className="flex h-10 items-center gap-3 border-b px-3"
        style={{ borderColor: PANEL.rule, background: PANEL.chrome }}
      >
        <Dots />
        <span className="font-mono text-[11px]" style={{ color: PANEL.text }}>
          users.js
        </span>
        <span
          className="ml-auto flex items-center gap-1.5 font-mono text-[10.5px]"
          style={{ color: PANEL.dim }}
        >
          <LiveDot />3 in this file
        </span>
        <PresenceStack />
      </div>

      <div className="overflow-hidden px-3 pb-1 pt-3 font-mono text-[10.5px] leading-[1.85]">
        {[3, 4, 5].map((n) => (
          <p key={n} className="whitespace-pre">
            <Gutter n={n} compact />
            {n === 4 ? (
              <Line4 typed={TOTAL_CHARS} patched caret indent={false} flash={false} />
            ) : (
              <StaticLine n={n} />
            )}
          </p>
        ))}
      </div>

      <div className="flex flex-col gap-2 px-3 pb-3 pt-2">
        <ChatBubble show compact />
        <AiCard show patched compact />
      </div>

      <Terminal step={STEP.DONE} compact />
    </div>
  );
}

export default function AuthLayout({
  children,
  showBackButton,
  onBack,
  eyebrow,
  title,
  titleItalic,
  subtitle,
}) {
  return (
    <div className="min-h-screen bg-surface-page flex">
      {/* Left — the form, in the landing page's editorial voice */}
      <div className="relative z-10 flex w-full flex-col lg:w-1/2">
        <div className="flex flex-1 items-center justify-center p-6 lg:p-12">
          <div className="w-full max-w-md">
            <a
              href="/"
              className="mb-12 inline-flex items-center gap-2.5 rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
            >
              <Mark className="h-6" />
              <span className="font-display text-[1.22rem] leading-none tracking-[-0.02em] text-primary [font-optical-sizing:auto]">
                Codio
              </span>
            </a>

            {eyebrow ? (
              <p className="mb-5 flex w-fit items-center gap-[9px] font-mono text-[11px] uppercase tracking-[0.14em] text-dim">
                <span
                  aria-hidden="true"
                  className="block h-3 w-[7px] shrink-0 rounded-[1px] bg-accent animate-caret motion-reduce:animate-none"
                />
                {eyebrow}
              </p>
            ) : null}

            <h1 className="font-display text-[clamp(2rem,3.4vw,2.7rem)] leading-[1.06] tracking-[-0.022em] text-primary [font-optical-sizing:auto]">
              <span className="block">{title || "Write code together,"}</span>
              {titleItalic ? (
                <em className="block font-light italic">{titleItalic}</em>
              ) : null}
            </h1>

            {subtitle && (
              <p className="mt-4 leading-[1.6] text-dim">{subtitle}</p>
            )}

            <div className="mt-9">{children}</div>

            <p className="mt-8 font-mono text-[11px] leading-[1.7] text-muted">
              By continuing, you agree to our{" "}
              <a href="#" className="text-dim underline underline-offset-2 transition-colors hover:text-primary">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="text-dim underline underline-offset-2 transition-colors hover:text-primary">
                Privacy Policy
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Right — the photograph from the landing hero, with the panel on it */}
      <div className="relative hidden w-1/2 overflow-hidden border-l border-line lg:flex">
        <PhotoBand focus="50% 42%" veil={0.2} />
        {/* the meadow is bright; sink it behind the panel on the dark theme */}
        <div aria-hidden="true" className="absolute inset-0 bg-transparent dark:bg-black/45" />

        <div className="relative z-10 flex w-full items-center justify-center p-12">
          <RestingPanel />
        </div>
      </div>
    </div>
  );
}

// Reusable Input Component
export function AuthInput({
  icon: Icon,
  type = "text",
  name,
  value,
  onChange,
  placeholder,
  required = true,
  rightElement
}) {
  return (
    <div className="relative group">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <Icon className="h-4 w-4 text-muted group-focus-within:text-accent-fg transition-colors" />
      </div>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full pl-11 pr-11 py-3 bg-surface-panel border border-line-strong rounded-field text-[14px] text-primary placeholder-muted focus:outline-none focus:border-accent transition-colors duration-200"
        placeholder={placeholder}
        required={required}
      />
      {rightElement && (
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
          {rightElement}
        </div>
      )}
    </div>
  );
}

// Primary Button — the landing page's dark pill, in mono
export function PrimaryButton({ children, loading, disabled, type = "submit", onClick }) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={loading || disabled}
      className={`group w-full py-3 px-4 bg-accent text-accent-on font-mono text-[12.5px] tracking-[0.02em] rounded-field flex items-center justify-center gap-[9px] transition-all duration-200 hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-accent ${
        loading || disabled ? "opacity-70 cursor-not-allowed" : ""
      }`}
    >
      {loading ? (
        <div className="w-4 h-4 border-2 border-white/25 border-t-white rounded-full animate-spin" />
      ) : (
        <>
          {children}
          <ArrowRight size={14} className="transition-transform duration-200 group-hover:translate-x-[3px]" />
        </>
      )}
    </button>
  );
}

// Secondary Button — the landing page's ghost button
export function SecondaryButton({ children, onClick, type = "button" }) {
  return (
    <button
      type={type}
      onClick={onClick}
      className="w-full py-3 px-4 bg-transparent border border-line-strong text-dim hover:text-primary hover:border-accent font-mono text-[12.5px] tracking-[0.02em] rounded-field flex items-center justify-center gap-[9px] transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-accent"
    >
      <ChevronLeft size={14} />
      {children}
    </button>
  );
}

// Link Button
export function LinkButton({ children, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-dim hover:text-primary text-sm transition-colors flex items-center justify-center gap-1"
    >
      {children}
    </button>
  );
}

// Message Component
export function AuthMessage({ type, message }) {
  if (!message) return null;

  const styles = {
    success: "border-ok/40 text-ok",
    error: "border-danger/40 text-danger",
    info: "border-accent/40 text-accent-fg",
  };

  return (
    <div className={`p-3 rounded-field border bg-surface-panel font-mono text-[12px] text-center ${styles[type]}`}>
      {message}
    </div>
  );
}
