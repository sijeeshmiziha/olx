import { useState, useEffect } from 'react';
import { userPreferencesRef, getAddressesForUser } from '../../../firebase/collections';
import { silentCatch } from '../../../utils/errorHandler';

const defaultNotifPrefs = { offers: true, messages: true, priceDrops: true };

export function useSettingsData(user) {
  const [notifPrefs, setNotifPrefs] = useState(defaultNotifPrefs);
  const [notifPrefsLoading, setNotifPrefsLoading] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [addressesLoading, setAddressesLoading] = useState(false);

  useEffect(() => {
    if (!user?.uid) return;
    userPreferencesRef()
      .doc(user.uid)
      .get()
      .then((doc) => {
        if (doc.exists && doc.data().notificationSettings) {
          setNotifPrefs((p) => ({ ...p, ...doc.data().notificationSettings }));
        }
      })
      .catch(silentCatch('Settings:loadNotifPrefs'));
  }, [user?.uid]);

  useEffect(() => {
    if (!user?.uid) return;
    setAddressesLoading(true);
    getAddressesForUser(user.uid)
      .get()
      .then((snap) => setAddresses(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }))))
      .catch(silentCatch('Settings:loadAddresses'))
      .finally(() => setAddressesLoading(false));
  }, [user?.uid]);

  return {
    notifPrefs,
    setNotifPrefs,
    notifPrefsLoading,
    setNotifPrefsLoading,
    addresses,
    addressesLoading,
  };
}
