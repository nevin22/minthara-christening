export default function MapButtons({ googleMaps }) {
  return (
    <div className="map-buttons">
      <a
        className="btn btn--map"
        href={googleMaps}
        target="_blank"
        rel="noopener noreferrer"
      >
        View map
      </a>
    </div>
  )
}
