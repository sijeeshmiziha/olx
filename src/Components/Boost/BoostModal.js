import React, { useEffect, useRef, useState } from 'react';
import { ToastContext } from '../../contextStore/ToastContext';
import { getProductRef } from '../../firebase/collections';
import ButtonSpinner from '../UI/ButtonSpinner';
import './Boost.css';

const DURATIONS = [
  { days: 1, label: '1 day' },
  { days: 3, label: '3 days' },
  { days: 7, label: '7 days' },
];

const LEVELS = [
  { value: 1, label: 'Basic' },
  { value: 2, label: 'Premium' },
  { value: 3, label: 'Featured' },
];

function BoostModal({ product, onClose, onSuccess }) {
  const { addToast } = React.useContext(ToastContext);
  const [duration, setDuration] = useState(7);
  const [level, setLevel] = useState(1);
  const [loading, setLoading] = useState(false);
  const mountedRef = useRef(true);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const handleBoost = (e) => {
    e.preventDefault();
    if (!product?.id) return;
    setLoading(true);
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + duration);
    getProductRef(product.id)
      .update({
        isBoosted: true,
        boostExpiry: expiry,
        boostLevel: level,
      })
      .then(() => {
        addToast('Ad boosted successfully!', 'success');
        onSuccess && onSuccess();
        onClose();
      })
      .catch(() => addToast('Failed to boost ad', 'error'))
      .finally(() => {
        if (mountedRef.current) {
          setLoading(false);
        }
      });
  };

  return (
    <div className="boostOverlay" onClick={onClose}>
      <div className="boostModal" onClick={(e) => e.stopPropagation()}>
        <h3>Boost your ad</h3>
        <p className="boostProductName">{product?.name}</p>
        <form onSubmit={handleBoost}>
          <label>Duration</label>
          <select
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
          >
            {DURATIONS.map((d) => (
              <option key={d.days} value={d.days}>
                {d.label}
              </option>
            ))}
          </select>
          <label>Boost level</label>
          <select
            value={level}
            onChange={(e) => setLevel(Number(e.target.value))}
          >
            {LEVELS.map((l) => (
              <option key={l.value} value={l.value}>
                {l.label}
              </option>
            ))}
          </select>
          <div className="boostActions">
            <button type="button" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" disabled={loading}>
              {loading && <ButtonSpinner />}Boost ad
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default BoostModal;
