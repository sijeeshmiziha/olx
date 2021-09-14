import React, { useState, useContext } from 'react';
import {
  reviewsRef,
  getUserRef,
  serverTimestamp,
} from '../../firebase/collections';
import { AuthContext } from '../../contextStore/AuthContext';
import { ToastContext } from '../../contextStore/ToastContext';
import { createNotification } from '../../firebase/notifications';
import ButtonSpinner from '../UI/ButtonSpinner';
import './Reviews.css';

function ReviewModal({ sellerId, productId, productName, onClose, onSuccess }) {
  const { user } = useContext(AuthContext);
  const { addToast } = useContext(ToastContext);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [ratings, setRatings] = useState({ communication: 0, accuracy: 0, punctuality: 0, fairness: 0 });
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!user?.uid || !sellerId || rating < 1 || rating > 5) {
      addToast('Please select a rating (1-5 stars)', 'error');
      return;
    }
    setLoading(true);
    const reviewData = {
      sellerId,
      reviewerId: user.uid,
      reviewerName: user.displayName || user.email?.split('@')[0] || 'User',
      reviewerAvatar: user.photoURL || null,
      productId: productId || null,
      rating,
      ratings: (ratings.communication || ratings.accuracy || ratings.punctuality || ratings.fairness)
        ? { ...ratings }
        : null,
      comment: comment.trim() || null,
      sellerResponse: { text: '', respondedAt: null },
      helpfulCount: 0,
      reportCount: 0,
      verified: false,
      status: 'active',
      createdAt: serverTimestamp(),
    };
    reviewsRef()
      .add(reviewData)
      .then(() => {
        return getUserRef(sellerId)
          .get()
          .then((doc) => {
            const d = doc.data() || {};
            const sum = (d.ratingSum || 0) + rating;
            const count = (d.ratingCount || 0) + 1;
            return getUserRef(sellerId).update({
              ratingSum: sum,
              ratingCount: count,
            });
          });
      })
      .then(() => {
        createNotification(
          sellerId,
          'review',
          'New review',
          `${reviewData.reviewerName} left you a ${rating}-star review.`,
          { productId }
        );
        addToast('Review submitted!', 'success');
        onSuccess && onSuccess();
        onClose();
      })
      .catch((err) =>
        addToast(err.message || 'Failed to submit review', 'error')
      )
      .finally(() => setLoading(false));
  };

  return (
    <div className="reviewModalOverlay" onClick={onClose}>
      <div className="reviewModal" onClick={(e) => e.stopPropagation()}>
        <h3>Leave a review</h3>
        {productName && <p className="reviewModalProduct">{productName}</p>}
        <form onSubmit={handleSubmit}>
          <label>Rating</label>
          <div className="reviewStars">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className="reviewStarBtn"
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(star)}
              >
                <span
                  className={star <= (hoverRating || rating) ? 'filled' : ''}
                >
                  &#9733;
                </span>
              </button>
            ))}
          </div>
          <label className="reviewModalSubLabel">Detailed ratings (optional)</label>
          <div className="reviewModalDetails">
            {['communication', 'accuracy', 'punctuality', 'fairness'].map((key) => (
              <div key={key} className="reviewModalDetailRow">
                <span>{key.charAt(0).toUpperCase() + key.slice(1)}</span>
                <div className="reviewStars reviewStarsSmall">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      className="reviewStarBtn"
                      onClick={() => setRatings((p) => ({ ...p, [key]: star }))}
                    >
                      <span className={star <= (ratings[key] || 0) ? 'filled' : ''}>&#9733;</span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <label>Comment (optional)</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your experience..."
            rows={4}
          />
          <div className="reviewModalActions">
            <button type="button" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" disabled={loading}>
              {loading && <ButtonSpinner />}Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ReviewModal;
