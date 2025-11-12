// 📄 src/features/chat/components/ChatMessageList.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import ChatMessageItem from '../components/ChatMessageItem';
import type { ChatMessage } from '../model/ChatMessageModel';
import dayjs from 'dayjs';

type Props = {
  data: ChatMessage[];
  onEndReached?: () => void;
  loadingMore?: boolean;
};

const ChatMessageList: React.FC<Props> = ({
  data,
  onEndReached,
  loadingMore,
}) => {
  return (
    <View style={styles.wrapper}>
      <FlashList
        data={data}
        renderItem={({ item, index }) => {
          const next = data[index - 1]; // ✅ 리버스 리스트이므로 다음 인덱스가 이전 메시지

          const befoe = data[index + 1]; // ✅ 리버스 리스트이므로 다음 인덱스가

          // 🔹 같은 사람이 같은 분(mm)에 보낸 경우 → 닉네임/시간 숨김
          const hideNick = befoe && befoe.senderId === item.senderId;
          const hideTime =
            next &&
            next.senderId === item.senderId &&
            dayjs(item.createdAt).format('YYYY-MM-DD HH:mm') ===
              dayjs(next.createdAt).format('YYYY-MM-DD HH:mm');

          return (
            <View style={styles.itemWrap}>
              <ChatMessageItem
                message={item}
                hideNick={hideNick}
                hideTime={hideTime}
              />
            </View>
          );
        }}
        keyExtractor={item => item.id}
        estimatedItemSize={120}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.1}
        ListFooterComponent={
          loadingMore ? <View style={{ height: 30 }} /> : null
        }
        contentContainerStyle={styles.contentContainer}
      />
    </View>
  );
};

export default ChatMessageList;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    transform: [{ scaleY: -1 }],
  },
  itemWrap: {
    transform: [{ scaleY: -1 }],
  },
  contentContainer: {
    flexGrow: 1,
    justifyContent: 'flex-end',
    paddingTop: 5,
  },
});
