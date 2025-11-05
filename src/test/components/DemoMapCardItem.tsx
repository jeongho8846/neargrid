import React from 'react';
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import AppText from '@/common/components/AppText';
import AppIcon from '@/common/components/AppIcon';
import AppProfileImage from '@/common/components/AppProfileImage';
import { TEST_COLORS } from '@/test/styles/colors';
import { TEST_RADIUS } from '@/test/styles/radius';
import { TEST_SPACING } from '@/test/styles/spacing';
import { TEST_SHADOW } from '@/test/styles/shadows';
import { FONT } from '@/test/styles/FONT';

type Props = {
  imageUrl?: string;
  likes?: number;
  comments?: number;
  nickname?: string;
  profileUrl?: string;
  onPress?: () => void;
};

/**
 * ✅ DemoMapCardItem
 * - 바텀시트 내 2열 카드
 * - 세로형 비율 (1 : 1.5)
 */
const DemoMapCardItem: React.FC<Props> = ({
  imageUrl,
  likes = 0,
  comments = 0,
  nickname = 'guest_user',
  profileUrl,
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.85}
      onPress={onPress}
    >
      {/* 이미지 */}
      <Image
        source={{
          uri:
            imageUrl ??
            'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80',
        }}
        style={styles.image}
      />

      {/* 상단 - 좋아요 / 댓글 */}
      <View style={styles.topRight}>
        <View style={styles.row}>
          <AppIcon name="heart-outline" type="ion" variant="onDark" size={14} />
          <AppText style={styles.iconText}>{likes}</AppText>
          <View style={{ width: 8 }} />
          <AppIcon
            name="chatbubble-outline"
            type="ion"
            variant="onDark"
            size={14}
          />
          <AppText style={styles.iconText}>{comments}</AppText>
        </View>
      </View>

      {/* 하단 - 프로필 + 닉네임 */}
      <View style={styles.bottomRow}>
        <AppProfileImage imageUrl={profileUrl} size={22} />
        <AppText style={styles.nickname}>{nickname}</AppText>
      </View>
    </TouchableOpacity>
  );
};

export default DemoMapCardItem;

/* ──────────────── 스타일 ──────────────── */
const styles = StyleSheet.create({
  card: {
    width: '48%',
    aspectRatio: 1 / 1.5,
    borderRadius: TEST_RADIUS.md,
    backgroundColor: TEST_COLORS.surface,
    overflow: 'hidden',
    marginBottom: TEST_SPACING.sm,
    ...TEST_SHADOW.soft, // ✅ 카드 그림자 적용
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  topRight: {
    position: 'absolute',
    top: TEST_SPACING.xs,
    right: TEST_SPACING.xs,
    backgroundColor: TEST_COLORS.overlay_dark,
    borderRadius: TEST_RADIUS.sm,
    paddingHorizontal: TEST_SPACING.xs,
    paddingVertical: 3,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconText: {
    ...FONT.caption,
    color: TEST_COLORS.text_primary,
    marginLeft: 2,
  },
  bottomRow: {
    position: 'absolute',
    bottom: TEST_SPACING.xs,
    left: TEST_SPACING.xs,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: TEST_COLORS.overlay_dark,
    borderRadius: TEST_RADIUS.sm,
    paddingHorizontal: TEST_SPACING.xs,
    paddingVertical: 3,
    width: '80%',
  },
  nickname: {
    ...FONT.caption,
    color: TEST_COLORS.text_primary,
    marginLeft: TEST_SPACING.xs,
  },
});
