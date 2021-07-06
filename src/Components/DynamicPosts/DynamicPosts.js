import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Firebase } from '../../firebase/config';
import { getProductsQuery } from '../../firebase/collections';
import PostCards from '../PostCards/PostCards';
import { CardSkeleton } from '../UI/Skeleton';
import './dynamicposts.css';

const LIMIT = 8;

function DynamicPosts({ category, categoryId }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!category) {
      setLoading(false);
      return;
    }
    setLoading(true);
    getProductsQuery({
      status: 'active',
      category,
      orderBy: { field: 'createdAt', direction: 'desc' },
      limit: LIMIT,
    })
      .get()
      .then((snapshot) => {
        const list = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setProducts(list);
      })
      .catch(() => {
        // Fallback if composite index missing: fetch recent products and filter by category client-side
        return Firebase.firestore()
          .collection('products')
          .where('status', '==', 'active')
          .orderBy('createdAt', 'desc')
          .limit(100)
          .get()
          .then((snapshot) => {
            const list = snapshot.docs
              .map((doc) => ({ ...doc.data(), id: doc.id }))
              .filter((p) => (p.category || '').trim() === category)
              .slice(0, LIMIT);
            setProducts(list);
          })
          .catch(() => setProducts([]));
      })
      .finally(() => setLoading(false));
  }, [category]);

  if (!category) return null;

  const viewMoreUrl = categoryId
    ? `/category/${categoryId}`
    : `/search?q=${encodeURIComponent(category)}`;

  return (
    <div className="dynamicPostsWrapper">
      <div className="dynamicPostsInner">
        <div className="dynamicPostsHeading">
          <span>{category}</span>
          <Link to={viewMoreUrl}>View more</Link>
        </div>
        <div className={`dynamicPostsCards ${!loading ? 'olxFadeIn' : ''}`}>
          {loading
            ? [1, 2, 3, 4].map((i) => (
                <div className="dynamicPostsCardSlot" key={i}>
                  <CardSkeleton />
                </div>
              ))
            : products.map((product, index) => (
                <div className="dynamicPostsCardSlot" key={product.id || index}>
                  <PostCards product={product} index={index} />
                </div>
              ))}
        </div>
      </div>
    </div>
  );
}

export default DynamicPosts;
