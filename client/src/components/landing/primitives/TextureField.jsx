import { GRAIN } from './grain';

// Paper and haze, built entirely from CSS — no photograph. The hero and footer
// bands now carry the real image; this is what the workspace band uses.

const WASH = {
  soft: 'radial-gradient(110% 80% at 22% 12%, rgba(120,124,116,0.16) 0%, rgba(120,124,116,0) 60%), radial-gradient(100% 85% at 84% 88%, rgba(90,96,88,0.10) 0%, rgba(90,96,88,0) 62%)',
  softFlip:
    'radial-gradient(120% 90% at 78% 8%, rgba(120,124,116,0.20) 0%, rgba(120,124,116,0) 62%), radial-gradient(90% 70% at 14% 84%, rgba(90,96,88,0.14) 0%, rgba(90,96,88,0) 58%)',
  deep: 'linear-gradient(to bottom, rgba(120,124,116,0.06) 0%, rgba(96,101,94,0.26) 62%, rgba(84,89,82,0.34) 100%), radial-gradient(140% 120% at 72% 100%, rgba(84,89,82,0.24) 0%, rgba(84,89,82,0) 66%)',
};

export default function TextureField({ className = '', flip = false, strength = 'soft' }) {
  const wash = strength === 'deep' ? WASH.deep : flip ? WASH.softFlip : WASH.soft;

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    >
      {/* radial washes, deliberately off-axis */}
      <div className="absolute inset-0" style={{ background: wash }} />
      {/* horizontal banding, just enough to break the flatness */}
      <div
        className={`absolute inset-0 ${strength === 'deep' ? 'opacity-60' : 'opacity-35'}`}
        style={{
          background:
            'repeating-linear-gradient(to bottom, rgba(23,26,23,0.030) 0px, rgba(23,26,23,0.030) 1px, transparent 1px, transparent 3px)',
        }}
      />
      {/* grain */}
      <div
        className={`absolute inset-0 mix-blend-multiply ${strength === 'deep' ? 'opacity-[0.09]' : 'opacity-[0.05]'}`}
        style={{ backgroundImage: GRAIN, backgroundSize: '180px 180px' }}
      />
    </div>
  );
}
