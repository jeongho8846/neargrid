import React, { createContext, useContext, ReactNode, useEffect } from 'react';
import { useChatWebSocket } from '../hooks/useChatWebSocket';
import { useAuthStore } from '@/common/state/authStore';

type ChatContextType = ReturnType<typeof useChatWebSocket>;

const ChatContext = createContext<ChatContextType | null>(null);

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const { isAuth } = useAuthStore();

  // ✅ isAuth가 true일 때만 웹소켓 연결 활성화
  const chatSocket = useChatWebSocket(isAuth);

  useEffect(() => {
    if (isAuth && chatSocket.connected) {
      console.log('🔌 [ChatProvider] WebSocket connected and ready');
    }
  }, [isAuth, chatSocket.connected]);

  return (
    <ChatContext.Provider value={chatSocket}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChatContext must be used within a ChatProvider');
  }
  return context;
};
