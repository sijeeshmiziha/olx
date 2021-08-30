import React, { createContext, useEffect, useMemo, useState } from 'react';
import { offersRef } from '../firebase/collections';
import { AuthContext } from './AuthContext';

export const OfferContext = createContext(null);

function OfferProvider({ children }) {
  const { user } = React.useContext(AuthContext);
  const [sentOffers, setSentOffers] = useState([]);
  const [receivedOffers, setReceivedOffers] = useState([]);

  useEffect(() => {
    if (!user?.uid) {
      setSentOffers([]);
      setReceivedOffers([]);
      return;
    }
    const unsubSent = offersRef()
      .where('buyerId', '==', user.uid)
      .orderBy('createdAt', 'desc')
      .onSnapshot(
        (snap) => {
          setSentOffers(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
        },
        (err) => {
          console.error('OfferContext sentOffers listener error:', err);
          setSentOffers([]);
        }
      );
    const unsubReceived = offersRef()
      .where('sellerId', '==', user.uid)
      .orderBy('createdAt', 'desc')
      .onSnapshot(
        (snap) => {
          setReceivedOffers(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
        },
        (err) => {
          console.error('OfferContext receivedOffers listener error:', err);
          setReceivedOffers([]);
        }
      );
    return () => {
      unsubSent();
      unsubReceived();
    };
  }, [user?.uid]);

  const value = useMemo(
    () => ({
      sentOffers,
      receivedOffers,
    }),
    [sentOffers, receivedOffers]
  );

  return (
    <OfferContext.Provider value={value}>{children}</OfferContext.Provider>
  );
}

export default OfferProvider;
