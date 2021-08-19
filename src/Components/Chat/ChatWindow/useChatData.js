import { useState, useEffect } from 'react';
import { Firebase } from '../../../firebase/config';
import { getConversationRef, getMessagesRef } from '../../../firebase/collections';

export function useChatData(conversationId, currentUserId) {
  const [messages, setMessages] = useState([]);
  const [product, setProduct] = useState(null);
  const [otherUserName, setOtherUserName] = useState('');
  const [otherUserId, setOtherUserId] = useState('');
  const [otherUserAvatar, setOtherUserAvatar] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setOtherUserId('');
    setOtherUserName('');
    setOtherUserAvatar('');
    setProduct(null);
    setMessages([]);
    setLoading(true);
    setError(null);
  }, [conversationId]);

  useEffect(() => {
    if (!conversationId || !currentUserId) return;
    getConversationRef(conversationId)
      .get()
      .then((doc) => {
        if (!doc.exists) {
          setLoading(false);
          return;
        }
        const data = doc.data();
        const otherId = (data.participants || []).find((p) => p !== currentUserId);
        if (data.productId) {
          Firebase.firestore()
            .collection('products')
            .doc(data.productId)
            .get()
            .then((pDoc) => pDoc.exists && setProduct({ id: pDoc.id, ...pDoc.data() }));
        }
        if (otherId) {
          setOtherUserId(otherId);
          Firebase.firestore()
            .collection('users')
            .doc(otherId)
            .get()
            .then((uDoc) => {
              if (uDoc.exists) {
                const uData = uDoc.data();
                setOtherUserName(uData.name || 'User');
                setOtherUserAvatar(uData.avatar || '');
              }
            });
        }
      });
  }, [conversationId, currentUserId]);

  useEffect(() => {
    if (!conversationId) return;
    setError(null);
    const unsub = getMessagesRef(conversationId)
      .orderBy('timestamp', 'asc')
      .onSnapshot(
        (snapshot) => {
          setMessages(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
          setLoading(false);
          setError(null);
        },
        (err) => {
          console.error('ChatWindow: failed to load messages', err);
          setError('Failed to load messages. Please try again.');
          setLoading(false);
        }
      );
    return () => unsub && unsub();
  }, [conversationId]);

  return {
    messages,
    product,
    otherUserName,
    otherUserId,
    otherUserAvatar,
    loading,
    error,
  };
}
