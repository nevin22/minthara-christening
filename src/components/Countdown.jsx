import { useEffect, useState } from 'react'
import Section from './Section'

function getRemaining(target) {
  const diff = Math.max(0, target.getTime() - Date.now())
  const seconds = Math.floor(diff / 1000)
  return {
    days: Math.floor(seconds / 86400),
    hours: Math.floor((seconds % 86400) / 3600),
    minutes: Math.floor((seconds % 3600) / 60),
    seconds: seconds % 60,
    done: diff === 0,
  }
}

export default function Countdown({ targetDate }) {
  const [time, setTime] = useState(() => getRemaining(new Date(targetDate)))

  useEffect(() => {
    const target = new Date(targetDate)
    const tick = () => setTime(getRemaining(target))
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [targetDate])

  const units = [
    { label: 'Days', value: time.days },
    { label: 'Hours', value: time.hours },
    { label: 'Minutes', value: time.minutes },
    { label: 'Seconds', value: time.seconds },
  ]

  return (
    <Section id="countdown" className="countdown">
      <p className="section__eyebrow">Counting down</p>
      <h2 className="section__title">Until her special day</h2>
      <p className="section__text">
        {time.done
          ? 'The day is here — see you at the celebration!'
          : 'Every second brings us closer to Minthara’s christening.'}
      </p>
      <div className="countdown__grid" aria-live="polite">
        {units.map((unit) => (
          <div key={unit.label} className="countdown__unit">
            <span className="countdown__value">
              {String(unit.value).padStart(2, '0')}
            </span>
            <span className="countdown__label">{unit.label}</span>
          </div>
        ))}
      </div>
    </Section>
  )
}
