// 📄 src/features/chat/screens/ChatRoomMenuScreen.tsx
import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRoute } from '@react-navigation/native';

import AppText from '@/common/components/AppText';
import { COLORS, SPACING } from '@/common/styles';
import { useFetchChatRoomInfo } from '@/features/chat/hooks/useGetChatRoomInfo';
import ChatRoomMemberList from '@/features/chat/components/ChatRoomMemberList';
import AppGroupAvatar from '@/features/chat/components/ChatRoomAvatarGroup'; // ✅ 그룹 아바타 컴포넌트
import { useLeaveChatRoom } from '@/features/chat/hooks/useLeaveChatRoom';

const ChatRoomMenuScreen = () => {
  const route = useRoute<any>();
  const { roomId } = route.params;

  const { data: room, isLoading, isError } = useFetchChatRoomInfo(roomId);
  const { leaveRoom, loading: leaving } = useLeaveChatRoom();
  const handleInviteBot = () => {
    console.log('챗봇 초대');
  };

  const handleInviteMember = () => {
    console.log('일반 멤버 초대');
  };

  const handleLeave = async () => {
    if (!room) return;
    await leaveRoom(room.id, room.type); // ✅ 여기서 호출
  };
  if (isLoading)
    return (
      <View style={styles.center}>
        <AppText>불러오는 중...</AppText>
      </View>
    );

  if (isError || !room)
    return (
      <View style={styles.center}>
        <AppText>채팅방 정보를 불러올 수 없습니다.</AppText>
      </View>
    );

  // 🔹 생성일 추출
  const createdAt =
    room.lastMessage?.createdAt || room.updatedAt || new Date().toISOString();

  const formattedDate = new Date(createdAt).toLocaleString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });

  // 🔹 멤버 필터링
  const botMembers = room.members.filter(m => m.memberType === 'CHAT_BOT');
  const generalMembers = room.members.filter(m => m.memberType === 'GENERAL');

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* 🔹 상단 그룹 아바타 */}
        <View style={styles.groupHeader}>
          <AppGroupAvatar members={room.members.slice(0, 4)} />
          <AppText style={styles.groupName}>
            {room.name || '그룹 채팅방'}
          </AppText>
          <View style={styles.groupHeader_foot}>
            <AppText i18nKey="STR_CHAT_CREATE_DATE_TIME" />
            <AppText>
              {'  '}
              {formattedDate}
            </AppText>
          </View>
        </View>

        {/* 🔹 챗봇 멤버 섹션 */}
        <View style={styles.section}>
          <AppText style={styles.sectionTitle}>챗봇 멤버</AppText>
          <ChatRoomMemberList
            members={botMembers}
            showInviteButton
            onInvitePress={handleInviteBot}
          />
        </View>

        {/* 🔹 일반 멤버 섹션 */}
        <View style={styles.section}>
          <AppText style={styles.sectionTitle}>일반 멤버</AppText>
          <ChatRoomMemberList
            members={generalMembers}
            showInviteButton
            onInvitePress={handleInviteMember}
          />
        </View>

        {/* 🔹 나가기 (텍스트형 버튼) */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={handleLeave}
          style={styles.leaveContainer}
        >
          <AppText i18nKey="STR_CHAT_LEAVE_CHATROOM" variant="danger" />
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default ChatRoomMenuScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingBottom: 108,
  },
  scrollContent: {
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.xl,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  groupHeader: {
    alignItems: 'center',
    marginTop: SPACING.xl,
    marginBottom: SPACING.xl,
  },

  groupHeader_foot: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    width: '100%',

    marginTop: SPACING.xl,
  },
  groupName: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: SPACING.sm,
  },
  section: {
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: SPACING.sm,
  },
  leaveContainer: {
    alignItems: 'center',
    paddingVertical: SPACING.lg,
  },
  leaveText: {
    color: COLORS.danger, // 🔴 경고색 계열
    fontSize: 16,
    fontWeight: '600',
  },
  createdAt: {},
});
