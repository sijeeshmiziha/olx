import React from 'react';
import './Chat.css';

function ChatBubble({ message, isOwn }) {
  const ts = message?.timestamp;
  const d = ts
    ? ts?.toDate
      ? ts.toDate()
      : ts?.seconds
        ? new Date(ts.seconds * 1000)
        : new Date(ts)
    : null;
  const dateStr = d
    ? d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
    : '';

  if (message?.type === 'offer') {
    const amt = Number(message.offerAmount) || 0;
    const orig = Number(message.originalPrice) || 0;
    const pct = orig > 0 ? Math.round((amt / orig) * 100) : 0;
    return (
      <div className={`chatBubble chatBubbleOffer ${isOwn ? 'own' : ''}`}>
        <div className="chatOfferTag">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" />
            <line x1="7" y1="7" x2="7.01" y2="7" />
          </svg>
          <span>{isOwn ? 'You made an offer' : 'Offer received'}</span>
        </div>
        <div className="chatOfferAmount">
          ₹{amt.toLocaleString('en-IN')}
        </div>
        {orig > 0 && (
          <div className="chatOfferOriginal">
            Listed at ₹{orig.toLocaleString('en-IN')} &middot; {pct}% of asking price
          </div>
        )}
        {message.text && !/^Made an offer/.test(message.text) && (
          <div className="chatOfferMessage">{message.text}</div>
        )}
        <div className="chatBubbleTime">{dateStr}</div>
      </div>
    );
  }

  return (
    <div className={`chatBubble ${isOwn ? 'own' : ''}`}>
      <div className="chatBubbleText">{message?.text}</div>
      <div className="chatBubbleTime">{dateStr}</div>
    </div>
  );
}

export default ChatBubble;
