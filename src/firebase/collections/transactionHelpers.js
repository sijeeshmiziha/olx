/**
 * Transaction collection helpers.
 */
import { transactionsRef } from './refs';
import { serverTimestamp } from './fieldValues';

export const getTransactionRef = (id) => transactionsRef().doc(id);
export const getTransactionsForBuyer = (buyerId, limit = 50) =>
  transactionsRef()
    .where('buyerId', '==', buyerId)
    .orderBy('createdAt', 'desc')
    .limit(limit);
export const getTransactionsForSeller = (sellerId, limit = 50) =>
  transactionsRef()
    .where('sellerId', '==', sellerId)
    .orderBy('createdAt', 'desc')
    .limit(limit);

export async function createTransaction(data) {
  const now = serverTimestamp();
  const ref = await transactionsRef().add({
    productId: data.productId || '',
    productName: data.productName || '',
    productImage: data.productImage || '',
    buyerId: data.buyerId || '',
    buyerName: data.buyerName || '',
    sellerId: data.sellerId || '',
    sellerName: data.sellerName || '',
    offerId: data.offerId || '',
    amount: data.amount ?? 0,
    originalPrice: data.originalPrice ?? 0,
    paymentMethod: data.paymentMethod || '',
    paymentStatus: data.paymentStatus || 'pending',
    paymentReference: data.paymentReference || '',
    deliveryMethod: data.deliveryMethod || '',
    deliveryStatus: data.deliveryStatus || 'pending',
    deliveryAddress: data.deliveryAddress || {},
    trackingId: data.trackingId || '',
    meetingLocation: data.meetingLocation || {},
    meetingTime: data.meetingTime ?? null,
    status: 'initiated',
    completedAt: null,
    cancelledAt: null,
    cancelReason: '',
    buyerConfirmed: false,
    sellerConfirmed: false,
    reviewId: '',
    createdAt: now,
    updatedAt: now,
  });
  return ref.id;
}
