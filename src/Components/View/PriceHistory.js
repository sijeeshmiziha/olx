import React, { useState, useEffect } from 'react';
import { getPriceHistory } from '../../firebase/priceHistory';
import { formatPrice } from '../../utils/formatters';
import './PriceHistory.css';

function PriceHistory({ productId }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!productId) return;
    setLoading(true);
    getPriceHistory(productId)
      .then(setHistory)
      .finally(() => setLoading(false));
  }, [productId]);

  if (loading || history.length === 0) return null;

  const formatDate = (d) => {
    if (!d) return '';
    const date = d instanceof Date ? d : new Date(d);
    return date.toLocaleDateString(undefined, {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <div className="priceHistoryBlock">
      <h3 className="priceHistoryTitle">Price history</h3>
      <ul className="priceHistoryList">
        {history.map((h) => (
          <li key={h.id} className="priceHistoryItem">
            <span className="priceHistoryPrice">{formatPrice(h.price)}</span>
            {h.previousPrice != null && (
              <span className="priceHistoryPrevious"> was {formatPrice(h.previousPrice)}</span>
            )}
            {h.changeReason && (
              <span className="priceHistoryReason"> ({h.changeReason})</span>
            )}
            <span className="priceHistoryDate">{formatDate(h.changedAt)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PriceHistory;
