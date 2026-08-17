import { PRESENCE } from './presence';

const SIZES = {
  sm: 'h-6 w-6 text-[10px]',
  md: 'h-8 w-8 text-[11px]',
};

export default function Avatar({
  initial,
  name,
  color = 'caret',
  size = 'sm',
  ring = 'ring-[#101310]',
  className = '',
}) {
  const c = PRESENCE[color] ?? PRESENCE.caret;

  return (
    <span
      title={name}
      className={`inline-flex items-center justify-center rounded-full font-mono font-medium ring-2 ${ring} ${c.bg} ${c.text} ${SIZES[size]} ${className}`}
    >
      {initial}
    </span>
  );
}
