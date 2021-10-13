import React, { useState, useEffect } from 'react';
import { Firebase } from '../../firebase/config';
import PostCards from '../PostCards/PostCards';
import BarLoading from '../Loading/BarLoading';
import './SimilarAds.css';

function SimilarAds({ category, excludeId, limit = 4 }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!category) {
      setLoading(false);
      return;
    }
    Firebase.firestore()
      .collection('products')
      .where('status', '==', 'active')
      .where('category', '==', category)
      .orderBy('createdAt', 'desc')
      .limit(limit + 5)
      .get()
      .then((snapshot) => {
        const list = snapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .filter((p) => p.id !== excludeId)
          .slice(0, limit);
        setProducts(list);
      })
      .finally(() => setLoading(false));
  }, [category, excludeId, limit]);

  if (!category || products.length === 0) return null;

  return (
    <div className="similarAds">
      <h3 className="similarAdsTitle">Similar ads</h3>
      {loading ? (
        <BarLoading />
      ) : (
        <div className="similarAdsGrid">
          {products.map((product, index) => (
            <div className="similarAdsCard" key={product.id || index}>
              <PostCards product={product} index={index} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SimilarAds;
