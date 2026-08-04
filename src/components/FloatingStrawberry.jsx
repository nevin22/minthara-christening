import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

const SIZE = 64
// 75% slower than previous 0.18
const SPEED = 0.045
const ANGLE_MIN = -18
const ANGLE_MAX = 18

function randomAngle() {
  return ANGLE_MIN + Math.random() * (ANGLE_MAX - ANGLE_MIN)
}

export default function FloatingStrawberry() {
  const shellRef = useRef(null)
  const [dragging, setDragging] = useState(false)
  const dragRef = useRef({
    active: false,
    offsetX: 0,
    offsetY: 0,
    pointerId: null,
  })
  const motionRef = useRef({
    x: 0,
    y: 0,
    vx: SPEED,
    vy: -SPEED * 0.9,
    angle: -4,
    targetAngle: 8,
    angleTimer: 0,
  })

  useEffect(() => {
    const shell = shellRef.current
    if (!shell) return undefined

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      shell.style.transform = 'translate3d(1rem, calc(100vh - 5rem), 0) rotate(0deg)'
      return undefined
    }

    const size = () => shell.offsetWidth || SIZE
    const maxX = () => Math.max(0, window.innerWidth - size())
    const maxY = () => Math.max(0, window.innerHeight - size())

    const state = motionRef.current
    state.x = maxX() * 0.72
    state.y = maxY() * 0.62
    state.vx = SPEED
    state.vy = -SPEED * 0.9
    state.angle = randomAngle()
    state.targetAngle = randomAngle()
    state.angleTimer = 1800 + Math.random() * 2200

    let frameId = 0
    let last = performance.now()

    const applyTransform = () => {
      shell.style.transform = `translate3d(${state.x}px, ${state.y}px, 0) rotate(${state.angle}deg)`
    }
    applyTransform()

    const tick = (now) => {
      const dt = Math.min(32, now - last)
      last = now

      if (!dragRef.current.active) {
        const boundX = maxX()
        const boundY = maxY()

        state.x += state.vx * dt
        state.y += state.vy * dt

        if (state.x <= 0) {
          state.x = 0
          state.vx = Math.abs(state.vx)
        } else if (state.x >= boundX) {
          state.x = boundX
          state.vx = -Math.abs(state.vx)
        }

        if (state.y <= 0) {
          state.y = 0
          state.vy = Math.abs(state.vy)
        } else if (state.y >= boundY) {
          state.y = boundY
          state.vy = -Math.abs(state.vy)
        }

        state.angleTimer -= dt
        if (state.angleTimer <= 0) {
          state.targetAngle = randomAngle()
          state.angleTimer = 2200 + Math.random() * 2800
        }

        // ease toward new tilt
        state.angle += (state.targetAngle - state.angle) * Math.min(1, dt * 0.004)
      }

      applyTransform()
      frameId = requestAnimationFrame(tick)
    }

    frameId = requestAnimationFrame(tick)

    const clamp = () => {
      state.x = Math.min(Math.max(0, state.x), maxX())
      state.y = Math.min(Math.max(0, state.y), maxY())
    }

    const onPointerDown = (event) => {
      dragRef.current.active = true
      dragRef.current.pointerId = event.pointerId
      dragRef.current.offsetX = event.clientX - state.x
      dragRef.current.offsetY = event.clientY - state.y
      setDragging(true)
      shell.setPointerCapture?.(event.pointerId)
      event.preventDefault()
    }

    const onPointerMove = (event) => {
      if (!dragRef.current.active) return
      if (
        dragRef.current.pointerId != null &&
        event.pointerId !== dragRef.current.pointerId
      ) {
        return
      }
      state.x = event.clientX - dragRef.current.offsetX
      state.y = event.clientY - dragRef.current.offsetY
      clamp()
    }

    const onPointerUp = (event) => {
      if (!dragRef.current.active) return
      if (
        dragRef.current.pointerId != null &&
        event.pointerId !== dragRef.current.pointerId
      ) {
        return
      }
      dragRef.current.active = false
      dragRef.current.pointerId = null
      setDragging(false)
      // resume drifting in a soft random direction
      const dir = Math.random() * Math.PI * 2
      state.vx = Math.cos(dir) * SPEED
      state.vy = Math.sin(dir) * SPEED
      state.targetAngle = randomAngle()
    }

    shell.addEventListener('pointerdown', onPointerDown)
    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerup', onPointerUp)
    window.addEventListener('pointercancel', onPointerUp)
    window.addEventListener('resize', clamp)

    return () => {
      cancelAnimationFrame(frameId)
      shell.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerup', onPointerUp)
      window.removeEventListener('pointercancel', onPointerUp)
      window.removeEventListener('resize', clamp)
    }
  }, [])

  return (
    <div
      ref={shellRef}
      className={`floating-berry${dragging ? ' floating-berry--dragging' : ''}`}
      aria-hidden="true"
    >
      <motion.img
        className="floating-berry__img"
        src="/floating-strawberry.png"
        alt=""
        width={SIZE}
        height={SIZE}
        draggable="false"
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.55, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
      />
    </div>
  )
}
