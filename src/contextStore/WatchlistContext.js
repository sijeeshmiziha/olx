import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { getProductRef, getUserRef } from '../firebase/collections';
import { Firebase } from '../firebase/config';
import { AuthContext } from './AuthContext';

export const WatchlistContext = React.createContext(null);

function WatchlistProvider({ children }) {
  const { user } = React.useContext(AuthContext);
  const [watchlist, setWatchlist] = useState([]);

  useEffect(() => {
    if (!user?.uid) {
      setWatchlist([]);
      return;
    }
    const unsub = getUserRef(user.uid).onSnapshot(
      (doc) => {
        const data = doc.exists ? doc.data() : {};
        setWatchlist(data.watchlist || []);
      },
      (err) => {
        console.error('WatchlistContext listener error:', err);
        setWatchlist([]);
      }
    );
    return () => unsub();
  }, [user?.uid]);

  const addToWatchlist = useCallback(
    (productId, alertPrice) => {
      if (!user?.uid || !productId)
        return Promise.reject(new Error('Not signed in'));
      const price = Number(alertPrice) || 0;
      const entry = {
        productId,
        alertPrice: price,
        addedAt: Date.now(),
      };
      const userRef = getUserRef(user.uid);
      return userRef.get().then((doc) => {
        const list = (doc.exists ? doc.data().watchlist : []) || [];
        if (list.some((e) => e.productId === productId))
          return Promise.resolve();
        return userRef
          .update({
            watchlist: Firebase.firestore.FieldValue.arrayUnion(entry),
          })
          .then(() => {
            return getProductRef(productId).update({
              [`watchers.${user.uid}`]: price,
            });
          });
      });
    },
    [user?.uid]
  );

  const removeFromWatchlist = useCallback(
    (productId) => {
      if (!user?.uid || !productId)
        return Promise.reject(new Error('Not signed in'));
      const userRef = getUserRef(user.uid);
      return userRef.get().then((doc) => {
        const list = (doc.exists ? doc.data().watchlist : []) || [];
        const entry = list.find((e) => e.productId === productId);
        if (!entry) return Promise.resolve();
        return userRef
          .update({
            watchlist: Firebase.firestore.FieldValue.arrayRemove(entry),
          })
          .then(() => {
            return getProductRef(productId).update({
              [`watchers.${user.uid}`]: Firebase.firestore.FieldValue.delete(),
            });
          });
      });
    },
    [user?.uid]
  );

  const isWatching = useCallback(
    (productId) => watchlist.some((e) => e.productId === productId),
    [watchlist]
  );

  const value = useMemo(
    () => ({
      watchlist,
      addToWatchlist,
      removeFromWatchlist,
      isWatching,
    }),
    [watchlist, addToWatchlist, removeFromWatchlist, isWatching]
  );

  return (
    <WatchlistContext.Provider value={value}>
      {children}
    </WatchlistContext.Provider>
  );
}

export default WatchlistProvider;
