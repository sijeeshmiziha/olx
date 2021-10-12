import { priceHistoryRef, serverTimestamp } from './collections';
import { silentCatch } from '../utils/errorHandler'; // used in recordPriceHistory

/**
 * Record a price change for an ad (call when editing and price changes).
 * @param {string} productId
 * @param {number} price - New price
 * @param {number} [previousPrice] - Previous price
 * @param {string} [changedBy] - User ID who changed
 * @param {string} [changeReason] - Reason (e.g. 'seller_edit', 'promotion')
 */
export function recordPriceHistory(productId, price, previousPrice, changedBy, changeReason) {
  if (!productId || price == null) return Promise.resolve();
  const payload = {
    productId,
    price: Number(price),
    changedAt: serverTimestamp(),
  };
  if (previousPrice != null) payload.previousPrice = Number(previousPrice);
  if (changedBy) payload.changedBy = changedBy;
  if (changeReason) payload.changeReason = changeReason;
  return priceHistoryRef()
    .add(payload)
    .catch(silentCatch('priceHistory:recordPriceHistory'));
}

/**
 * Get price history for a product (for display on ad view).
 * @param {string} productId
 * @returns {Promise<Array<{ id: string, price: number, changedAt: Date }>>}
 */
export function getPriceHistory(productId) {
  if (!productId) return Promise.resolve([]);
  return priceHistoryRef()
    .where('productId', '==', productId)
    .orderBy('changedAt', 'desc')
    .limit(20)
    .get()
    .then((snap) =>
      snap.docs.map((doc) => {
        const d = doc.data();
        return {
          id: doc.id,
          price: d.price,
          previousPrice: d.previousPrice,
          changedBy: d.changedBy,
          changeReason: d.changeReason,
          changedAt: d.changedAt?.toDate?.() || d.changedAt,
        };
      })
    )
    .catch(() => []);
}
