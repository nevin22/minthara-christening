import { motion } from 'framer-motion'

export default function DoorIntro({ onOpen }) {
  return (
    <div className="door-screen">
      <div className="door-screen__glow" aria-hidden="true" />
      <motion.div
        className="door-screen__content"
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        <p className="door-screen__eyebrow">You&apos;re invited to</p>
        <h1 className="door-screen__brand">Minthara Ellise Christening</h1>
        <p className="door-screen__hint">Tap the door to open her invitation</p>

        <motion.button
          type="button"
          className="door-btn"
          onClick={onOpen}
          aria-label="Click here to open the invitation"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <motion.div
            className="door-btn__float"
            animate={{ y: [0, -6, 0] }}
            transition={{
              duration: 2.4,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <img
              className="door-btn__art"
              src="/invitation-door.png"
              alt=""
              width={280}
              height={280}
              draggable="false"
            />
            <span className="door-btn__label">Click here</span>
          </motion.div>
        </motion.button>
      </motion.div>
    </div>
  )
}
