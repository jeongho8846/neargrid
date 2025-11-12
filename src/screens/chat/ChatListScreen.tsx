import React from 'react';
import { View, StyleSheet, ActivityIndicator, Text } from 'react-native';
import { useGetCurrentMemberChatRooms } from '@/features/chat/hooks/useGetCurrentMemberChatRooms';
import ChatRoomList from '@/features/chat/lists/ChatRoomList';
import { COLORS } from '@/common/styles';

const ChatListScreen = () => {
  const {
    data: rooms,
    isLoading,
    isError,
    refetch,
  } = useGetCurrentMemberChatRooms();

  if (isLoading)
    return (
      <View style={styles.center}>
        <ActivityIndicator />
      </View>
    );

  if (isError)
    return (
      <View style={styles.center}>
        <Text onPress={() => refetch()}>불러오기 실패. 다시 시도</Text>
      </View>
    );

  if (!rooms || rooms.length === 0)
    return (
      <View style={styles.center}>
        <Text>채팅방이 없습니다.</Text>
      </View>
    );

  return (
    <View style={styles.container}>
      <ChatRoomList data={rooms} />
    </View>
  );
};

export default ChatListScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 8, // ✅ 네이티브 테스트용 패딩
    backgroundColor: COLORS.background,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
