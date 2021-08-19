import { useState, useEffect } from 'react';
import { getConversationRef } from '../../../firebase/collections';
import { silentCatch } from '../../../utils/errorHandler';

export function useChatTyping(conversationId, currentUserId) {
  const [otherUserTyping, setOtherUserTyping] = useState(false);

  useEffect(() => {
    if (!conversationId || !currentUserId) return;
    const unsub = getConversationRef(conversationId).onSnapshot(
      (doc) => {
        if (!doc.exists) return;
        const data = doc.data();
        const otherId = (data.participants || []).find((p) => p !== currentUserId);
        const typing = data.typing || {};
        setOtherUserTyping(Boolean(otherId && typing[otherId]));
      },
      () => {}
    );
    return () => unsub && unsub();
  }, [conversationId, currentUserId]);

  const handleTyping = (isTyping) => {
    if (!conversationId || !currentUserId) return;
    getConversationRef(conversationId)
      .update({ [`typing.${currentUserId}`]: isTyping })
      .catch(silentCatch('ChatWindow:handleTyping'));
  };

  return { otherUserTyping, handleTyping };
}
