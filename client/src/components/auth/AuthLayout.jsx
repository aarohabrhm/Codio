import { ArrowRight, ChevronLeft, Code2, Sparkles, Zap, UsersRound } from "lucide-react";
import codioLogo from "../../assets/logo.png";

// Matrix-like background characters
const MatrixBackground = () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*";
  const rows = 20;
  const cols = 30;
  
  return (
    <div className="absolute inset-0 overflow-hidden opacity-[0.03] select-none pointer-events-none">
      <div className="font-mono text-xs leading-relaxed text-white whitespace-pre">
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
      <div className="text-2xl font-bold text-white">10K+</div>
      <div className="text-xs text-gray-400">Users</div>
    </div>
    <div className="w-px h-8 bg-gray-700" />
    <div className="text-center">
      <div className="text-2xl font-bold text-white">50K+</div>
      <div className="text-xs text-gray-400">Projects</div>
    </div>
    <div className="w-px h-8 bg-gray-700" />
    <div className="text-center">
      <div className="text-2xl font-bold text-white">99%</div>
      <div className="text-xs text-gray-400">Uptime</div>
    </div>
  </div>
);

// Feature showcase card
const ShowcaseCard = () => (
  <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-gray-900/80 to-black/80 border border-gray-700/50 backdrop-blur-xl">
    {/* Header bar */}
    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700/50">
      <span className="text-sm text-gray-400">codio</span>
      <div className="flex items-center gap-2">
        <span className="px-2 py-0.5 text-xs bg-emerald-500/20 text-emerald-400 rounded-full">
          ● Live
        </span>
      </div>
    </div>
    
    {/* Content */}
    <div className="p-8 text-center">
      <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 text-xs bg-emerald-500/10 text-emerald-400 rounded-full border border-emerald-500/20">
        <Sparkles size={12} />
        AI-Powered Development
      </div>
      
      <h3 className="text-3xl font-bold text-white mb-3">
        Code Smarter,<br />Ship Faster
      </h3>
      
      <p className="text-gray-400 text-sm mb-6 max-w-xs mx-auto">
        Your intelligent coding companion with real-time AI assistance, smart completions, and seamless collaboration.
      </p>
      
      <div className="flex items-center justify-center gap-3">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-800/50 rounded-lg text-xs text-gray-300">
          <Code2 size={14} className="text-cyan-400" />
          Multi-language
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-800/50 rounded-lg text-xs text-gray-300">
          <Zap size={14} className="text-yellow-400" />
          Lightning fast
        </div>
      </div>
    </div>
    
    {/* Decorative gradient lines */}
    <div className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none">
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
            <stop offset="0%" stopColor="#06b6d4" />
            <stop offset="100%" stopColor="#10b981" />
          </linearGradient>
          <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  </div>
);

export default function AuthLayout({ children, showBackButton, onBack, title, subtitle }) {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex">
      {/* Matrix Background */}
      <MatrixBackground />
      
      {/* Left Side - Form */}
      <div className="relative z-10 w-full lg:w-1/2 flex flex-col min-h-screen">
        {/* Form Container */}
        <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
          <div className="w-full max-w-md">
            {/* Logo */}
            <div className="flex flex-col items-center mb-8">
              <div className="w-16 h-16 mb-4 rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700/50 flex items-center justify-center">
                <img src={codioLogo} alt="Codio" className="w-10 h-10" />
              </div>
              
              {/* Title */}
              <h1 className="text-2xl lg:text-3xl font-bold text-white text-center">
                {title || (
                  <>
                    Build Full-Stack<br />
                    <span className="bg-gradient-to-r from-cyan-400 via-emerald-400 to-green-400 bg-clip-text text-transparent">
                      Web & Mobile Apps
                    </span>{" "}
                    in minutes
                  </>
                )}
              </h1>
              
              {subtitle && (
                <p className="mt-2 text-gray-400 text-center">{subtitle}</p>
              )}
            </div>
            
            {/* Form Content */}
            {children}
            
            {/* Terms */}
            <p className="mt-8 text-xs text-gray-500 text-center">
              By continuing, you agree to our{" "}
              <a href="#" className="text-gray-400 hover:text-white underline">Terms of Service</a>
              {" "}and{" "}
              <a href="#" className="text-gray-400 hover:text-white underline">Privacy Policy</a>
            </p>
          </div>
        </div>
      </div>
      
      {/* Right Side - Showcase (hidden on mobile) */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden">
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-emerald-500/5" />
        
        {/* Cloud/sky gradient at top */}
        <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-slate-400/10 to-transparent" />
        
        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center w-full p-12">
          {/* Trust badge */}
          <div className="flex items-center gap-2 mb-8 px-4 py-2 bg-gray-900/50 backdrop-blur-sm rounded-full border border-gray-700/50">
            <div className="flex -space-x-2">
              <UsersRound size={15}/>
            </div>
            <span className="text-sm text-gray-300">Trusted by 10K+ Developers</span>
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
        <Icon className="h-5 w-5 text-gray-500 group-focus-within:text-gray-400 transition-colors" />
      </div>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full pl-12 pr-12 py-3.5 bg-[#141414] border border-gray-800 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-gray-600 focus:bg-[#1a1a1a] transition-all duration-200"
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
      className={`w-full py-3.5 px-4 bg-white hover:bg-gray-100 text-black font-semibold rounded-xl flex items-center justify-center gap-2 transition-all duration-200 ${
        loading || disabled ? "opacity-70 cursor-not-allowed" : ""
      }`}
    >
      {loading ? (
        <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
      ) : (
        <>
          {children}
          <ArrowRight size={18} />
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
      className="w-full py-3.5 px-4 bg-[#141414] hover:bg-[#1a1a1a] text-gray-300 font-medium rounded-xl flex items-center justify-center gap-2 border border-gray-800 transition-all duration-200"
    >
      <ChevronLeft size={18} />
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
      className="text-gray-400 hover:text-white text-sm transition-colors flex items-center justify-center gap-1"
    >
      {children}
    </button>
  );
}

// Message Component
export function AuthMessage({ type, message }) {
  if (!message) return null;
  
  const styles = {
    success: "bg-emerald-500/10 border-emerald-500/30 text-emerald-400",
    error: "bg-red-500/10 border-red-500/30 text-red-400",
    info: "bg-cyan-500/10 border-cyan-500/30 text-cyan-400",
  };
  
  return (
    <div className={`p-3 rounded-xl border text-sm text-center ${styles[type]}`}>
      {message}
    </div>
  );
}
