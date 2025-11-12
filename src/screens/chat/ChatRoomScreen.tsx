// 📄 src/screens/chat/ChatRoomScreen.tsx
import React from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { useGetChatRoomMessageHistory } from '@/features/chat/hooks/useGetChatRoomMessageHistory';
import AppText from '@/common/components/AppText';
import { SPACING } from '@/common/styles';
import type { ChatMessage } from '@/features/chat/model/ChatMessageModel';

type RouteParams = {
  ChatRoomScreen: { chatRoomId: string };
};

const ChatRoomScreen: React.FC = () => {
  const route = useRoute<RouteProp<RouteParams, 'ChatRoomScreen'>>();
  const chatRoomId = route.params.chatRoomId;

  // 🔹 메시지 히스토리 불러오기
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useGetChatRoomMessageHistory(chatRoomId);

  // 🔹 무한스크롤 데이터 병합
  const messages: ChatMessage[] =
    data?.pages.flatMap(page => page.messages) ?? [];

  // 🔹 위로 스크롤 시 이전 페이지 로드
  const handleEndReached = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {isLoading ? (
        <ActivityIndicator style={styles.loader} />
      ) : (
        <FlatList
          data={messages}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <View
              style={[
                styles.messageBubble,
                item.isMine ? styles.myMessage : styles.otherMessage,
              ]}
            >
              <AppText style={styles.messageText}>{item.message}</AppText>
            </View>
          )}
          contentContainerStyle={styles.listContainer}
          inverted // ✅ 최신 메시지가 아래로 오게
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.2}
        />
      )}
    </SafeAreaView>
  );
};

export default ChatRoomScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
  },
  listContainer: {
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.sm,
  },
  messageBubble: {
    maxWidth: '75%',
    marginVertical: 4,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  myMessage: {
    backgroundColor: '#DCF8C6',
    alignSelf: 'flex-end',
  },
  otherMessage: {
    backgroundColor: '#f1f1f1',
    alignSelf: 'flex-start',
  },
  messageText: {
    fontSize: 15,
  },
});
