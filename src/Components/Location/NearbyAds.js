import React, { useState, useEffect } from 'react';
import { Firebase } from '../../firebase/config';
import PostCards from '../PostCards/PostCards';
import BarLoading from '../Loading/BarLoading';
import '../Dashboard/Dashboard.css';

function NearbyAds({ city, state, limit = 8 }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!city && !state) {
      setLoading(false);
      return;
    }
    let q = Firebase.firestore()
      .collection('products')
      .where('status', '==', 'active')
      .orderBy('createdAt', 'desc')
      .limit(limit * 2);
    q.get()
      .then((snapshot) => {
        const list = snapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .filter((p) => {
            const loc = p.location || {};
            if (city && (loc.city || '').toLowerCase() !== city.toLowerCase())
              return false;
            if (
              state &&
              (loc.state || '').toLowerCase() !== state.toLowerCase()
            )
              return false;
            return true;
          })
          .slice(0, limit);
        setProducts(list);
      })
      .finally(() => setLoading(false));
  }, [city, state, limit]);

  if (!city && !state) return null;
  if (loading) return <BarLoading />;
  if (products.length === 0) return null;

  return (
    <div className="nearbyAdsSection">
      <h2>Ads in {city || state}</h2>
      <div className="myAdsGrid">
        {products.map((product, index) => (
          <div className="dashboardCard" key={product.id || index}>
            <PostCards product={product} index={index} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default NearbyAds;
