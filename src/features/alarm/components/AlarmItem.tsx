import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import AppText from '@/common/components/AppText';
import AppProfileImage from '@/common/components/AppProfileImage';
import { COLORS } from '@/common/styles/colors';
import { SHADOW } from '@/common/styles/shadows';
import FastImage from '@d11/react-native-fast-image';
import type { AlarmModel } from '../model/AlarmModel';
import { TEST_RADIUS } from '@/test/styles/radius';
import { SPACING } from '@/common/styles';
import { useTranslation } from 'react-i18next';

/**
 * ✅ AlarmItem (3섹션 구조 + 읽지 않은 알림 표시)
 * ┌────────────────────────────────────────────┐
 * │ [Profile🔴]   [Nickname + Message]   [Thumb] │
 * └────────────────────────────────────────────┘
 */
type AlarmItemProps = {
  item: AlarmModel;
  onPress?: (alarm: AlarmModel) => void;
};

export default function AlarmItem({ item, onPress }: AlarmItemProps) {
  const { t } = useTranslation();
  const key = `STR_ALARM_${item.alarmType ?? 'DEFAULT'}`;

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.85}
      onPress={() => onPress?.(item)}
      disabled={!onPress}
    >
      {/* ───────────── ① Left Section ───────────── */}
      <View style={styles.leftSection}>
        <View style={styles.profileWrapper}>
          <AppProfileImage
            imageUrl={item.sendMemberProfileImageUrl}
            size={44}
            memberId={item.sendMemberId}
            canGoToProfileScreen
          />
          {!item.viewedByMember && <View style={styles.unreadDot} />}
        </View>
      </View>

      {/* ───────────── ② Middle Section ───────────── */}
      <View style={styles.middleSection}>
        <AppText variant="body">
          {item.sendMemberNickName}
          {t(key)}
        </AppText>
      </View>

      {/* ───────────── ③ Right Section ───────────── */}
      {!!item.targetImageUrl && (
        <View style={styles.rightSection}>
          <FastImage
            source={{ uri: item.targetImageUrl }}
            style={styles.contentImageBox}
            resizeMode={FastImage.resizeMode.cover}
          />
        </View>
      )}
    </TouchableOpacity>
  );
}

/* ──────────────── 스타일 ──────────────── */
const DOT_SIZE = 10;

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.sheet_background,
    borderRadius: TEST_RADIUS.md,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.sm,
    marginVertical: SPACING.xs,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...SHADOW.md,
  },

  leftSection: {
    width: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
  middleSection: {
    flex: 1,
    paddingHorizontal: SPACING.sm,
    justifyContent: 'center',
  },
  rightSection: {
    width: 50,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },

  profileWrapper: {
    position: 'relative',
  },

  unreadDot: {
    position: 'absolute',
    top: -2,
    left: -2,
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: DOT_SIZE / 2,
    backgroundColor: COLORS.danger_variant,
    borderWidth: 1.5,
    borderColor: COLORS.sheet_background,
  },

  contentImageBox: {
    width: 48,
    height: 48,
    borderRadius: TEST_RADIUS.sm,
  },
});
