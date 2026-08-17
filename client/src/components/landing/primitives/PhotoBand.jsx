import bg from '../../../assets/Bg.png';
import { GRAIN } from './grain';

// The hero photograph again, cropped hard to a wide band. `focus` picks which
// horizontal slice of the scene survives the crop; the veil keeps the band
// light enough for ink type to sit on top of it.
export default function PhotoBand({ focus = '50% 30%', veil = 0.34, className = '' }) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    >
      <img
        src={bg}
        alt=""
        loading="lazy"
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover [filter:saturate(0.66)_contrast(0.92)_brightness(1.05)]"
        style={{ objectPosition: focus }}
      />

      {/* bone veil — the wordmark is near-black, so the band has to stay light */}
      <div className="absolute inset-0 bg-[#EFEFEA]" style={{ opacity: veil }} />

      {/* horizontal banding, the same device the CSS texture uses */}
      <div
        className="absolute inset-0 opacity-40"
        style={{
          background:
            'repeating-linear-gradient(to bottom, rgba(23,26,23,0.030) 0px, rgba(23,26,23,0.030) 1px, transparent 1px, transparent 3px)',
        }}
      />

      <div
        className="absolute inset-0 opacity-[0.08] mix-blend-multiply"
        style={{ backgroundImage: GRAIN, backgroundSize: '180px 180px' }}
      />
    </div>
  );
}
