import React from 'react';
import { View, StyleSheet } from 'react-native';
import type { ChatMember } from '../model/ChatRoomModel';
import AppProfileImage from '@/common/components/AppProfileImage';
import { COLORS } from '@/common/styles';

type Props = {
  members: ChatMember[];
};

/**
 * 🔹 채팅방 프로필 그룹 (개인 / 그룹)
 * - 개인방: 상대방 1명 프로필
 * - 그룹방: 멤버 수에 따라 겹쳐서 표시 (최대 4명)
 */
const ChatRoomAvatarGroup: React.FC<Props> = ({ members }) => {
  const visibleMembers = members.slice(0, 4); // ✅ 최대 4명까지만 표시

  // 🔹 개인방 → 단일 이미지
  if (visibleMembers.length === 1) {
    const profileUrl = visibleMembers[0].profileImage;
    return (
      <AppProfileImage
        imageUrl={profileUrl}
        size={44}
        canGoToProfileScreen={false}
      />
    );
  }

  // 🔹 그룹방 → 여러명
  return (
    <View style={styles.groupContainer}>
      {visibleMembers.map((m, i) => (
        <View
          key={m.memberId}
          style={[
            styles.avatarWrapper,
            getPositionStyle(i, visibleMembers.length),
          ]}
        >
          <AppProfileImage
            imageUrl={m.profileImage}
            size={22}
            canGoToProfileScreen={false}
          />
        </View>
      ))}
    </View>
  );
};

export default ChatRoomAvatarGroup;

const styles = StyleSheet.create({
  groupContainer: {
    width: 44,
    height: 44,
    position: 'relative',
  },
  avatarWrapper: {
    position: 'absolute',
    borderWidth: 0.001,
    backgroundColor: COLORS.background,
    borderRadius: 11,
    overflow: 'hidden',
  },
});

/**
 * 🔹 멤버 수별 배치 규칙
 * 1명 → 단일
 * 2명 → 대각선 배치 (좌상단, 우하단)
 * 3명 → 삼각형 배치 (위 중앙, 좌하단, 우하단)
 * 4명+ → 사각형 배치 (좌상, 우상, 좌하, 우하)
 */
const getPositionStyle = (index: number, total: number) => {
  const radius = 22; // 부모 컨테이너 절반 기준

  switch (total) {
    case 2:
      return index === 0 ? { top: 2, left: 2 } : { bottom: 2, right: 2 };

    case 3:
      return [
        { top: 0, left: radius - 11 }, // 🔹 위 중앙
        { bottom: 0, left: 0 }, // 🔹 좌하
        { bottom: 0, right: 0 }, // 🔹 우하
      ][index];

    case 4:
    default:
      return [
        { top: 0, left: 0 },
        { top: 0, right: 0 },
        { bottom: 0, left: 0 },
        { bottom: 0, right: 0 },
      ][index];
  }
};
