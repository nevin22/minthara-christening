import { useEffect, useRef, useState } from 'react'

const DRAG_LOCK = 8
const DRAG_UNIT = 150
const SNAP_PROGRESS = 0.3
const VELOCITY_SNAP = 0.4
const SLOT_START = -4
const SLOT_END = 5
const SETTLE_MS = 480
/** Keep the current front card on top until the next one is clearly centered. */
const FRONT_HANDOFF = 0.22
const FRONT_LOST = 1.15

function mod(n, m) {
  return ((n % m) + m) % m
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value))
}

function easeOutCubic(t) {
  return 1 - (1 - t) ** 3
}

function nearestIndex(position) {
  return Math.round(position)
}

/**
 * Fully continuous motion from offset — no sticky/isFront jumps in the transform.
 * Paint order (DOM) uses a delayed front card so layering swaps only after
 * the next image is already risen into place.
 */
function cardTransform(offset) {
  const abs = Math.abs(offset)
  const focus = clamp(1 - abs, 0, 1)

  const x = offset * 52
  const y = -focus * 24 + abs * 10
  const z = focus * 180 - abs * 65
  const scale = 0.72 + focus * 0.28

  // No rotateY — angled edges + overflow clip cause a 1px pink seam flicker
  return `translate(-50%, -50%) translateX(${x}%) translateY(${y}px) translateZ(${z}px) scale(${scale})`
}

/** White wash over side cards — stronger the farther from center. */
function cardWash(offset) {
  const abs = Math.abs(offset)
  return clamp(abs * 0.38, 0, 0.72)
}

export default function CoverFlowGallery({ photos }) {
  const [position, setPosition] = useState(0)
  const [front, setFront] = useState(0)
  const [dragging, setDragging] = useState(false)
  const stageRef = useRef(null)
  const positionRef = useRef(0)
  const frontRef = useRef(0)
  const settleRafRef = useRef(0)
  const dragRef = useRef({
    pointerId: null,
    startX: 0,
    startY: 0,
    startPosition: 0,
    lastX: 0,
    lastTime: 0,
    velocity: 0,
    locked: null,
    moved: false,
  })

  const count = photos.length

  useEffect(() => {
    return () => {
      if (settleRafRef.current) cancelAnimationFrame(settleRafRef.current)
    }
  }, [])

  if (!count) return null

  const syncFront = (pos) => {
    const challenger = nearestIndex(pos)
    const challengerAbs = Math.abs(challenger - pos)
    const frontAbs = Math.abs(frontRef.current - pos)

    let nextFront = frontRef.current
    if (frontAbs > FRONT_LOST || challengerAbs <= FRONT_HANDOFF) {
      nextFront = challenger
    } else if (challenger !== frontRef.current && challengerAbs + 0.28 < frontAbs) {
      nextFront = challenger
    }

    if (nextFront !== frontRef.current) {
      frontRef.current = nextFront
      setFront(nextFront)
    }
  }

  const setPositionNow = (value) => {
    positionRef.current = value
    setPosition(value)
    syncFront(value)
  }

  const cancelSettle = () => {
    if (settleRafRef.current) {
      cancelAnimationFrame(settleRafRef.current)
      settleRafRef.current = 0
    }
  }

  const settleTo = (target) => {
    cancelSettle()
    const from = positionRef.current
    if (Math.abs(from - target) < 0.001) {
      setPositionNow(target)
      return
    }

    const start = performance.now()

    const tick = (now) => {
      const t = clamp((now - start) / SETTLE_MS, 0, 1)
      const next = from + (target - from) * easeOutCubic(t)
      setPositionNow(next)

      if (t < 1) {
        settleRafRef.current = requestAnimationFrame(tick)
      } else {
        settleRafRef.current = 0
        setPositionNow(target)
      }
    }

    settleRafRef.current = requestAnimationFrame(tick)
  }

  const onPointerDown = (event) => {
    if (event.button != null && event.button !== 0) return

    cancelSettle()

    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      startPosition: positionRef.current,
      lastX: event.clientX,
      lastTime: performance.now(),
      velocity: 0,
      locked: null,
      moved: false,
    }

    stageRef.current?.setPointerCapture?.(event.pointerId)
  }

  const onPointerMove = (event) => {
    const drag = dragRef.current
    if (drag.pointerId !== event.pointerId) return

    const dx = event.clientX - drag.startX
    const dy = event.clientY - drag.startY
    const now = performance.now()
    const dt = now - drag.lastTime

    if (dt > 0) {
      drag.velocity = (event.clientX - drag.lastX) / dt
      drag.lastX = event.clientX
      drag.lastTime = now
    }

    if (!drag.locked) {
      if (Math.abs(dx) < DRAG_LOCK && Math.abs(dy) < DRAG_LOCK) return
      drag.locked = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y'
      if (drag.locked === 'x') {
        drag.moved = true
        setDragging(true)
      }
    }

    if (drag.locked !== 'x') return

    event.preventDefault()
    setPositionNow(drag.startPosition - dx / DRAG_UNIT)
  }

  const finishDrag = (event) => {
    const drag = dragRef.current
    if (drag.pointerId !== event.pointerId) return

    if (drag.locked === 'x') {
      const delta = positionRef.current - drag.startPosition
      const base = nearestIndex(drag.startPosition)
      let target = base

      if (drag.velocity < -VELOCITY_SNAP || delta >= SNAP_PROGRESS) {
        target = base + 1
      } else if (drag.velocity > VELOCITY_SNAP || delta <= -SNAP_PROGRESS) {
        target = base - 1
      }

      settleTo(target)
    }

    setDragging(false)
    dragRef.current.pointerId = null
    dragRef.current.locked = null

    if (stageRef.current?.hasPointerCapture?.(event.pointerId)) {
      stageRef.current.releasePointerCapture(event.pointerId)
    }
  }

  const onCardClick = (index, event) => {
    if (dragRef.current.moved || dragging) {
      event.preventDefault()
      return
    }
    const nearest = nearestIndex(positionRef.current)
    const offset = index - nearest
    if (offset === -1 || offset === 1) settleTo(nearest + offset)
  }

  const base = Math.floor(position)
  const slots = []
  for (let i = SLOT_START; i <= SLOT_END; i += 1) slots.push(base + i)

  return (
    <div
      ref={stageRef}
      className={`coverflow${dragging ? ' coverflow--dragging' : ''}`}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={finishDrag}
      onPointerCancel={finishDrag}
      role="region"
      aria-roledescription="carousel"
      aria-label="Moments with Minthara, infinite photo gallery"
    >
      <div className="coverflow__stage">
        <div className="coverflow__track">
          {slots.map((index) => {
            const photo = photos[mod(index, count)]
            const visualOffset = index - position
            const abs = Math.abs(visualOffset)
            const isFront = index === front
            const isActive = abs < 0.5 && isFront

            return (
              <button
                key={index}
                type="button"
                className={`coverflow__card${isFront ? ' coverflow__card--active' : ''}`}
                style={{
                  transform: cardTransform(visualOffset),
                  // Layer swap is delayed until the next card is already risen
                  zIndex: isFront ? 5 : 1,
                  '--wash': String(cardWash(visualOffset)),
                }}
                aria-label={photo.alt}
                aria-current={isActive ? 'true' : undefined}
                tabIndex={isActive ? 0 : -1}
                onClick={(event) => onCardClick(index, event)}
              >
                <img
                  src={photo.src}
                  alt={photo.alt}
                  draggable="false"
                  loading="lazy"
                />
                <span className="coverflow__wash" aria-hidden="true" />
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
