import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import DoorIntro from './components/DoorIntro'
import Invitation from './components/Invitation'

export default function App() {
  const [opened, setOpened] = useState(false)

  return (
    <div className="app">
      <AnimatePresence mode="wait">
        {!opened ? (
          <motion.div
            key="door"
            exit={{ opacity: 0, scale: 1.04 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          >
            <DoorIntro onOpen={() => setOpened(true)} />
          </motion.div>
        ) : (
          <motion.div
            key="invite"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <Invitation />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
