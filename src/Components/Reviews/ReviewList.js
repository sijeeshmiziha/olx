import React, { useState, useEffect } from 'react';
import { reviewsRef } from '../../firebase/collections';
import { formatDate } from '../../utils/formatters';
import './Reviews.css';

function ReviewList({ sellerId, limit = 20 }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!sellerId) {
      setLoading(false);
      return;
    }
    const unsub = reviewsRef()
      .where('sellerId', '==', sellerId)
      .orderBy('createdAt', 'desc')
      .limit(limit)
      .onSnapshot((snap) => {
        setReviews(
          snap.docs.map((d) => {
            const data = d.data();
            return {
              id: d.id,
              ...data,
              createdAt:
                data.createdAt?.toDate?.()?.toISOString?.() || data.createdAt,
            };
          })
        );
        setLoading(false);
      });
    return () => unsub();
  }, [sellerId, limit]);

  if (loading) return <p>Loading reviews...</p>;
  if (reviews.length === 0)
    return <p className="emptyState">No reviews yet.</p>;

  return (
    <ul
      className="reviewList"
      style={{ listStyle: 'none', padding: 0, margin: 0 }}
    >
      {reviews.map((r) => (
        <li key={r.id} className="reviewListItem">
          <div className="reviewListHeader">
            <span className="reviewListName">{r.reviewerName || 'User'}</span>
            {r.verified && <span className="reviewListVerified" title="Verified purchase">✓</span>}
            <span className="reviewListStars">
              {'★'.repeat(r.rating || 0)}
              {'☆'.repeat(5 - (r.rating || 0))}
            </span>
          </div>
          {r.ratings && typeof r.ratings === 'object' && (
            <div className="reviewListDetailRatings">
              {Object.entries(r.ratings).map(([k, v]) => v > 0 && <span key={k}>{k}: {v}★</span>)}
            </div>
          )}
          {r.comment && <p className="reviewListComment">{r.comment}</p>}
          {r.sellerResponse?.text && (
            <div className="reviewListSellerResponse">
              <strong>Seller:</strong> {r.sellerResponse.text}
            </div>
          )}
          <span className="reviewListDate">{formatDate(r.createdAt)}</span>
        </li>
      ))}
    </ul>
  );
}

export default ReviewList;
