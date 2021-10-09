import React, { useState, useEffect } from 'react';
import Layout from '../Components/Layout/Layout';
import { useGeolocation, distanceKm } from '../hooks/useGeolocation';
import { productsRef } from '../firebase/collections';
import PostCards from '../Components/PostCards/PostCards';
import BarLoading from '../Components/Loading/BarLoading';
import './Nearby.css';

function Nearby() {
  const { lat, lng, loading: geoLoading, error: geoError, refresh } = useGeolocation();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    productsRef()
      .where('status', '==', 'active')
      .orderBy('createdAt', 'desc')
      .limit(300)
      .get()
      .then((snap) => {
        const list = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setProducts(list);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const withDistance = products.filter((p) => {
    const plat = p.location?.lat ?? p.lat;
    const plng = p.location?.lng ?? p.lng;
    return typeof plat === 'number' && typeof plng === 'number';
  });

  const sorted =
    lat != null && lng != null
      ? [...withDistance].sort((a, b) => {
          const da = distanceKm(lat, lng, a.location?.lat ?? a.lat, a.location?.lng ?? a.lng);
          const db = distanceKm(lat, lng, b.location?.lat ?? b.lat, b.location?.lng ?? b.lng);
          return da - db;
        })
      : withDistance;

  return (
    <Layout>
      <div className="nearbyPage">
        <h1 className="nearbyTitle">Nearby ads</h1>
        {geoLoading && (
          <p className="nearbyStatus">Getting your location...</p>
        )}
        {geoError && (
          <p className="nearbyError">
            {geoError} — Showing ads without distance.{' '}
            <button type="button" className="nearbyRetry" onClick={refresh}>
              Retry
            </button>
          </p>
        )}
        {lat != null && lng != null && (
          <p className="nearbyCoords">
            Your location: {lat.toFixed(4)}, {lng.toFixed(4)}
          </p>
        )}
        {loading ? (
          <BarLoading />
        ) : sorted.length === 0 ? (
          <p className="nearbyEmpty">
            No ads with location yet. Sellers can add location when posting.
          </p>
        ) : (
          <div className="nearbyGrid">
            {sorted.map((product, index) => {
              const plat = product.location?.lat ?? product.lat;
              const plng = product.location?.lng ?? product.lng;
              const dist =
                lat != null && lng != null
                  ? distanceKm(lat, lng, plat, plng)
                  : null;
              return (
                <div key={product.id} className="nearbyCardWrap">
                  <PostCards product={product} index={index} />
                  {dist != null && (
                    <span className="nearbyDistance">
                      {dist < 1 ? `${Math.round(dist * 1000)} m` : `${dist.toFixed(1)} km`} away
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
}

export default Nearby;
