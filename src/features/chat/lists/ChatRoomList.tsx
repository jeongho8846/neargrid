import React from 'react';
import { FlatList } from 'react-native';
import type { ChatRoom } from '../model/ChatRoomModel';
import ChatRoomItemCard from '../components/ChatRoomItemCard';

type Props = {
  data: ChatRoom[];
  onPressItem?: (roomId: string) => void;
};

const ChatRoomList: React.FC<Props> = ({ data, onPressItem }) => {
  // ✅ 최신 메시지 기준으로 정렬 (최근 메시지가 위로)
  const sortedData = React.useMemo(() => {
    return [...data].sort((a, b) => {
      const aTime = new Date(a.lastMessage?.createdAt ?? 0).getTime();
      const bTime = new Date(b.lastMessage?.createdAt ?? 0).getTime();
      return bTime - aTime;
    });
  }, [data]);

  return (
    <FlatList
      data={sortedData}
      keyExtractor={item => item.id}
      renderItem={({ item }) => (
        <ChatRoomItemCard item={item} onPress={onPressItem} />
      )}
      contentContainerStyle={{ paddingVertical: 12 }}
      showsVerticalScrollIndicator={false}
    />
  );
};

export default ChatRoomList;
