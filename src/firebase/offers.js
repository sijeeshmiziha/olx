import { offersRef, serverTimestamp, getOrCreateConversation, getMessagesRef, getConversationRef } from './collections';
import { createNotification } from './notifications';

const OFFER_EXPIRY_MS = 48 * 60 * 60 * 1000;

export async function createOffer({
  productId,
  productName,
  productImage,
  sellerId,
  buyerId,
  offerAmount,
  originalPrice,
  message,
  paymentMethod,
  deliveryPreference,
  meetingTime,
}) {
  const expiresAt = new Date(Date.now() + OFFER_EXPIRY_MS);
  const amt = Number(offerAmount) || 0;

  // 1. Create the offer document
  const offerRef = await offersRef().add({
    productId,
    productName: productName || '',
    productImage: productImage || '',
    buyerId,
    sellerId,
    offerAmount: amt,
    originalPrice: Number(originalPrice) || 0,
    status: 'pending',
    counterAmount: null,
    message: message || '',
    paymentMethod: paymentMethod || '',
    deliveryPreference: deliveryPreference || '',
    meetingTime: meetingTime || null,
    negotiationHistory: [{ amount: amt, by: buyerId, timestamp: new Date(), message: message || '' }],
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    expiresAt: expiresAt,
  });

  const offerId = offerRef.id;

  // 2. Get or create a conversation and send the offer as a chat message
  try {
    const conversationId = await getOrCreateConversation(
      buyerId,
      sellerId,
      productId,
      productName,
      productImage,
      Number(originalPrice) || 0
    );

    if (conversationId) {
      const offerText = `Made an offer of ₹${amt.toLocaleString('en-IN')}`;
      await getMessagesRef(conversationId).add({
        senderId: buyerId,
        text: message ? `${offerText}\n"${message}"` : offerText,
        type: 'offer',
        offerAmount: amt,
        originalPrice: Number(originalPrice) || 0,
        offerId,
        timestamp: serverTimestamp(),
        read: false,
      });
      await getConversationRef(conversationId).update({
        lastMessage: offerText,
        lastMessageSender: buyerId,
        lastMessageType: 'offer',
        lastMessageAt: serverTimestamp(),
      });
    }
  } catch (err) {
    console.error('createOffer: failed to send chat message', err);
    // Don't fail the offer if chat message fails
  }

  // 3. Send notification to seller
  createNotification(
    sellerId,
    'offer',
    'New offer received',
    `Someone offered ₹${amt.toLocaleString('en-IN')} for "${productName || 'your ad'}"`,
    { productId, offerId }
  );

  return offerId;
}

export function updateOfferStatus(offerId, status, counterAmount) {
  const doc = offersRef().doc(offerId);
  const updates = {
    status,
    updatedAt: serverTimestamp(),
  };
  if (counterAmount != null) updates.counterAmount = Number(counterAmount);
  return doc.update(updates);
}
