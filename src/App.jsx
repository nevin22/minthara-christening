import { useState } from 'react'
import DoorIntro from './components/DoorIntro'
import Invitation from './components/Invitation'
import FloatingStrawberry from './components/FloatingStrawberry'

export default function App() {
  const [opened, setOpened] = useState(false)

  if (!opened) {
    return (
      <div className="app">
        <DoorIntro onOpen={() => setOpened(true)} />
      </div>
    )
  }

  return (
    <div className="app">
      <Invitation />
      <FloatingStrawberry />
    </div>
  )
}
