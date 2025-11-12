// 📄 src/features/chat/components/ChatMessageList.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import ChatMessageItem from '../components/ChatMessageItem';
import type { ChatMessage } from '../model/ChatMessageModel';

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
        renderItem={({ item, index }) => (
          <View style={styles.itemWrap}>
            <ChatMessageItem
              message={item}
              prevSenderId={data[index + 1]?.senderId} //리스트가 리버스라 +1로 함.
            />
          </View>
        )}
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
  // ✅ 전체 리스트 반전
  wrapper: {
    flex: 1,
    transform: [{ scaleY: -1 }],
  },
  // ✅ 각 아이템 다시 뒤집기
  itemWrap: {
    transform: [{ scaleY: -1 }],
  },
  // ✅ 스크롤이 아래서 위로 자연스럽게 작동하도록
  contentContainer: {
    flexGrow: 1,
    justifyContent: 'flex-end',
  },
});
