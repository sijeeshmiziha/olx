/**
 * Conversation and messages helpers.
 */
import { conversationsRef } from './refs';
import { serverTimestamp } from './fieldValues';

export const getConversationRef = (id) => conversationsRef().doc(id);
export const getMessagesRef = (conversationId) =>
  getConversationRef(conversationId).collection('messages');
export const getConversationsForUser = (userId) =>
  conversationsRef()
    .where('participants', 'array-contains', userId)
    .orderBy('lastMessageAt', 'desc');

export async function getOrCreateConversation(
  buyerId,
  sellerId,
  productId,
  productName,
  productImage = '',
  productPrice = 0
) {
  if (buyerId === sellerId || !productId) return null;
  const snapshot = await conversationsRef()
    .where('participants', 'array-contains', buyerId)
    .get();
  const existing = snapshot.docs.find(
    (d) =>
      d.data().productId === productId &&
      (d.data().participants || []).includes(sellerId)
  );
  if (existing) return existing.id;
  const now = serverTimestamp();
  const ref = await conversationsRef().add({
    participants: [buyerId, sellerId],
    buyerId,
    sellerId,
    productId,
    productName: productName || '',
    productImage: productImage || '',
    productPrice: productPrice || 0,
    productStatus: 'active',
    status: 'active',
    lastMessage: '',
    lastMessageSender: '',
    lastMessageType: 'text',
    lastMessageAt: now,
    typing: {},
    unreadCount: { [buyerId]: 0, [sellerId]: 0 },
    pinnedBy: [],
    mutedBy: [],
    createdAt: now,
    archivedAt: null,
  });
  return ref.id;
}
