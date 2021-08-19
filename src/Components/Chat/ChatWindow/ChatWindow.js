import React, { useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { getConversationRef, getMessagesRef, serverTimestamp } from '../../../firebase/collections';
import { canProceed, RATE_LIMITS } from '../../../utils/rateLimit';
import BarLoading from '../../Loading/BarLoading';
import ChatHeader from '../ChatHeader';
import ChatInput from '../ChatInput';
import ChatMessagesList from './ChatMessagesList';
import { useChatData } from './useChatData';
import { useChatTyping } from './useChatTyping';
import '../Chat.css';

export default function ChatWindow({ conversationId, currentUserId }) {
  const [sendError, setSendError] = React.useState(null);
  const messagesContainerRef = useRef(null);
  const messagesEndRef = useRef(null);

  const { messages, product, otherUserName, otherUserId, otherUserAvatar, loading, error } = useChatData(conversationId, currentUserId);
  const { otherUserTyping, handleTyping } = useChatTyping(conversationId, currentUserId);

  const scrollToBottom = useCallback((smooth = true) => {
    const container = messagesContainerRef.current;
    if (container) container.scrollTo({ top: container.scrollHeight, behavior: smooth ? 'smooth' : 'auto' });
  }, []);

  useEffect(() => {
    if (messages.length > 0) requestAnimationFrame(() => scrollToBottom(true));
  }, [messages.length, scrollToBottom]);

  const sendMessage = async (text) => {
    if (!conversationId || !currentUserId) return;
    if (!canProceed(`chatSend:${conversationId}`, RATE_LIMITS.CHAT_MESSAGE_MS)) {
      setSendError('Please wait a moment before sending another message.');
      return;
    }
    setSendError(null);
    try {
      await getMessagesRef(conversationId).add({
        senderId: currentUserId,
        text,
        timestamp: serverTimestamp(),
        read: false,
      });
      await getConversationRef(conversationId).update({
        lastMessage: text,
        lastMessageAt: serverTimestamp(),
      });
    } catch (err) {
      console.error('ChatWindow: failed to send message', err);
      setSendError('Failed to send message. Please try again.');
    }
  };

  if (loading && messages.length === 0) return <BarLoading />;
  if (!conversationId) {
    return (
      <div className="messagesEmpty messagesEmptyMain">
        <p>Select a conversation or start a chat from an ad.</p>
      </div>
    );
  }
  if (error) {
    return (
      <div className="chatWindow">
        <ChatHeader product={product} otherUserName={otherUserName} otherUserId={otherUserId} otherUserAvatar={otherUserAvatar} />
        <div className="messagesEmpty messagesEmptyMain messagesError"><p>{error}</p></div>
      </div>
    );
  }

  return (
    <div className="chatWindow">
      <ChatHeader product={product} otherUserName={otherUserName} otherUserId={otherUserId} otherUserAvatar={otherUserAvatar} />
      {product && (
        <Link to={`/ad/${product.id}`} className="chatProductCard chatProductCardLink">
          <img src={product.images?.[0] || product.url} alt="" />
          <div className="chatProductCardInfo">
            <strong>{product.name}</strong>
            <span>₹ {product.price}</span>
          </div>
          <span className="chatProductCardArrow">›</span>
        </Link>
      )}
      <div className="chatMessages" ref={messagesContainerRef}>
        <ChatMessagesList messages={messages} currentUserId={currentUserId} loading={loading} />
        <div ref={messagesEndRef} />
      </div>
      {sendError && <div className="chatSendError" role="alert">{sendError}</div>}
      {otherUserTyping && <div className="chatTypingIndicator">{otherUserName || 'Someone'} is typing...</div>}
      <ChatInput onSend={sendMessage} disabled={!currentUserId} onTyping={handleTyping} />
    </div>
  );
}
