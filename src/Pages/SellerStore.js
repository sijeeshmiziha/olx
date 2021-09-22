import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '../Components/Layout/Layout';
import { usersRef, productsRef } from '../firebase/collections';
import './SellerStore.css';
import PostCards from '../Components/PostCards/PostCards';
import BarLoading from '../Components/Loading/BarLoading';

function SellerStore() {
  const { userId } = useParams();
  const [seller, setSeller] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    usersRef()
      .doc(userId)
      .get()
      .then((doc) => {
        if (doc.exists) setSeller(doc.data());
      });
    productsRef()
      .where('userId', '==', userId)
      .where('status', '==', 'active')
      .orderBy('createdAt', 'desc')
      .limit(50)
      .get()
      .then((snap) => {
        setProducts(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      })
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [userId]);

  return (
    <Layout>
      <div className="sellerStorePage">
        <h1>Seller store</h1>
        {loading ? (
          <BarLoading />
        ) : (
          <>
            {seller && (
              <div className="sellerStoreHeader">
                <h2>{seller.name}</h2>
                <Link to={`/profile/${userId}`}>View profile</Link>
              </div>
            )}
            <div className="sellerStoreGrid">
              {products.map((p, i) => (
                <div key={p.id} className="sellerStoreCard">
                  <PostCards product={p} index={i} />
                </div>
              ))}
            </div>
            {!loading && products.length === 0 && (
              <p>No active ads from this seller.</p>
            )}
          </>
        )}
      </div>
    </Layout>
  );
}

export default SellerStore;
