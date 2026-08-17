// Soft card. Surface is band-aware: #F6F6F2 on linen bands, paper on paper.
const SURFACES = {
  linen: 'bg-card',
  paper: 'bg-paper',
};

export default function Card(props) {
  const { as: Tag = 'div', on = 'linen', className = '', children } = props;

  return (
    <Tag
      className={`rounded-card border border-ink/[0.08] ${SURFACES[on]} ${className}`}
    >
      {children}
    </Tag>
  );
}
