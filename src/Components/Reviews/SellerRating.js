import React from 'react';
import './Reviews.css';

function SellerRating({ ratingSum, ratingCount }) {
  const count = Number(ratingCount) || 0;
  const sum = Number(ratingSum) || 0;
  const average = count > 0 ? Math.min(sum / count, 5).toFixed(1) : '0';
  const full = Math.min(Math.floor(Number(average)), 5);
  const half = Number(average) % 1 >= 0.5 ? 1 : 0;
  const empty = Math.max(0, 5 - full - half);
  const stars = '★'.repeat(full) + (half ? '½' : '') + '☆'.repeat(empty);

  return (
    <span
      className="sellerRatingWrap"
      title={`${average} out of 5 (${count} reviews)`}
    >
      <span className="sellerRatingStars">{stars}</span>
      <span>
        {average} ({count})
      </span>
    </span>
  );
}

export default SellerRating;
