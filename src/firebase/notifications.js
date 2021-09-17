/**
 * Helpers for creating and managing notifications.
 * Notifications are stored in Firestore collection "notifications".
 */

import { notificationsRef, serverTimestamp } from './collections';
import { getProductRef } from './collections';

/**
 * Create a notification for a user.
 * @param {string} userId - Recipient user id
 * @param {string} type - offer | message | price_drop | review | system
 * @param {string} title - Short title
 * @param {string} body - Notification body text
 * @param {object} data - Optional payload (productId, offerId, etc.)
 */
export function createNotification(userId, type, title, body, data = {}) {
  if (!userId) return Promise.resolve();
  return notificationsRef().add({
    userId,
    type: type || 'system',
    title: title || '',
    body: body || '',
    data: data || {},
    read: false,
    createdAt: serverTimestamp(),
  });
}

/**
 * Notify users who have this product in watchlist with alertPrice >= newPrice.
 * Call after updating product price. product doc should have watchers: { [userId]: alertPrice }.
 */
export function notifyPriceDrop(productId, newPrice, productName) {
  const numPrice = Number(newPrice);
  if (!productId || isNaN(numPrice)) return Promise.resolve();
  return getProductRef(productId)
    .get()
    .then((doc) => {
      if (!doc.exists) return;
      const watchers = doc.data().watchers || {};
      const promises = [];
      Object.keys(watchers).forEach((userId) => {
        const alertPrice = Number(watchers[userId]);
        if (!isNaN(alertPrice) && numPrice <= alertPrice) {
          promises.push(
            createNotification(
              userId,
              'price_drop',
              'Price drop alert',
              `"${productName || 'An ad'}" is now ₹${numPrice.toLocaleString('en-IN')} (your alert was ₹${alertPrice.toLocaleString('en-IN')})`,
              { productId }
            )
          );
        }
      });
      return Promise.all(promises);
    });
}
