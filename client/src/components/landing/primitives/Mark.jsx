import logo from '../../../assets/logo.png';

// The Codio mark. Decorative by default: it always sits beside the "Codio"
// wordmark, so announcing it again would just repeat the name. Callers set the
// height; width follows the glyph's own 1304x1206 proportion.
export default function Mark({ className = '', onDark = false, alt = '' }) {
  return (
    <img
      src={logo}
      alt={alt}
      aria-hidden={alt ? undefined : 'true'}
      className={`w-auto shrink-0 object-contain ${onDark ? 'invert' : ''} ${className}`}
    />
  );
}
