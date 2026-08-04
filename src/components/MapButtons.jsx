export default function MapButtons({ googleMaps, appleMaps }) {
  return (
    <div className="map-buttons">
      <a
        className="btn btn--map"
        href={googleMaps}
        target="_blank"
        rel="noopener noreferrer"
      >
        Open in Google Maps
      </a>
      <a
        className="btn btn--map btn--soft"
        href={appleMaps}
        target="_blank"
        rel="noopener noreferrer"
      >
        Open in Apple Maps
      </a>
    </div>
  )
}
