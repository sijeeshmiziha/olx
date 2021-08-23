import React, { useState, useRef, useCallback } from 'react';
import { QUICK_REPLIES } from '../../data/quickReplies';
import './Chat.css';

const TYPING_DEBOUNCE_MS = 500;

function ChatInput({ onSend, disabled, onTyping }) {
  const [text, setText] = useState('');
  const typingTimeoutRef = useRef(null);

  const setTyping = useCallback(
    (isTyping) => {
      if (onTyping) onTyping(isTyping);
    },
    [onTyping]
  );

  const handleChange = (e) => {
    setText(e.target.value);
    if (!onTyping) return;
    setTyping(true);
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => setTyping(false), TYPING_DEBOUNCE_MS);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (trimmed && onSend) {
      onSend(trimmed);
      setText('');
      setTyping(false);
    }
  };

  const sendQuickReply = (msg) => {
    if (onSend) {
      onSend(msg);
    }
  };

  return (
    <>
      <div className="chatQuickReplies">
        {QUICK_REPLIES.map((msg) => (
          <button
            key={msg}
            type="button"
            className="chatQuickReplyBtn"
            onClick={() => sendQuickReply(msg)}
            disabled={disabled}
          >
            {msg}
          </button>
        ))}
      </div>
      <form className="chatInputForm" onSubmit={handleSubmit}>
        <input
          type="text"
          className="chatInputField"
          placeholder="Type a message..."
          value={text}
          onChange={handleChange}
          onBlur={() => setTyping(false)}
          disabled={disabled}
        />
        <button
          type="submit"
          className="chatInputBtn"
          disabled={disabled || !text.trim()}
        >
          Send
        </button>
      </form>
    </>
  );
}

export default ChatInput;
