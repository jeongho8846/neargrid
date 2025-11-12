import React from 'react';
import {
  FlatList,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import type { ChatRoom } from '../model/ChatRoomModel';
import ChatRoomItemCard from '../components/ChatRoomItemCard';

type Props = {
  data: ChatRoom[];
  onPressItem?: (roomId: string) => void;
};

const ChatRoomList: React.FC<Props> = ({ data, onPressItem }) => {
  return (
    <FlatList
      data={data}
      keyExtractor={item => item.id}
      renderItem={({ item }) => (
        <ChatRoomItemCard item={item} onPress={onPressItem} />
      )}
      contentContainerStyle={{ paddingVertical: 12 }}
      showsVerticalScrollIndicator={false}
    />
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#eee',
  },
  profileCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ccc',
  },
  textContainer: {
    flex: 1,
    marginLeft: 10,
  },
  roomName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#222',
  },
  lastMessage: {
    fontSize: 14,
    color: '#777',
    marginTop: 2,
  },
  badge: {
    minWidth: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#ff4d4f',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
});

export default ChatRoomList;
