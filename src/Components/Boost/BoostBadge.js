import React from 'react';
import './Boost.css';

function BoostBadge({ product }) {
  if (!product?.isBoosted) return null;
  const expiry = product.boostExpiry;
  const expired =
    expiry && (expiry.toDate ? expiry.toDate() : new Date(expiry)) < new Date();
  if (expired) return null;

  return <span className="boostBadge">Featured</span>;
}

export default BoostBadge;
