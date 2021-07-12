import React from 'react';
import { formatPrice } from '../../../utils/formatters';

export default function ProductDetails({ postContent, dateLabel }) {
  return (
    <div className="productDetails">
      {(postContent.adType === 'for_rent' || postContent.adType === 'wanted' || postContent.adType === 'exchange' || postContent.adType === 'free') && (
        <span className="viewAdTypeBadge">
          {postContent.adType === 'for_rent' ? 'For Rent' : postContent.adType === 'wanted' ? 'Wanted' : postContent.adType === 'exchange' ? 'Exchange' : 'Free'}
        </span>
      )}
      <p className="viewPrice">
        {postContent.originalPrice != null && postContent.originalPrice > postContent.price && (
          <span className="viewOriginalPrice">{formatPrice(postContent.originalPrice)}</span>
        )}
        {formatPrice(postContent.price)}
        {(postContent.negotiable || postContent.priceType === 'negotiable') && <span className="viewNegotiable">Negotiable</span>}
        {postContent.priceType === 'free' && <span className="viewNegotiable">Free</span>}
        {postContent.priceType === 'contact' && <span className="viewNegotiable">Contact for price</span>}
      </p>
      <h1 className="viewTitle">{postContent.name}</h1>
      <p className="viewMeta">
        {postContent.adType === 'for_sale' && 'For Sale · '}
        {postContent.category}
        {postContent.subcategory ? ` › ${postContent.subcategory}` : ''}
        {postContent.condition && ` · ${postContent.condition}`}
        {postContent.listedBy && ` · ${postContent.listedBy}`}
      </p>
      {Array.isArray(postContent.tags) && postContent.tags.length > 0 && (
        <div className="viewTags">
          {postContent.tags.map((tag) => (
            <span key={tag} className="viewTag">{tag}</span>
          ))}
        </div>
      )}
      {postContent.extra && Object.keys(postContent.extra).length > 0 && (
        <div className="viewExtraDetails">
          {Object.entries(postContent.extra).map(([key, value]) => {
            if (!value && value !== 0) return null;
            const label = key
              .replace(/([A-Z])/g, ' $1')
              .replace(/^./, (s) => s.toUpperCase())
              .replace(/Sq ft/g, '(sq ft)')
              .replace(/Km/g, 'KM');
            return (
              <div key={key} className="viewExtraItem">
                <span className="viewExtraLabel">{label}</span>
                <span className="viewExtraValue">{String(value)}</span>
              </div>
            );
          })}
        </div>
      )}
      {(postContent.location?.city || postContent.location?.state) && (
        <p className="viewLocation">
          <span className="viewLocationIcon">📍</span>
          {[postContent.location.city, postContent.location.state].filter(Boolean).join(', ')}
        </p>
      )}
      {postContent.delivery?.available && (
        <p className="viewDelivery">
          <span className="viewDeliveryIcon">🚚</span>
          Delivery available
          {postContent.delivery.shippingCost > 0 && ` · ₹${postContent.delivery.shippingCost} shipping`}
          {postContent.delivery.estimatedDays && ` · ${postContent.delivery.estimatedDays}`}
        </p>
      )}
      {postContent.warranty?.available && (
        <p className="viewWarranty">
          <span className="viewWarrantyIcon">🛡️</span>
          Warranty: {postContent.warranty.type || 'Yes'}
          {postContent.warranty.description && ` — ${postContent.warranty.description}`}
        </p>
      )}
      {postContent.returnPolicy && postContent.returnPolicy !== 'no_returns' && (
        <p className="viewReturnPolicy">Returns: {postContent.returnPolicy.replace('_', ' ')}</p>
      )}
      {Array.isArray(postContent.paymentMethods) && postContent.paymentMethods.length > 0 && (
        <p className="viewPaymentMethods">Payment: {postContent.paymentMethods.join(', ')}</p>
      )}
      {postContent.stats && (postContent.stats.views > 0 || postContent.stats.favorites > 0 || postContent.stats.shares > 0) && (
        <p className="viewStats">
          {postContent.stats.views > 0 && <span>{postContent.stats.views} views</span>}
          {postContent.stats.favorites > 0 && <span>{postContent.stats.favorites} favorites</span>}
          {postContent.stats.shares > 0 && <span>{postContent.stats.shares} shares</span>}
        </p>
      )}
      {dateLabel && <p className="viewDate">Posted {dateLabel}</p>}
      {postContent.status === 'sold' && <span className="viewSoldBadge">SOLD</span>}
    </div>
  );
}
