import { ArrowRight, ChevronLeft, Code2, Sparkles, Zap, UsersRound } from "lucide-react";
import codioLogo from "../../assets/logo.png";

// Matrix-like background characters
const MatrixBackground = () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*";
  const rows = 20;
  const cols = 30;

  return (
    <div className="absolute inset-0 overflow-hidden opacity-[0.04] select-none pointer-events-none">
      <div className="font-mono text-xs leading-relaxed text-primary whitespace-pre">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex justify-around">
            {Array.from({ length: cols }).map((_, j) => (
              <span key={j} className="px-1">
                {chars[Math.floor(Math.random() * chars.length)]}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

// Stats display
const StatsSection = () => (
  <div className="flex items-center justify-center gap-8 mt-8">
    <div className="text-center">
      <div className="font-mono text-2xl font-semibold text-primary">10K+</div>
      <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.08em] text-muted">Users</div>
    </div>
    <div className="w-px h-8 bg-line-strong" />
    <div className="text-center">
      <div className="font-mono text-2xl font-semibold text-primary">50K+</div>
      <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.08em] text-muted">Projects</div>
    </div>
    <div className="w-px h-8 bg-line-strong" />
    <div className="text-center">
      <div className="font-mono text-2xl font-semibold text-primary">99%</div>
      <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.08em] text-muted">Uptime</div>
    </div>
  </div>
);

// Feature showcase card
const ShowcaseCard = () => (
  <div className="relative w-full max-w-md rounded-surface overflow-hidden bg-surface-panel border border-line shadow-[0_28px_56px_-36px_rgba(0,0,0,0.6)]">
    {/* Header bar */}
    <div className="flex items-center justify-between px-4 py-3 border-b border-line bg-surface-raised">
      <span className="font-mono text-[11.5px] text-dim">codio / workspace</span>
      <span className="flex items-center gap-1.5 font-mono text-[11px] text-ok">
        <span className="h-1.5 w-1.5 rounded-full bg-ok" />
        Live
      </span>
    </div>

    {/* Content — sits above the decorative lines below */}
    <div className="relative z-10 p-8 text-center">
      <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 font-mono text-[11px] rounded-full border border-line text-accent-fg">
        <Sparkles size={12} />
        AI-Powered Development
      </div>

      <h3 className="font-display text-3xl leading-[1.08] tracking-[-0.02em] text-primary mb-3 [font-optical-sizing:auto]">
        Code smarter,<br /><em className="font-light italic">ship faster.</em>
      </h3>

      <p className="text-dim text-sm mb-6 max-w-xs mx-auto leading-[1.6]">
        Your intelligent coding companion with real-time AI assistance, smart completions, and seamless collaboration.
      </p>

      <div className="flex items-center justify-center gap-3">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-surface-raised border border-line rounded-field font-mono text-[11px] text-dim">
          <Code2 size={14} className="text-accent-fg" />
          Multi-language
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-surface-raised border border-line rounded-field font-mono text-[11px] text-dim">
          <Zap size={14} className="text-accent-fg" />
          Lightning fast
        </div>
      </div>
    </div>

    {/* Decorative gradient lines */}
    <div className="absolute bottom-0 left-0 right-0 z-0 h-32 opacity-70 pointer-events-none">
      <svg className="w-full h-full" viewBox="0 0 400 100" preserveAspectRatio="none">
        <path
          d="M0,50 Q100,20 200,50 T400,50"
          fill="none"
          stroke="url(#gradient1)"
          strokeWidth="1"
          opacity="0.5"
        />
        <path
          d="M0,60 Q100,90 200,60 T400,60"
          fill="none"
          stroke="url(#gradient2)"
          strokeWidth="1"
          opacity="0.3"
        />
        <defs>
          <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--accent-fg)" />
            <stop offset="100%" stopColor="var(--ok)" />
          </linearGradient>
          <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--ok)" />
            <stop offset="100%" stopColor="var(--accent-fg)" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  </div>
);

export default function AuthLayout({ children, showBackButton, onBack, title, subtitle }) {
  return (
    <div className="min-h-screen bg-surface-page flex">
      {/* Matrix Background */}
      <MatrixBackground />

      {/* Left Side - Form */}
      <div className="relative z-10 w-full lg:w-1/2 flex flex-col min-h-screen">
        {/* Form Container */}
        <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
          <div className="w-full max-w-md">
            {/* Logo */}
            <div className="flex flex-col items-center mb-8">
              <div className="w-16 h-16 mb-4 rounded-surface bg-surface-panel border border-line flex items-center justify-center">
                {/* the mark is a solid dark glyph — invert it on the terminal surface */}
                <img src={codioLogo} alt="Codio" className="w-9 h-9 object-contain dark:invert" />
              </div>

              {/* Title */}
              <h1 className="font-display text-3xl lg:text-4xl leading-[1.06] tracking-[-0.022em] text-primary text-center [font-optical-sizing:auto]">
                {title || (
                  <>
                    Build full-stack apps<br />
                    <em className="font-light italic">in minutes.</em>
                  </>
                )}
              </h1>

              {subtitle && (
                <p className="mt-3 text-dim text-center leading-[1.6]">{subtitle}</p>
              )}
            </div>

            {/* Form Content */}
            {children}

            {/* Terms */}
            <p className="mt-8 font-mono text-[11px] text-muted text-center leading-[1.7]">
              By continuing, you agree to our{" "}
              <a href="#" className="text-dim hover:text-primary underline underline-offset-2 transition-colors">Terms of Service</a>
              {" "}and{" "}
              <a href="#" className="text-dim hover:text-primary underline underline-offset-2 transition-colors">Privacy Policy</a>
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Showcase (hidden on mobile) */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden border-l border-line">
        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center w-full p-12">
          {/* Trust badge */}
          <div className="flex items-center gap-2 mb-8 px-4 py-2 bg-surface-panel rounded-full border border-line">
            <div className="flex -space-x-2">
              <UsersRound size={15} className="text-dim" />
            </div>
            <span className="font-mono text-[11.5px] text-dim">Trusted by 10K+ Developers</span>
          </div>

          {/* Showcase Card */}
          <ShowcaseCard />

          {/* Stats */}
          <StatsSection />
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
        <Icon className="h-4.5 w-4.5 text-muted group-focus-within:text-accent-fg transition-colors" />
      </div>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full pl-12 pr-12 py-3.5 bg-surface-panel border border-line-strong rounded-field text-primary placeholder-muted focus:outline-none focus:border-accent focus:bg-surface-raised transition-all duration-200"
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

// Primary Button
export function PrimaryButton({ children, loading, disabled, type = "submit", onClick }) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={loading || disabled}
      className={`w-full py-3.5 px-4 bg-accent hover:brightness-110 text-accent-on font-mono text-[13px] tracking-[0.02em] rounded-field flex items-center justify-center gap-2 transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
        loading || disabled ? "opacity-70 cursor-not-allowed" : ""
      }`}
    >
      {loading ? (
        <div className="w-5 h-5 border-2 border-white/25 border-t-white rounded-full animate-spin" />
      ) : (
        <>
          {children}
          <ArrowRight size={16} />
        </>
      )}
    </button>
  );
}

// Secondary Button
export function SecondaryButton({ children, onClick, type = "button" }) {
  return (
    <button
      type={type}
      onClick={onClick}
      className="w-full py-3.5 px-4 bg-surface-panel hover:bg-surface-hover text-dim hover:text-primary font-mono text-[13px] tracking-[0.02em] rounded-field flex items-center justify-center gap-2 border border-line-strong transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
    >
      <ChevronLeft size={16} />
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
