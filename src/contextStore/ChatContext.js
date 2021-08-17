import React, { createContext, useState, useMemo } from 'react';

export const ChatContext = createContext(null);

function ContextChat({ children }) {
  const [unreadTotal, setUnreadTotal] = useState(0);

  const value = useMemo(() => ({ unreadTotal, setUnreadTotal }), [unreadTotal]);

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

export default ContextChat;
