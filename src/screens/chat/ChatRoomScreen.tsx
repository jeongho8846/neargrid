// 📄 src/screens/chat/ChatRoomScreen.tsx
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Keyboard,
} from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { useQueryClient, InfiniteData } from '@tanstack/react-query';
import { useGetChatRoomMessageHistory } from '@/features/chat/hooks/useGetChatRoomMessageHistory';
import ChatMessageList from '@/features/chat/lists/ChatMessageList';
import GlobalInputBar from '@/common/components/GlobalInputBar/GlobalInputBar';
import { useGlobalInputBarStore } from '@/common/state/globalInputBarStore';
import AppText from '@/common/components/AppText';
import { COLORS, SPACING } from '@/common/styles';
import AppCollapsibleHeader from '@/common/components/AppCollapsibleHeader/AppCollapsibleHeader';
import AppIcon from '@/common/components/AppIcon';
import BottomBlurGradient from '@/common/components/BottomBlurGradient/BottomBlurGradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCurrentMember } from '@/features/member/hooks/useCurrentMember';
import { useChatContext } from '@/features/chat/context/ChatContext';
import { chatKeys } from '@/features/chat/keys/chatKeys';
import type { ChatMessage } from '@/features/chat/model/ChatMessageModel';
import { useRef } from 'react';

type ChatRoomRoute = RouteProp<
  { ChatRoomScreen: { chatRoomId: string } },
  'ChatRoomScreen'
>;

type MessagesPage = {
  messages: ChatMessage[];
  nextPagingState: string | null;
};

/**
 * ✅ 채팅방 화면
 * - route.params.chatRoomId 기반 메시지 불러오기
 * - AppFlashList 기반 ChatMessageList 사용
 * - 전송 시 낙관적 메시지 추가 후, 서버 응답(WebSocket)으로 교체
 */
