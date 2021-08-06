import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../contextStore/AuthContext';
import { Firebase } from '../../firebase/config';
import { getUserRef } from '../../firebase/collections';
import PostCards from '../PostCards/PostCards';
import BarLoading from '../Loading/BarLoading';
import './Dashboard.css';

function SavedAds() {
  const { user } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.uid) {
      setLoading(false);
      return;
    }
    const unsub = getUserRef(user.uid).onSnapshot((doc) => {
      const data = doc.exists ? doc.data() : {};
      const ids = data.savedAds || [];
      if (ids.length === 0) {
        setProducts([]);
        setLoading(false);
        return;
      }
      const promises = ids
        .slice(0, 50)
        .map((id) => Firebase.firestore().collection('products').doc(id).get());
      Promise.all(promises).then((snaps) => {
        const list = snaps
          .filter((s) => s.exists)
          .map((s) => ({ id: s.id, ...s.data() }));
        setProducts(list);
        setLoading(false);
      });
    });
    return () => unsub && unsub();
  }, [user?.uid]);

  if (!user) {
    return (
      <div className="emptyState">
        <p>Log in to see your saved ads.</p>
      </div>
    );
  }

  if (loading) return <BarLoading />;
  if (products.length === 0) {
    return (
      <div className="emptyState">
        <p>Save ads by clicking the heart on any listing.</p>
        <p>They will appear here.</p>
      </div>
    );
  }

  return (
    <div className="myAdsGrid">
      {products.map((product, index) => (
        <div className="dashboardCard" key={product.id || index}>
          <PostCards product={product} index={index} />
        </div>
      ))}
    </div>
  );
}

export default SavedAds;
