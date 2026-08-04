import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import DoorIntro from './components/DoorIntro'
import Invitation from './components/Invitation'
import FloatingStrawberry from './components/FloatingStrawberry'

export default function App() {
  const [opened, setOpened] = useState(false)

  return (
    <div className="app">
      <AnimatePresence mode="wait">
        {!opened ? (
          <motion.div
            key="door"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <DoorIntro onOpen={() => setOpened(true)} />
          </motion.div>
        ) : (
          <motion.div
            key="invite"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <Invitation />
            <FloatingStrawberry />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
