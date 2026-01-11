import React, { createContext, useContext, ReactNode, useEffect, useMemo } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useChatWebSocket } from '../hooks/useChatWebSocket';
import { useAuthStore } from '@/common/state/authStore';
import { useCurrentMember } from '@/features/member/hooks/useCurrentMember';
import { createChatMessageRouter } from '../services/chatMessageRouter';

type ChatContextType = ReturnType<typeof useChatWebSocket>;

const ChatContext = createContext<ChatContextType | null>(null);

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const { isAuth } = useAuthStore();
  const { member } = useCurrentMember();
  const queryClient = useQueryClient();

  const messageRouter = useMemo(() => {
    if (!member?.id) return null;
    return createChatMessageRouter({
      queryClient,
      currentMemberId: member.id,
    });
  }, [member?.id, queryClient]);

  // ✅ isAuth가 true일 때만 웹소켓 연결 활성화
  const chatSocket = useChatWebSocket(isAuth, {
    onPrivateMessage: raw => messageRouter?.handlePrivateMessage(raw),
  });

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
