import React from 'react';
import {
  FlatList,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import type { ChatRoom } from '../model/ChatRoomModel';

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
        <TouchableOpacity
          style={styles.itemContainer}
          onPress={() => onPressItem?.(item.id)}
        >
          <View style={styles.profileCircle} />
          <View style={styles.textContainer}>
            <Text style={styles.roomName}>
              {item.name || getRoomDisplayName(item)}
            </Text>
            <Text style={styles.lastMessage} numberOfLines={1}>
              {item.lastMessage?.message || '(메시지 없음)'}
            </Text>
          </View>
          {item.unreadCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{item.unreadCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      )}
      contentContainerStyle={{ paddingVertical: 12 }}
      showsVerticalScrollIndicator={false}
    />
  );
};

// ✅ 방 이름이 없으면 상대방 닉네임으로 표시
const getRoomDisplayName = (room: ChatRoom) => {
  const other = room.members.find(
    m => !m.isAvailableMember || !m.activeNow === false,
  );
  return other?.nickName ?? '알 수 없는 사용자';
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
