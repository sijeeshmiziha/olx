import React, { useState, useContext } from 'react';
import { WatchlistContext } from '../../contextStore/WatchlistContext';
import { AuthContext } from '../../contextStore/AuthContext';
import { ToastContext } from '../../contextStore/ToastContext';
import { useHistory } from 'react-router-dom';
import { formatPrice } from '../../utils/formatters';
import './Watchlist.css';

function WatchButton({ productId, productName, currentPrice }) {
  const { user } = useContext(AuthContext);
  const { addToWatchlist, removeFromWatchlist, isWatching } =
    useContext(WatchlistContext);
  const { addToast } = useContext(ToastContext);
  const history = useHistory();
  const [showModal, setShowModal] = useState(false);
  const [alertPrice, setAlertPrice] = useState('');
  const [loading, setLoading] = useState(false);

  const watching = isWatching(productId);
  const price = Number(currentPrice) || 0;

  const handleAdd = () => {
    if (!user) {
      history.push('/login');
      return;
    }
    setShowModal(true);
  };

  const handleRemove = () => {
    if (!user) return;
    setLoading(true);
    removeFromWatchlist(productId)
      .then(() => addToast('Removed from watchlist', 'success'))
      .catch(() => addToast('Failed to remove', 'error'))
      .finally(() => setLoading(false));
  };

  const handleSubmitAlert = (e) => {
    e.preventDefault();
    const num = Number(alertPrice);
    if (!num || num <= 0) {
      addToast('Enter a valid price', 'error');
      return;
    }
    setLoading(true);
    addToWatchlist(productId, num)
      .then(() => {
        addToast('Price alert set!', 'success');
        setShowModal(false);
        setAlertPrice('');
      })
      .catch(() => addToast('Failed to add', 'error'))
      .finally(() => setLoading(false));
  };

  if (!productId) return null;

  return (
    <>
      {watching ? (
        <button
          type="button"
          className="watchlistBtn watchlistBtnActive"
          onClick={handleRemove}
          disabled={loading}
          title="Remove from watchlist"
        >
          &#128276; Watching
        </button>
      ) : (
        <button
          type="button"
          className="watchlistBtn"
          onClick={handleAdd}
          title="Get price drop alert"
        >
          Watch
        </button>
      )}
      {showModal && (
        <div className="watchlistOverlay" onClick={() => setShowModal(false)}>
          <div className="watchlistModal" onClick={(e) => e.stopPropagation()}>
            <h3>Price drop alert</h3>
            <p className="watchlistModalProduct">{productName}</p>
            <p className="watchlistModalPrice">Current: {formatPrice(price)}</p>
            <form onSubmit={handleSubmitAlert}>
              <label>Notify me when price drops to (₹) or below</label>
              <input
                type="number"
                min="1"
                value={alertPrice}
                onChange={(e) => setAlertPrice(e.target.value)}
                placeholder="Enter amount"
              />
              <div className="watchlistModalActions">
                <button type="button" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" disabled={loading}>
                  {loading ? 'Adding...' : 'Add'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default WatchButton;
