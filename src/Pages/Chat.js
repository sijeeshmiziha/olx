import React, { useContext } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import Layout from '../Components/Layout/Layout';
import ChatList from '../Components/Chat/ChatList';
import ChatWindow from '../Components/Chat/ChatWindow';
import { AuthContext } from '../contextStore/AuthContext';
import '../Components/Chat/Chat.css';

function ChatPage() {
  const { conversationId } = useParams();
  const { user } = useContext(AuthContext);
  const location = useLocation();

  // Preserve tab context if navigated from messages/buying or messages/selling
  const defaultTab = location.state?.tab || 'all';

  return (
    <Layout hideMobileNav hideFooter>
      <div className={`messagesPage${conversationId ? ' hasActiveChat' : ''}`}>
        <aside className="messagesSidebar">
          <ChatList currentUserId={user?.uid} defaultTab={defaultTab} />
        </aside>
        <main className="messagesMain">
          <ChatWindow
            key={conversationId || 'no-chat'}
            conversationId={conversationId}
            currentUserId={user?.uid}
          />
        </main>
      </div>
    </Layout>
  );
}

export default ChatPage;
