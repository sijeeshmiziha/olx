import React, {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { notificationsRef } from '../firebase/collections';
import { Firebase } from '../firebase/config';
import { silentCatch } from '../utils/errorHandler';
import { AuthContext } from './AuthContext';

export const NotificationContext = createContext(null);

function NotificationProvider({ children }) {
  const { user } = React.useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!user?.uid) {
      setNotifications([]);
      setUnreadCount(0);
      return;
    }
    const q = notificationsRef()
      .where('userId', '==', user.uid)
      .orderBy('createdAt', 'desc')
      .limit(50);
    const unsubscribe = q.onSnapshot(
      (snapshot) => {
        const list = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate?.()?.getTime?.() || 0,
        }));
        setNotifications(list);
        const unread = list.filter((n) => n.read !== true).length;
        setUnreadCount(unread);
      },
      (err) => {
        console.error('NotificationContext listener error:', err);
        setNotifications([]);
        setUnreadCount(0);
      }
    );
    return () => unsubscribe();
  }, [user?.uid]);

  const markAsRead = useCallback(
    (notificationId) => {
      if (!notificationId || !user?.uid) return;
      const doc = notificationsRef().doc(notificationId);
      doc.get().then((snap) => {
        if (snap.exists && snap.data().userId === user.uid) {
          doc.update({ read: true });
        }
      });
    },
    [user?.uid]
  );

  const markAllRead = useCallback(() => {
    if (!user?.uid) return;
    const batch = Firebase.firestore().batch();
    notifications
      .filter((n) => !n.read)
      .forEach((n) => {
        batch.update(notificationsRef().doc(n.id), { read: true });
      });
    batch.commit().catch(silentCatch('NotificationContext:markAllRead'));
  }, [user?.uid, notifications]);

  const value = useMemo(
    () => ({
      notifications,
      unreadCount,
      markAsRead,
      markAllRead,
    }),
    [notifications, unreadCount, markAsRead, markAllRead]
  );

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export default NotificationProvider;
