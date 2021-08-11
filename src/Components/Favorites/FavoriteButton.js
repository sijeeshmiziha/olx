import React, { useCallback, useContext, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { AuthContext } from '../../contextStore/AuthContext';
import {
  arrayRemove,
  arrayUnion,
  getProductRef,
  getUserRef,
  increment,
} from '../../firebase/collections';
import { silentCatch } from '../../utils/errorHandler';
import { canProceed, RATE_LIMITS } from '../../utils/rateLimit';
import './FavoriteButton.css';

function FavoriteButton({ productId }) {
  const { user } = useContext(AuthContext);
  const history = useHistory();
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checked, setChecked] = useState(false);
  const togglingRef = useRef(false);

  React.useEffect(() => {
    if (!user?.uid || !productId) return;
    const unsub = getUserRef(user.uid).onSnapshot((doc) => {
      setChecked(true);
      // Skip snapshot updates while a toggle is in-flight so the
      // optimistic state isn't reverted by a stale snapshot.
      if (togglingRef.current) return;
      if (doc.exists) {
        const list = doc.data().savedAds || [];
        setSaved(list.includes(productId));
      }
    });
    return () => unsub && unsub();
  }, [user?.uid, productId]);

  const toggle = useCallback(() => {
    if (!user?.uid || !productId || loading) return;
    if (!canProceed(`favorite:${user.uid}:${productId}`, RATE_LIMITS.FAVORITE_TOGGLE_MS)) return;
    setLoading(true);
    togglingRef.current = true;
    const wasSaved = saved;
    setSaved(!saved); // optimistic UI update
    const ref = getUserRef(user.uid);
    const finish = () => {
      togglingRef.current = false;
      setLoading(false);
    };
    if (wasSaved) {
      ref
        .update({ savedAds: arrayRemove(productId) })
        .then(() => {
          getProductRef(productId)
            .update({ 'stats.favorites': increment(-1) })
            .catch(silentCatch('FavoriteButton:decrementFavorites'));
        })
        .catch(() => setSaved(true)) // revert on failure
        .finally(finish);
    } else {
      ref
        .update({ savedAds: arrayUnion(productId) })
        .then(() => {
          getProductRef(productId)
            .update({ 'stats.favorites': increment(1) })
            .catch(silentCatch('FavoriteButton:incrementFavorites'));
        })
        .catch(() => setSaved(false)) // revert on failure
        .finally(finish);
    }
  }, [user?.uid, productId, loading, saved]);

  const handleClick = (e) => {
    e.stopPropagation();
    if (!user) {
      history.push('/login');
      return;
    }
    if (!checked) return; // wait for saved state to load before allowing toggle
    toggle();
  };

  return (
    <button
      type="button"
      className={`favoriteButton ${saved ? 'saved' : ''} ${!user ? 'favoriteButton--guest' : ''}`}
      onClick={handleClick}
      disabled={loading}
      aria-label={!user ? 'Log in to save ad' : saved ? 'Remove from saved' : 'Save ad'}
    >
      ♥
    </button>
  );
}

export default FavoriteButton;
