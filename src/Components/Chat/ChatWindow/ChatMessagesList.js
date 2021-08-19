import React from 'react';
import ChatBubble from '../ChatBubble';

function getDateLabel(ts) {
  if (!ts) return null;
  const d = ts?.toDate ? ts.toDate() : ts?.seconds ? new Date(ts.seconds * 1000) : new Date();
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  if (d.toDateString() === today.toDateString()) return 'Today';
  if (d.toDateString() === yesterday.toDateString()) return 'Yesterday';
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

export function groupMessagesByDate(messages) {
  const groups = [];
  let currentDate = null;
  messages.forEach((msg) => {
    const dateLabel = getDateLabel(msg.timestamp);
    if (dateLabel !== currentDate) {
      currentDate = dateLabel;
      groups.push({ type: 'date', label: dateLabel });
    }
    groups.push({ type: 'message', ...msg });
  });
  return groups;
}

export default function ChatMessagesList({ messages, currentUserId, loading }) {
  const grouped = groupMessagesByDate(messages);

  return (
    <>
      {grouped.map((item, i) =>
        item.type === 'date' ? (
          <div key={`date-${i}`} className="chatDateDivider">{item.label}</div>
        ) : (
          <ChatBubble key={item.id} message={item} isOwn={item.senderId === currentUserId} />
        )
      )}
      {messages.length === 0 && !loading && (
        <div className="chatEmptyState">No messages yet. Say hello!</div>
      )}
    </>
  );
}
