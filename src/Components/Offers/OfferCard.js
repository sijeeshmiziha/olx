import React, { useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { updateOfferStatus } from '../../firebase/offers';
import { getProductRef } from '../../firebase/collections';
import { formatPrice, formatRelativeDate } from '../../utils/formatters';
import { ToastContext } from '../../contextStore/ToastContext';
import { PostContext } from '../../contextStore/PostContext';
import ButtonSpinner from '../UI/ButtonSpinner';
import './OfferCard.css';

const STATUS_CONFIG = {
  pending: { label: 'Pending', icon: '⏳', cls: 'pending' },
  accepted: { label: 'Accepted', icon: '✓', cls: 'accepted' },
  rejected: { label: 'Declined', icon: '✗', cls: 'rejected' },
  countered: { label: 'Countered', icon: '↩', cls: 'countered' },
  expired: { label: 'Expired', icon: '⏰', cls: 'expired' },
};

function OfferCard({ offer, isSeller, onUpdate }) {
  const history = useHistory();
  const { addToast } = useContext(ToastContext);
  const { setPostContent } = useContext(PostContext);
  const [loading, setLoading] = useState(false);
  const [actionType, setActionType] = useState('');
  const [showCounter, setShowCounter] = useState(false);
  const [counterAmount, setCounterAmount] = useState('');

  const status = offer.status || 'pending';
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
  const percentage =
    offer.originalPrice > 0
      ? Math.round((offer.offerAmount / offer.originalPrice) * 100)
      : 0;

  const handleAction = (newStatus, amount) => {
    setLoading(true);
    setActionType(newStatus);
    updateOfferStatus(offer.id, newStatus, amount)
      .then(() => {
        const msgs = {
          accepted: 'Offer accepted!',
          rejected: 'Offer declined',
          countered: 'Counter offer sent!',
        };
        addToast(msgs[newStatus] || 'Updated', 'success');
        setShowCounter(false);
        setCounterAmount('');
        onUpdate?.();
      })
      .catch((err) => addToast(err.message || 'Action failed', 'error'))
      .finally(() => {
        setLoading(false);
        setActionType('');
      });
  };

  const handleCounter = () => {
    const num = Number(counterAmount);
    if (!num || num <= 0) {
      addToast('Enter a valid counter amount', 'error');
      return;
    }
    handleAction('countered', num);
  };

  const goToProduct = () => {
    getProductRef(offer.productId)
      .get()
      .then((doc) => {
        if (doc.exists && setPostContent) {
          setPostContent({ id: doc.id, ...doc.data() });
          history.push('/view');
        }
      });
  };

  const productImage = offer.productImage || '';
  const createdDate = offer.createdAt
    ? formatRelativeDate(offer.createdAt)
    : '';

  return (
    <div className="oCard">
      {/* Top section with product image */}
      <div className="oCard__top">
        <div className="oCard__imageWrap" role="button" tabIndex={0} onClick={goToProduct} onKeyDown={(e) => { if (e.key === 'Enter') goToProduct(); }}>
          {productImage ? (
            <img src={productImage} alt="" className="oCard__image" />
          ) : (
            <div className="oCard__imagePlaceholder">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                <circle cx="8.5" cy="8.5" r="1.5"/>
                <polyline points="21 15 16 10 5 21"/>
              </svg>
            </div>
          )}
        </div>

        <div className="oCard__info">
          <div className="oCard__infoTop">
            <h4 className="oCard__productName" role="button" tabIndex={0} onClick={goToProduct} onKeyDown={(e) => { if (e.key === 'Enter') goToProduct(); }}>
              {offer.productName || 'Untitled'}
            </h4>
            <span className={`oCard__status oCard__status--${config.cls}`}>
              <span className="oCard__statusIcon">{config.icon}</span>
              {config.label}
            </span>
          </div>

          <div className="oCard__prices">
            <div className="oCard__offerPrice">
              <span className="oCard__priceLabel">
                {isSeller ? 'Their offer' : 'Your offer'}
              </span>
              <span className="oCard__priceAmount">{formatPrice(offer.offerAmount)}</span>
            </div>
            {offer.originalPrice > 0 && (
              <div className="oCard__askingPrice">
                <span className="oCard__priceLabel">Asking</span>
                <span className="oCard__priceAmountSmall">
                  {formatPrice(offer.originalPrice)}
                </span>
              </div>
            )}
            {offer.counterAmount != null && (
              <div className="oCard__counterPrice">
                <span className="oCard__priceLabel">Counter</span>
                <span className="oCard__priceAmountCounter">
                  {formatPrice(offer.counterAmount)}
                </span>
              </div>
            )}
          </div>

          {/* Price bar */}
          {offer.originalPrice > 0 && (
            <div className="oCard__priceBar">
              <div
                className={`oCard__priceBarFill oCard__priceBarFill--${config.cls}`}
                style={{ width: `${Math.min(percentage, 100)}%` }}
              />
              <span className="oCard__priceBarLabel">{percentage}%</span>
            </div>
          )}
        </div>
      </div>

      {/* Message */}
      {offer.message && (
        <div className="oCard__message">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          <span>&ldquo;{offer.message}&rdquo;</span>
        </div>
      )}

      {/* Meta row */}
      <div className="oCard__meta">
        {createdDate && <span className="oCard__date">{createdDate}</span>}
        {offer.paymentMethod && (
          <span className="oCard__metaPill">{offer.paymentMethod.replace('_', ' ')}</span>
        )}
        {offer.deliveryPreference && (
          <span className="oCard__metaPill">{offer.deliveryPreference}</span>
        )}
        <button
          type="button"
          className="oCard__viewAdBtn"
          onClick={goToProduct}
        >
          View ad
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>

      {/* ── Seller Actions ── */}
      {isSeller && status === 'pending' && (
        <div className="oCard__sellerActions">
          <button
            type="button"
            className="oCard__actionBtn oCard__actionBtn--accept"
            onClick={() => handleAction('accepted')}
            disabled={loading}
          >
            {loading && actionType === 'accepted' ? (
              <ButtonSpinner />
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            )}
            Accept
          </button>
          <button
            type="button"
            className="oCard__actionBtn oCard__actionBtn--reject"
            onClick={() => handleAction('rejected')}
            disabled={loading}
          >
            {loading && actionType === 'rejected' ? (
              <ButtonSpinner />
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            )}
            Decline
          </button>
          <button
            type="button"
            className="oCard__actionBtn oCard__actionBtn--counter"
            onClick={() => setShowCounter(!showCounter)}
            disabled={loading}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="1 4 1 10 7 10" />
              <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
            </svg>
            Counter
          </button>
        </div>
      )}

      {/* ── Counter input ── */}
      {isSeller && showCounter && (
        <div className="oCard__counterRow">
          <div className="oCard__counterInputWrap">
            <span className="oCard__counterCurrency">₹</span>
            <input
              type="number"
              min="1"
              value={counterAmount}
              onChange={(e) => setCounterAmount(e.target.value)}
              placeholder="Your price"
              className="oCard__counterInput"
              autoFocus
            />
          </div>
          <button
            type="button"
            className="oCard__counterSendBtn"
            onClick={handleCounter}
            disabled={loading}
          >
            {loading && actionType === 'countered' ? (
              <ButtonSpinner />
            ) : (
              <>
                Send
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}

export default OfferCard;
