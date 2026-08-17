import Container from './Container';

// Owns every section's band colour and vertical padding, so no section
// component sets its own — that is where specificity collisions come from.
const BANDS = {
  paper: 'bg-paper',
  linen: 'bg-linen',
  none: '',
};

const PADS = {
  none: '',
  tight: 'py-8 md:py-14',
  normal: 'py-14 md:py-28',
  loose: 'py-16 md:py-36',
};

export default function Section({
  id,
  band = 'paper',
  pad = 'normal',
  labelledBy,
  className = '',
  containerClassName = '',
  bare = false,
  children,
}) {
  const shell = `relative ${BANDS[band]} ${PADS[pad]} ${className}`;

  return (
    <section id={id} aria-labelledby={labelledBy} className={shell}>
      {bare ? children : <Container className={containerClassName}>{children}</Container>}
    </section>
  );
}
