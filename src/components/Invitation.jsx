import { event } from '../data/event'
import Section from './Section'
import MapButtons from './MapButtons'
import Countdown from './Countdown'

export default function Invitation() {
  return (
    <main className="invite">
      <header className="hero">
        <div className="hero__veil" aria-hidden="true" />
        <div className="hero__content">
          <p className="hero__eyebrow">With joyful hearts, we invite you to the</p>
          <h1 className="hero__brand">{event.babyName}</h1>
          <p className="hero__title">{event.eventTitle}</p>
          <p className="hero__meta">
            {event.dateLabel} · {event.timeLabel}
          </p>
        </div>
      </header>

      <Section id="details" className="details">
        <p className="section__eyebrow">The celebration</p>
        <h2 className="section__title">Ceremony & reception</h2>
        <p className="section__text">
          Join us as we celebrate God&apos;s blessing upon our little girl.
        </p>

        <div className="venue-block">
          <h3 className="venue-block__name">{event.church.name}</h3>
          <p className="venue-block__meta">
            {event.timeLabel} · {event.dateLabel}
          </p>
          <MapButtons googleMaps={event.church.googleMaps} />
        </div>

        <div className="venue-block venue-block--later">
          <h3 className="venue-block__name">{event.reception.name}</h3>
          <p className="venue-block__meta">Reception after the ceremony</p>
          <MapButtons googleMaps={event.reception.googleMaps} />
        </div>
      </Section>

      <Section id="dress-code" className="dress-code">
        <p className="section__eyebrow">What to wear</p>
        <h2 className="section__title">Dress code</h2>
        <p className="dress-code__swatch" aria-hidden="true" />
        <p className="section__text dress-code__label">
          Kindly wear <strong>{event.dressCode}</strong>
        </p>
      </Section>

      <Countdown targetDate={event.targetDate} />

      <Section id="gallery" className="gallery">
        <p className="section__eyebrow">Our little berry</p>
        <h2 className="section__title">Moments with Minthara</h2>
        <p className="section__text">
          A few sweet glimpses of our little girl.
        </p>
        <div className="gallery__grid">
          {event.gallery.map((photo) => (
            <figure key={photo.id} className="gallery__item">
              <div className="gallery__sparkles gallery__sparkles--left" aria-hidden="true">
                <span className="sparkle sparkle--1" />
                <span className="sparkle sparkle--2" />
                <span className="sparkle sparkle--3" />
              </div>
              <div className="gallery__photo">
                <img src={photo.src} alt={photo.alt} loading="lazy" />
              </div>
              <div className="gallery__sparkles gallery__sparkles--right" aria-hidden="true">
                <span className="sparkle sparkle--2" />
                <span className="sparkle sparkle--1" />
                <span className="sparkle sparkle--3" />
              </div>
            </figure>
          ))}
        </div>
      </Section>

      <Section id="gifts" className="gifts">
        <p className="section__eyebrow">Gift guide</p>
        <h2 className="section__title">A little help growing up</h2>
        <p className="section__text">
          Your love is the greatest gift of all, but if you&apos;d like to help
          our baby grow, here are some ideas we would truly appreciate:
        </p>
        <ul className="idea-list">
          {event.giftIdeas.map((idea) => (
            <li key={idea}>{idea}</li>
          ))}
        </ul>
      </Section>

      <Section id="reminders" className="reminders">
        <p className="section__eyebrow">Gentle reminders</p>
        <h2 className="section__title">For a safe celebration</h2>
        <p className="section__text">
          To ensure our baby is safe and comfortable throughout the day, we
          kindly ask for your cooperation with the following reminders:
        </p>
        <ul className="idea-list idea-list--checks">
          {event.reminders.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </Section>

      <Section id="godparents" className="godparents">
        <p className="section__eyebrow">With love & guidance</p>
        <h2 className="section__title">Godparents</h2>
        <div className="godparents__columns">
          <div>
            <h3 className="godparents__heading">Godfathers</h3>
            <ul className="godparents__list">
              {event.godfathers.map((name) => (
                <li key={name}>{name}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="godparents__heading">Godmothers</h3>
            <ul className="godparents__list">
              {event.godmothers.map((name) => (
                <li key={name}>{name}</li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <Section id="rsvp" className="rsvp">
        <p className="section__eyebrow">Please reply</p>
        <h2 className="section__title">RSVP</h2>
        <p className="section__text">
          Kindly confirm your attendance by tapping the RSVP button below, at
          least two weeks before the celebration.
        </p>
        <a
          className="btn btn--primary"
          href={event.rsvpFormUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          RSVP here
        </a>
      </Section>

      <Section id="closing" className="closing">
        <h2 className="closing__title">See you on our special day</h2>
        <p className="closing__meta">
          {event.dateLabel} · {event.timeLabel}
        </p>
      </Section>
    </main>
  )
}
