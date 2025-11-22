// 📄 src/screens/chat/ChatListScreen.tsx
import React from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { BlurView } from '@react-native-community/blur';
import LinearGradient from 'react-native-linear-gradient';
import { useGetCurrentMemberChatRooms } from '@/features/chat/hooks/useGetCurrentMemberChatRooms';
import ChatRoomList from '@/features/chat/lists/ChatRoomList';
import { COLORS } from '@/common/styles';
import { useNavigation } from '@react-navigation/native';
import AppCollapsibleHeader from '@/common/components/AppCollapsibleHeader/AppCollapsibleHeader';
import BottomBlurGradient from '@/common/components/BottomBlurGradient/BottomBlurGradient';

const ChatListScreen = () => {
  const navigation = useNavigation();
  const {
    data: rooms,
    isLoading,
    isError,
    refetch,
  } = useGetCurrentMemberChatRooms();

  // ✅ 채팅방 클릭 → ChatRoomScreen 이동
  const handlePressRoom = (roomId: string) => {
    navigation.navigate(
      'ChatRoomScreen' as never,
      { chatRoomId: roomId } as never,
    );
  };

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
    <SafeAreaView style={styles.container}>
      <AppCollapsibleHeader titleKey="STR_CHAT" />
      <ChatRoomList data={rooms} onPressItem={handlePressRoom} />

      <BottomBlurGradient height={120}></BottomBlurGradient>
    </SafeAreaView>
  );
};

export default ChatListScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 8, // ✅ 테스트 스크린 패딩 규칙
    backgroundColor: COLORS.background,
    paddingTop: 56,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomBlurContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 120,
  },
  gradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  blurView: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.1,
  },
  bottomContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