const ChatRoomScreen = () => {
  const route = useRoute<ChatRoomRoute>();
  const navigation = useNavigation<any>();
  const { chatRoomId } = route.params;
  const { open, close, isVisible } = useGlobalInputBarStore();
  const insets = useSafeAreaInsets();
  const { member } = useCurrentMember();
  const chatSocket = useChatContext();
  const queryClient = useQueryClient();
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [scrollToTopSignal, setScrollToTopSignal] = useState(0);
  const lastReadIdRef = useRef<string | null>(null);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    refetch,
  } = useGetChatRoomMessageHistory(chatRoomId);

  // 🔹 messages 평탄화
  const messages = useMemo(
    () => data?.pages.flatMap(page => page.messages || []) ?? [],
    [data?.pages],
  );

  // 🔹 메뉴로 이동
  const handleOpenMenu = () => {
    navigation.navigate('ChatRoomMenuScreen', { roomId: chatRoomId });
  };

  // 🔹 키보드 높이에 따라 리스트 상단 패딩 조절 (리스트가 뒤집혀 있으므로 top 패딩)
  useEffect(() => {
    const showSub = Keyboard.addListener('keyboardDidShow', e => {
      setKeyboardHeight(e.endCoordinates?.height ?? 0);
    });
    const hideSub = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardHeight(0);
    });
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const addOptimisticMessage = useCallback(
    (text: string, tempId: string) => {
      if (!member?.id) return;
      const now = new Date().toISOString();

      const optimistic: ChatMessage = {
        id: tempId,
        roomId: chatRoomId,
        senderId: member.id,
        senderNickName: member.nickname,
        senderProfileImageUrl: member.profileImageUrl,
        type: 'CHAT',
        content: text,
        createdAt: now,
        isMine: true,
        reactions: [],
        unreadChatMessageCount: null,
        checkReceiveId: tempId,
      };

      queryClient.setQueryData<InfiniteData<MessagesPage> | undefined>(
        chatKeys.messages(chatRoomId),
        prev => {
          if (!prev) return prev;
          const [firstPage, ...rest] = prev.pages ?? [];
          if (!firstPage) return prev;
          return {
            ...prev,
            pages: [
              {
                ...firstPage,
                messages: [optimistic, ...(firstPage.messages ?? [])],
              },
              ...rest,
            ],
          };
        },
      );

      // 방 목록 lastMessage도 함께 갱신 (unreadCount는 건드리지 않음)
      queryClient.setQueryData(chatKeys.rooms(), (prev: any) => {
        if (!prev) return prev;
        return prev.map((room: any) =>
          room.id === chatRoomId
            ? {
                ...room,
                lastMessage: {
                  id: tempId,
                  senderId: member.id,
                  message: text,
                  messageType: 'CHAT',
                  createdAt: now,
                },
                updatedAt: now,
              }
            : room,
        );
      });
    },
    [chatRoomId, member, queryClient],
  );

  const markRoomAsRead = useCallback(() => {
    queryClient.setQueryData(chatKeys.rooms(), (prev: any) => {
      if (!prev) return prev;
      return prev.map((room: any) =>
        room.id === chatRoomId ? { ...room, unreadCount: 0 } : room,
      );
    });
  }, [chatRoomId, queryClient]);

  const handleSend = useCallback(
    (text: string) => {
      if (!member?.id) return;
      const tempId = `temp-${Date.now()}`;

      addOptimisticMessage(text, tempId);
      setScrollToTopSignal(Date.now());

      // 서버 프로토콜에 맞게 destination/payload는 필요 시 조정
      chatSocket?.sendChatMessage(`/app/chat.sendMessage/${chatRoomId}`, {
        chatRoomId,
        memberId: member.id,
        message: text,
        messageType: 'CHAT',
        checkReceiveId: tempId, // 수신 시 낙관 메시지 대체용
      });

      // 내가 보낸 메시지는 바로 읽음 처리
      chatSocket?.sendReadChatMessage(chatRoomId, member.id, tempId);
      markRoomAsRead();
    },
    [addOptimisticMessage, chatRoomId, chatSocket, markRoomAsRead, member?.id],
  );

  // 🔹 글로벌 인풋 바 열기/닫기
  useEffect(() => {
    open({
      placeholder: '메시지를 입력하세요...',
      isFocusing: false,
      onSubmit: handleSend,
    });
    return () => {
      close();
    };
  }, [chatRoomId, open, close, handleSend]);

  // 방 진입/새 메시지 수신 시 최신 메시지까지 읽음 전송 (중복 방지)
  useEffect(() => {
    if (!member?.id || !messages.length) return;
    const latestId = messages[0]?.id;
    if (!latestId || lastReadIdRef.current === latestId) return;
    lastReadIdRef.current = latestId;
    chatSocket?.sendReadChatMessage(chatRoomId, member.id, latestId);
    markRoomAsRead();
  }, [chatRoomId, chatSocket, markRoomAsRead, member?.id, messages]);

  if (isLoading)
    return (
      <View style={styles.center}>
        <ActivityIndicator color={COLORS.icon_primary} />
      </View>
    );

  if (isError)
    return (
      <View style={styles.center}>
        <AppText onPress={() => refetch()}>불러오기 실패. 다시 시도</AppText>
      </View>
    );

  const topPadding = 80 + insets.bottom + keyboardHeight;

  return (
    <View style={styles.container}>
      <AppCollapsibleHeader
        titleKey="STR_CHAT"
        right={
          <View style={styles.headerRight}>
            <TouchableOpacity onPress={handleOpenMenu}>
              <AppIcon
                type="ion"
                name="ellipsis-vertical"
                size={22}
                color={COLORS.body}
              />
            </TouchableOpacity>
          </View>
        }
      />

      <View style={styles.body}>
        <GlobalInputBar />
        <ChatMessageList
          data={messages}
          onEndReached={() => {
            if (hasNextPage && !isFetchingNextPage) fetchNextPage();
          }}
          loadingMore={isFetchingNextPage}
          topPadding={topPadding}
          scrollToTopTrigger={scrollToTopSignal}
        />
      </View>
      <BottomBlurGradient height={120} />
    </View>
  );
};

export default ChatRoomScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: SPACING.xs,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerRight: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    marginLeft: 'auto',
    paddingRight: SPACING.sm,
    padding: 1,
  },
  body: { flex: 1 },
});
