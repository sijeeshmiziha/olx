import React, { useState, useEffect } from 'react';
import { useConversations, filterConversationsByTab } from './useConversations';
import ChatListItem from './ChatListItem';
import { ChatListSkeleton } from '../UI/Skeleton';
import './Chat.css';

export default function ChatList({ currentUserId, defaultTab }) {
  const [retryTrigger, setRetryTrigger] = useState(0);
  const [activeTab, setActiveTab] = useState(defaultTab || 'all');

  const { conversations, loading, error } = useConversations(currentUserId, retryTrigger);
  const filteredConversations = filterConversationsByTab(conversations, activeTab, currentUserId);

  useEffect(() => {
    if (defaultTab) setActiveTab(defaultTab);
  }, [defaultTab]);

  const renderTabs = () => (
    <div className="chatListTabs">
      <button type="button" className={`chatListTab${activeTab === 'all' ? ' active' : ''}`} onClick={() => setActiveTab('all')}>All</button>
      <button type="button" className={`chatListTab${activeTab === 'buying' ? ' active' : ''}`} onClick={() => setActiveTab('buying')}>Buying</button>
      <button type="button" className={`chatListTab${activeTab === 'selling' ? ' active' : ''}`} onClick={() => setActiveTab('selling')}>Selling</button>
    </div>
  );

  if (!currentUserId) {
    return (
      <>
        <div className="messagesSidebarHeader">Messages</div>
        <div className="messagesEmpty"><p>Log in to view your messages.</p></div>
      </>
    );
  }
  if (error) {
    return (
      <>
        <div className="messagesSidebarHeader">Messages</div>
        {renderTabs()}
        <div className="messagesEmpty messagesError">
          <p>{error}</p>
          <button type="button" className="chatRetryBtn" onClick={() => setRetryTrigger((t) => t + 1)}>Retry</button>
        </div>
      </>
    );
  }
  if (loading) {
    return (
      <>
        <div className="messagesSidebarHeader">Messages</div>
        {renderTabs()}
        <ChatListSkeleton />
      </>
    );
  }

  const getEmptyMessage = () => {
    if (activeTab === 'buying') return 'No buying conversations yet. Start a chat from an ad you want to buy.';
    if (activeTab === 'selling') return 'No selling conversations yet. Buyers will message you about your ads.';
    return 'No conversations yet. Start a chat from an ad page.';
  };

  if (filteredConversations.length === 0) {
    return (
      <>
        <div className="messagesSidebarHeader">Messages</div>
        {renderTabs()}
        <div className="messagesEmpty"><p>{getEmptyMessage()}</p></div>
      </>
    );
  }

  return (
    <>
      <div className="messagesSidebarHeader">Messages</div>
      {renderTabs()}
      <ul className="chatList">
        {filteredConversations.map((conv) => (
          <ChatListItem key={conv.id} conv={conv} currentUserId={currentUserId} activeTab={activeTab} />
        ))}
      </ul>
    </>
  );
}
