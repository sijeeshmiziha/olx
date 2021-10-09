import React from 'react';
import { Link } from 'react-router-dom';
import { formatPrice } from '../../utils/formatters';
import './MapView.css';

/**
 * Map view for search results: shows products that have location.latitude/longitude
 * with a link to open in Google Maps. Does not embed a map (no API key required).
 */
function MapView({ products = [] }) {
  const withLocation = products.filter(
    (p) => p.location && p.location.latitude != null && p.location.longitude != null
  );

  if (withLocation.length === 0) {
    return (
      <div className="mapViewEmpty">
        <p>No listings with map location. Sellers can add location when creating an ad.</p>
      </div>
    );
  }

  const mapUrl = (lat, lng, label) => {
    const q = label ? `${lat},${lng} (${encodeURIComponent(label)})` : `${lat},${lng}`;
    return `https://www.google.com/maps?q=${q}`;
  };

  return (
    <div className="mapView">
      <ul className="mapViewList">
        {withLocation.map((p) => (
          <li key={p.id} className="mapViewItem">
            <Link to={`/ad/${p.id}`} className="mapViewItemTitle">
              {p.name}
            </Link>
            <span className="mapViewItemPrice">{formatPrice(p.price)}</span>
            {(p.location.area || p.location.city) && (
              <span className="mapViewItemLocation">
                {[p.location.area, p.location.city].filter(Boolean).join(', ')}
              </span>
            )}
            <a
              href={mapUrl(p.location.latitude, p.location.longitude, p.name)}
              target="_blank"
              rel="noopener noreferrer"
              className="mapViewItemMapLink"
            >
              View on map
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default MapView;
