import React from 'react';
import { Link } from 'react-router-dom';
import { formatChatDate } from '../../utils/formatters';

export default function ChatListItem({ conv, currentUserId, activeTab }) {
  const isBuying = (conv.participants || [])[0] === currentUserId;

  return (
    <Link key={conv.id} to={`/chat/${conv.id}`} className="chatListItem">
      <div className="chatListAvatar">
        {conv.productImage ? (
          <img src={conv.productImage} alt="" className="chatListProductImg" />
        ) : (
          (conv.product?.name || conv.productName || '?').charAt(0).toUpperCase()
        )}
      </div>
      <div className="chatListBody">
        <div className="chatListName">
          {conv.productName || conv.product?.name || 'Chat'}
          {conv.productStatus && conv.productStatus !== 'active' && (
            <span className="chatListStatusBadge">{conv.productStatus}</span>
          )}
          {(activeTab === 'buying' || activeTab === 'selling') && (
            <span className={`chatListRoleBadge ${isBuying ? 'buying' : 'selling'}`}>
              {isBuying ? 'Buying' : 'Selling'}
            </span>
          )}
        </div>
        <div className="chatListPreview">{conv.lastMessage || 'No messages yet'}</div>
      </div>
      <div className="chatListRight">
        {conv.unreadCount?.[currentUserId] > 0 && (
          <span className="chatListUnread">{conv.unreadCount[currentUserId]}</span>
        )}
        <span className="chatListTime">{formatChatDate(conv.lastMessageAt)}</span>
      </div>
    </Link>
  );
}
