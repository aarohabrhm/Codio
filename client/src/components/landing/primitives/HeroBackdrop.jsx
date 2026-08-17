import bg from '../../../assets/Bg.png';
import { GRAIN } from './grain';

// The photograph sits behind the whole hero but is only exposed in a band
// around the product panel. Above it, a solid paper wash keeps the headline's
// contrast; below it, paper returns so the section hands off to About without
// a seam. Percentages are tuned to the hero's real proportions: the buttons
// end at ~43% and the panel spans ~52-88% of the section height.

export default function HeroBackdrop() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <img
        src={bg}
        alt=""
        fetchPriority="high"
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover object-bottom [filter:saturate(0.72)_contrast(0.95)_brightness(1.03)]"
      />

      {/* a thin bone tint so the photograph sits at the page's temperature */}
      <div className="absolute inset-0 bg-[#EFEFEA]/15" />

      {/* top: solid under the type, fully clear by the time the panel starts */}
      <div className="absolute inset-x-0 top-0 h-[46%] bg-[linear-gradient(to_bottom,#EFEFEA_0%,#EFEFEA_64%,rgba(239,239,234,0.82)_80%,rgba(239,239,234,0)_100%)]" />

      {/* bottom: paper resumes before the panel ends, so the panel crosses the
          photograph's edge instead of sitting entirely on top of it */}
      <div className="absolute inset-x-0 bottom-0 h-[34%] bg-[linear-gradient(to_bottom,rgba(239,239,234,0)_0%,rgba(239,239,234,0.55)_30%,#EFEFEA_62%,#EFEFEA_100%)]" />

      {/* the same grain the footer band uses, so the photo reads as page material */}
      <div
        className="absolute inset-0 opacity-[0.07] mix-blend-multiply"
        style={{ backgroundImage: GRAIN, backgroundSize: '180px 180px' }}
      />
    </div>
  );
}
