import { useCallback, useRef, useState } from 'react'

const DRAG_LOCK = 10
const SWIPE_THRESHOLD = 40
const VISIBLE_SLOTS = [-2, -1, 0, 1, 2]

function mod(n, m) {
  return ((n % m) + m) % m
}

function cardTransform(offset) {
  const abs = Math.abs(offset)
  const x = offset * 44
  const z = abs * -95
  const rotate = offset * -40
  const scale = Math.max(0.7, 1 - abs * 0.13)
  return `translate(-50%, -50%) translateX(${x}%) translateZ(${z}px) rotateY(${rotate}deg) scale(${scale})`
}

export default function CoverFlowGallery({ photos }) {
  const [active, setActive] = useState(0)
  const dragRef = useRef({
    pointerId: null,
    startX: 0,
    startY: 0,
    locked: null,
    moved: false,
  })

  const count = photos.length

  const step = useCallback((delta) => {
    if (!delta) return
    setActive((current) => current + delta)
  }, [])

  const onPointerDown = (event) => {
    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      locked: null,
      moved: false,
    }
  }

  const onPointerMove = (event) => {
    const drag = dragRef.current
    if (drag.pointerId !== event.pointerId) return

    const dx = event.clientX - drag.startX
    const dy = event.clientY - drag.startY

    if (!drag.locked) {
      if (Math.abs(dx) < DRAG_LOCK && Math.abs(dy) < DRAG_LOCK) return
      drag.locked = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y'
    }

    if (drag.locked === 'x') {
      drag.moved = true
      event.preventDefault()
    }
  }

  const finishDrag = (event) => {
    const drag = dragRef.current
    if (drag.pointerId !== event.pointerId) return

    if (drag.locked === 'x') {
      const dx = event.clientX - drag.startX
      if (Math.abs(dx) >= SWIPE_THRESHOLD) {
        // One photo per swipe — never skip
        step(dx < 0 ? 1 : -1)
      }
    }

    dragRef.current.pointerId = null
  }

  const onCardClick = (offset, event) => {
    if (dragRef.current.moved) {
      event.preventDefault()
      return
    }
    // Only step to the immediate neighbor card (not ±2)
    if (offset === -1 || offset === 1) step(offset)
  }

  if (!count) return null

  return (
    <div
      className="coverflow"
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
          {VISIBLE_SLOTS.map((offset) => {
            const absolute = active + offset
            const photo = photos[mod(absolute, count)]
            const abs = Math.abs(offset)

            return (
              <button
                key={absolute}
                type="button"
                className={`coverflow__card${offset === 0 ? ' coverflow__card--active' : ''}`}
                style={{
                  transform: cardTransform(offset),
                  zIndex: 20 - abs,
                }}
                aria-label={photo.alt}
                aria-current={offset === 0 ? 'true' : undefined}
                tabIndex={offset === 0 ? 0 : -1}
                onClick={(event) => onCardClick(offset, event)}
              >
                <img
                  src={photo.src}
                  alt={photo.alt}
                  draggable="false"
                  loading="lazy"
                />
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
