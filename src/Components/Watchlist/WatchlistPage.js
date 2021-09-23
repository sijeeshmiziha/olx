import React, { useState, useEffect, useContext } from 'react';
import { WatchlistContext } from '../../contextStore/WatchlistContext';
import { getProductRef } from '../../firebase/collections';
import { formatPrice } from '../../utils/formatters';
import { useHistory } from 'react-router-dom';
import { PostContext } from '../../contextStore/PostContext';
import { CardSkeleton } from '../UI/Skeleton';
import './Watchlist.css';

function WatchlistPage() {
  const { watchlist, removeFromWatchlist } = useContext(WatchlistContext);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const history = useHistory();
  const { setPostContent } = useContext(PostContext);

  useEffect(() => {
    if (watchlist.length === 0) {
      setProducts([]);
      setLoading(false);
      return;
    }
    const promises = watchlist.map((e) =>
      getProductRef(e.productId)
        .get()
        .then((snap) =>
          snap.exists ? { ...snap.data(), id: snap.id, _entry: e } : null
        )
    );
    Promise.all(promises).then((list) => {
      setProducts(list.filter(Boolean));
      setLoading(false);
    });
  }, [watchlist]);

  const goToAd = (p) => {
    if (setPostContent) setPostContent(p);
    history.push('/view');
  };

  return (
    <div className="profilePage">
      <div className="watchlistPage">
        <h2>Price drop alerts</h2>
        <p style={{ margin: '0 0 20px 0', color: '#666' }}>
          We&apos;ll notify you when the price drops to your target.
        </p>
        {loading ? (
          <div className="watchlistGrid">
            {[1, 2, 3, 4].map((i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        ) : products.length === 0 ? (
          <p className="emptyState">
            No items in your watchlist. Add items from ad pages to get price
            alerts.
          </p>
        ) : (
          <div className="watchlistGrid">
            {products.map((p) => {
              const entry =
                p._entry || watchlist.find((e) => e.productId === p.id);
              const currentPrice = Number(p.price) || 0;
              const alertPrice = entry?.alertPrice ?? 0;
              return (
                <div key={p.id} className="watchlistCard">
                  <img
                    src={p.images?.[0] || p.url || ''}
                    alt=""
                    className="watchlistCardImage"
                  />
                  <div className="watchlistCardInfo">
                    <p className="watchlistCardTitle">{p.name}</p>
                    <p className="watchlistCardPrices">
                      Current: {formatPrice(currentPrice)}
                      {alertPrice > 0 &&
                        ` · Alert at: ${formatPrice(alertPrice)}`}
                    </p>
                    <div className="watchlistCardActions">
                      <button type="button" onClick={() => goToAd(p)}>
                        View ad
                      </button>
                      <button
                        type="button"
                        onClick={() => removeFromWatchlist(p.id)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default WatchlistPage;
