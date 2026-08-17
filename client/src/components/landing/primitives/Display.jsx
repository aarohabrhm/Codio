// Fraunces, set as display type: optical sizing on, tight tracking, and the
// italic a full weight lighter than the roman so the second line reads as an
// aside rather than a continuation at the same volume.
//
// `flow="break"` (the default) puts the italic on its own line, which is what
// the headlines want. `flow="inline"` lets it pick up mid-sentence, which is
// what a running statement wants.
const SIZES = {
  d1: 'text-[clamp(2.6rem,6.1vw,4.5rem)] leading-[1.03] tracking-[-0.022em]',
  d2: 'text-[clamp(2rem,3.9vw,3.05rem)] leading-[1.08] tracking-[-0.022em]',
  d3: 'text-[clamp(1.5rem,2.4vw,1.9rem)] leading-[1.15] tracking-[-0.02em]',
};

export default function Display(props) {
  const {
    as: Tag = 'h2',
    size = 'd2',
    flow = 'break',
    roman,
    italic,
    id,
    className = '',
  } = props;

  return (
    <Tag
      id={id}
      className={`font-display font-normal text-ink text-balance [font-optical-sizing:auto] ${SIZES[size]} ${className}`}
    >
      {flow === 'break' ? <span className="block">{roman}</span> : roman}
      {italic ? (
        <>
          {flow === 'inline' ? ' ' : null}
          <em className={`font-light italic ${flow === 'break' ? 'block' : ''}`}>{italic}</em>
        </>
      ) : null}
    </Tag>
  );
}
