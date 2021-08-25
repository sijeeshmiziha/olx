import React, { useContext } from 'react';
import { useLocation } from 'react-router-dom';
import Layout from '../Components/Layout/Layout';
import ChatList from '../Components/Chat/ChatList';
import { AuthContext } from '../contextStore/AuthContext';
import '../Components/Chat/Chat.css';

function MessagesPage() {
  const { user } = useContext(AuthContext);
  const location = useLocation();

  // Parse tab from URL: /messages/buying or /messages/selling
  const pathParts = location.pathname.split('/').filter(Boolean);
  const tabFromUrl = pathParts[1]; // 'buying' or 'selling' or undefined
  const defaultTab =
    tabFromUrl === 'buying' || tabFromUrl === 'selling' ? tabFromUrl : 'all';

  return (
    <Layout hideFooter>
      <div className="messagesPage messagesListOnly">
        <aside className="messagesSidebar">
          <ChatList currentUserId={user?.uid} defaultTab={defaultTab} />
        </aside>
        <main className="messagesMain">
          <div className="messagesEmpty">
            <svg
              className="messagesEmptyIcon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            <p>Select a conversation or start a chat from an ad.</p>
          </div>
        </main>
      </div>
    </Layout>
  );
}

export default MessagesPage;
