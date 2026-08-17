// The mono uppercase section label from the landing page's product panel —
// EXPLORER, CHAT, RUNNING. Additive: it labels sections that previously used
// sans headings, and replaces nothing structurally.
export default function Label(props) {
  const { as: Tag = 'p', className = '', children } = props;

  return (
    <Tag
      className={`font-mono text-[10px] font-medium uppercase tracking-[0.08em] text-muted ${className}`}
    >
      {children}
    </Tag>
  );
}
