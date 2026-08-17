import { motion, useReducedMotion } from 'framer-motion';

// Quiet scroll reveal: short distance, soft easing, staggered. The page is
// calm and the motion should be too.
const EASE = [0.22, 0.61, 0.36, 1];

export default function Reveal({
  as = 'div',
  delay = 0,
  y = 14,
  className = '',
  children,
  ...rest
}) {
  const reduced = useReducedMotion();
  const MotionTag = motion[as] ?? motion.div;

  if (reduced) {
    const Tag = as;
    return (
      <Tag className={className} {...rest}>
        {children}
      </Tag>
    );
  }

  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-12% 0px' }}
      transition={{ duration: 0.55, ease: EASE, delay }}
      {...rest}
    >
      {children}
    </MotionTag>
  );
}
