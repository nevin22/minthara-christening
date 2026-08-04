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
        <p className="door-screen__eyebrow">You&apos;re invited</p>
        <h1 className="door-screen__brand">Minthara Elise</h1>
        <p className="door-screen__hint">Tap the door to open her invitation</p>

        <motion.button
          type="button"
          className="door-btn"
          onClick={onOpen}
          aria-label="Click here to open the invitation"
          whileHover={{ scale: 1.03, y: -4 }}
          whileTap={{ scale: 0.98 }}
          animate={{ y: [0, -6, 0] }}
          transition={{
            y: { duration: 2.4, repeat: Infinity, ease: 'easeInOut' },
          }}
        >
          <svg
            className="door-btn__art"
            viewBox="0 0 160 220"
            role="img"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="doorFace" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#FF8FAB" />
                <stop offset="100%" stopColor="#E63956" />
              </linearGradient>
            </defs>
            <rect
              x="18"
              y="12"
              width="124"
              height="196"
              rx="14"
              fill="url(#doorFace)"
              stroke="#9B2340"
              strokeWidth="4"
            />
            <rect
              x="34"
              y="32"
              width="40"
              height="52"
              rx="6"
              fill="#FFE5EC"
              opacity="0.85"
            />
            <rect
              x="86"
              y="32"
              width="40"
              height="52"
              rx="6"
              fill="#FFE5EC"
              opacity="0.85"
            />
            <rect
              x="34"
              y="104"
              width="92"
              height="78"
              rx="8"
              fill="#FFB3C1"
              opacity="0.9"
            />
            <circle cx="118" cy="140" r="8" fill="#FFD166" stroke="#9B2340" strokeWidth="2" />
            <path
              d="M40 18 C70 2 90 2 120 18"
              fill="none"
              stroke="#FFF5F7"
              strokeWidth="3"
              strokeLinecap="round"
              opacity="0.7"
            />
          </svg>
          <span className="door-btn__label">Click here</span>
        </motion.button>
      </motion.div>
    </div>
  )
}
