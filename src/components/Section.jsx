import { motion, useReducedMotion } from 'framer-motion'

export default function Section({ id, className = '', children }) {
  const reduceMotion = useReducedMotion()

  return (
    <motion.section
      id={id}
      className={`section ${className}`}
      initial={reduceMotion ? false : { opacity: 0, y: 20 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15, margin: '0px 0px -10% 0px' }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.section>
  )
}
