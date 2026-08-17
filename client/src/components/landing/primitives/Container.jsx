// The single source of horizontal rhythm on the page. Nothing else sets its
// own max-width or page gutter.
export default function Container(props) {
  const { as: Tag = 'div', className = '', children } = props;

  return (
    <Tag className={`mx-auto w-full max-w-[1180px] px-6 md:px-8 ${className}`}>
      {children}
    </Tag>
  );
}
