import React, { useState, useContext, useEffect, useCallback, useRef } from 'react';
import { createOffer } from '../../firebase/offers';
import { AuthContext } from '../../contextStore/AuthContext';
import { ToastContext } from '../../contextStore/ToastContext';
import { formatPrice } from '../../utils/formatters';
import ButtonSpinner from '../UI/ButtonSpinner';
import './MakeOfferModal.css';

const QUICK_PICKS = [
  { label: '90%', factor: 0.9 },
  { label: '80%', factor: 0.8 },
  { label: '70%', factor: 0.7 },
  { label: '60%', factor: 0.6 },
];

const PAYMENT_OPTIONS = [
  { value: 'cash', label: 'Cash', icon: '₹' },
  { value: 'upi', label: 'UPI', icon: '⚡' },
  { value: 'bank_transfer', label: 'Bank', icon: '🏦' },
];

const DELIVERY_OPTIONS = [
  { value: 'pickup', label: 'Pickup', icon: '📍' },
  { value: 'delivery', label: 'Delivery', icon: '🚚' },
  { value: 'meet', label: 'Meet up', icon: '🤝' },
];

function MakeOfferModal({ product, onClose, onSuccess }) {
  const { user } = useContext(AuthContext);
  const { addToast } = useContext(ToastContext);
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [deliveryPreference, setDeliveryPreference] = useState('pickup');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [step, setStep] = useState(1);
  const [visible, setVisible] = useState(false);
  const [closing, setClosing] = useState(false);
  const sliderRef = useRef(null);
  const inputRef = useRef(null);

  const price = product?.price ? Number(product.price) : 0;
  const numAmount = Number(amount) || 0;
  const percentage = price > 0 ? Math.round((numAmount / price) * 100) : 0;
  const savings = price > 0 ? price - numAmount : 0;
  const productImage = product?.thumbnailUrl || product?.images?.[0] || product?.url || '';

  // Entrance animation
  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
  }, []);

  // Focus input on mount
  useEffect(() => {
    if (inputRef.current) {
      const timer = setTimeout(() => inputRef.current.focus(), 350);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = useCallback(() => {
    setClosing(true);
    setTimeout(() => onClose(), 280);
  }, [onClose]);

  // Escape key handler
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') handleClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [handleClose]);

  const getOfferStrength = () => {
    if (percentage >= 90) return { label: 'Strong offer', cls: 'strong', emoji: '💪' };
    if (percentage >= 75) return { label: 'Good offer', cls: 'good', emoji: '👍' };
    if (percentage >= 60) return { label: 'Fair offer', cls: 'fair', emoji: '🤔' };
    if (percentage > 0) return { label: 'Low offer', cls: 'low', emoji: '⚠️' };
    return { label: '', cls: '', emoji: '' };
  };

  const handleQuickPick = (factor) => {
    const val = Math.round(price * factor);
    setAmount(String(val));
  };

  const handleSliderChange = (e) => {
    const pct = Number(e.target.value);
    const val = Math.round((pct / 100) * price);
    setAmount(String(val));
  };

  const handleAmountChange = (e) => {
    const val = e.target.value.replaceAll(/[^0-9]/g, '');
    setAmount(val);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!numAmount || numAmount <= 0) {
      addToast('Please enter a valid amount', 'error');
      return;
    }
    if (!user?.uid || !product?.userId || user.uid === product.userId) {
      addToast('Cannot make offer', 'error');
      return;
    }
    setLoading(true);
    createOffer({
      productId: product.id,
      productName: product.name,
      productImage,
      sellerId: product.userId,
      buyerId: user.uid,
      offerAmount: numAmount,
      originalPrice: price,
      message: message.trim(),
      paymentMethod,
      deliveryPreference,
    })
      .then(() => {
        setSuccess(true);
        setTimeout(() => {
          addToast('Offer sent successfully!', 'success');
          onSuccess?.();
          handleClose();
        }, 1400);
      })
      .catch((err) => {
        addToast(err.message || 'Failed to send offer', 'error');
      })
      .finally(() => setLoading(false));
  };

  const strength = getOfferStrength();

  const canGoNext = numAmount > 0;

  // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
  return (
    <div
      className={`makeOffer__overlay ${visible ? 'makeOffer__overlay--visible' : ''} ${closing ? 'makeOffer__overlay--closing' : ''}`}
      onClick={handleClose}
    >
      <dialog
        open
        className={`makeOffer__modal ${visible ? 'makeOffer__modal--visible' : ''} ${closing ? 'makeOffer__modal--closing' : ''} ${success ? 'makeOffer__modal--success' : ''}`}
        onClick={(e) => e.stopPropagation()}
        aria-label="Make an offer"
      >
        {/* ── Success Overlay ── */}
        {success && (
          <div className="makeOffer__successOverlay">
            <div className="makeOffer__successIcon">
              <svg viewBox="0 0 52 52" className="makeOffer__checkmark">
                <circle cx="26" cy="26" r="25" fill="none" className="makeOffer__checkCircle" />
                <path fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" className="makeOffer__checkPath" />
              </svg>
            </div>
            <h3 className="makeOffer__successTitle">Offer Sent!</h3>
            <p className="makeOffer__successText">
              {formatPrice(numAmount)} for {product?.name}
            </p>
          </div>
        )}

        {/* ── Header ── */}
        <div className="makeOffer__header">
          <div className="makeOffer__headerLeft">
            <div className="makeOffer__badge">Make an Offer</div>
            <div className="makeOffer__steps">
              <span className={`makeOffer__stepDot ${step >= 1 ? 'makeOffer__stepDot--active' : ''}`} />
              <span className="makeOffer__stepLine" />
              <span className={`makeOffer__stepDot ${step >= 2 ? 'makeOffer__stepDot--active' : ''}`} />
            </div>
          </div>
          <button className="makeOffer__close" onClick={handleClose} aria-label="Close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* ── Product Preview ── */}
        <div className="makeOffer__product">
          {productImage && (
            <div className="makeOffer__productImg">
              <img src={productImage} alt={product?.name || 'Product'} />
            </div>
          )}
          <div className="makeOffer__productInfo">
            <h4 className="makeOffer__productName">{product?.name}</h4>
            <div className="makeOffer__askingPrice">
              <span className="makeOffer__priceLabel">Asking price</span>
              <span className="makeOffer__priceValue">{formatPrice(price)}</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="makeOffer__form">
          {/* ── Step 1: Price ── */}
          <div className={`makeOffer__step ${step === 1 ? 'makeOffer__step--active' : 'makeOffer__step--hidden'}`}>
            {/* Amount input */}
            <div className="makeOffer__amountSection">
              <label className="makeOffer__label" htmlFor="offerAmountInput">Your offer</label>
              <div className="makeOffer__amountWrapper">
                <span className="makeOffer__currencySymbol">₹</span>
                <input
                  ref={inputRef}
                  type="text"
                  inputMode="numeric"
                  id="offerAmountInput"
                  className="makeOffer__amountInput"
                  value={amount ? Number(amount).toLocaleString('en-IN') : ''}
                  onChange={handleAmountChange}
                  placeholder="0"
                />
              </div>

              {/* Strength indicator */}
              {numAmount > 0 && price > 0 && (
                <div className={`makeOffer__strength makeOffer__strength--${strength.cls}`}>
                  <span className="makeOffer__strengthEmoji">{strength.emoji}</span>
                  <span className="makeOffer__strengthLabel">{strength.label}</span>
                  <span className="makeOffer__strengthPct">{percentage}% of asking price</span>
                </div>
              )}
            </div>

            {/* Slider */}
            {price > 0 && (
              <div className="makeOffer__sliderSection">
                <input
                  ref={sliderRef}
                  type="range"
                  min="10"
                  max="100"
                  value={Math.max(10, Math.min(100, percentage))}
                  onChange={handleSliderChange}
                  className={`makeOffer__slider makeOffer__slider--${strength.cls || 'neutral'}`}
                  style={{ '--slider-pct': `${Math.min(100, Math.max(0, percentage))}%` }}
                />
                <div className="makeOffer__sliderLabels">
                  <span>10%</span>
                  <span>100%</span>
                </div>
              </div>
            )}

            {/* Quick picks */}
            {price > 0 && (
              <div className="makeOffer__quickPicks">
                {QUICK_PICKS.map((qp) => {
                  const val = Math.round(price * qp.factor);
                  const isActive = numAmount === val;
                  return (
                    <button
                      key={qp.label}
                      type="button"
                      className={`makeOffer__quickPick ${isActive ? 'makeOffer__quickPick--active' : ''}`}
                      onClick={() => handleQuickPick(qp.factor)}
                    >
                      <span className="makeOffer__quickPickPct">{qp.label}</span>
                      <span className="makeOffer__quickPickVal">{formatPrice(val)}</span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Savings callout */}
            {numAmount > 0 && savings > 0 && (
              <div className="makeOffer__savings">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                  <polyline points="17 6 23 6 23 12" />
                </svg>
                You save <strong>{formatPrice(savings)}</strong>
              </div>
            )}

            {/* Next button */}
            <button
              type="button"
              className="makeOffer__nextBtn"
              disabled={!canGoNext}
              onClick={() => setStep(2)}
            >
              Continue
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>

          {/* ── Step 2: Details ── */}
          <div className={`makeOffer__step ${step === 2 ? 'makeOffer__step--active' : 'makeOffer__step--hidden'}`}>
            {/* Summary bar */}
            <div className="makeOffer__summaryBar">
              <span>Your offer:</span>
              <strong>{formatPrice(numAmount)}</strong>
              <button type="button" className="makeOffer__editBtn" onClick={() => setStep(1)}>
                Edit
              </button>
            </div>

            {/* Message */}
            <div className="makeOffer__fieldGroup">
              <label className="makeOffer__label" htmlFor="offerMessage">
                Message
                <span className="makeOffer__labelHint">optional</span>
              </label>
              <div className="makeOffer__textareaWrapper">
                <textarea
                  id="offerMessage"
                  className="makeOffer__textarea"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Hi! I'm interested in this item..."
                  rows={3}
                  maxLength={500}
                />
                <span className="makeOffer__charCount">{message.length}/500</span>
              </div>
            </div>

            {/* Payment pills */}
            <div className="makeOffer__fieldGroup">
              <span className="makeOffer__label" id="paymentLabel">Payment method</span>
              <div className="makeOffer__pillGroup" role="group" aria-labelledby="paymentLabel">
                {PAYMENT_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    className={`makeOffer__pill ${paymentMethod === opt.value ? 'makeOffer__pill--active' : ''}`}
                    onClick={() => setPaymentMethod(opt.value)}
                  >
                    <span className="makeOffer__pillIcon">{opt.icon}</span>
                    <span className="makeOffer__pillLabel">{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Delivery pills */}
            <div className="makeOffer__fieldGroup">
              <span className="makeOffer__label" id="deliveryLabel">Delivery preference</span>
              <div className="makeOffer__pillGroup" role="group" aria-labelledby="deliveryLabel">
                {DELIVERY_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    className={`makeOffer__pill ${deliveryPreference === opt.value ? 'makeOffer__pill--active' : ''}`}
                    onClick={() => setDeliveryPreference(opt.value)}
                  >
                    <span className="makeOffer__pillIcon">{opt.icon}</span>
                    <span className="makeOffer__pillLabel">{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="makeOffer__actions">
              <button type="button" className="makeOffer__backBtn" onClick={() => setStep(1)}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
                Back
              </button>
              <button type="submit" className="makeOffer__submitBtn" disabled={loading || !canGoNext}>
                {loading ? (
                  <>
                    <ButtonSpinner />
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="22" y1="2" x2="11" y2="13" />
                      <polygon points="22 2 15 22 11 13 2 9 22 2" />
                    </svg>
                    <span>Send Offer</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </dialog>
    </div>
  );
}

export default MakeOfferModal;
