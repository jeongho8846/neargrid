import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useBottomSheetStore } from '@/common/state/bottomSheetStore';
import AppText from '@/common/components/AppText';
import AppIcon from '@/common/components/AppIcon';
import { SPACING } from '@/common/styles/spacing';
import { COLORS } from '@/common/styles/colors';
import { BottomSheetView } from '@gorhom/bottom-sheet';

type Props = { isMyProfile: boolean };

export const openProfileMenuSheet = ({ isMyProfile }: Props) => {
  const { open } = useBottomSheetStore.getState();

  // ✅ 항목 수 계산
  const itemCount = isMyProfile ? 7 : 1;

  // ✅ 아이템 수에 따라 높이 동적 계산
  const snapHeight = Math.min(80 + itemCount * 56, 500); // px 단위 예시 (최대 500px 제한)

  open(<ProfileMenuContent isMyProfile={isMyProfile} />, {
    snapPoints: [snapHeight],
    initialIndex: 1,
    enableHandlePanningGesture: true,
    enableContentPanningGesture: true,
  });
};

const ProfileMenuContent: React.FC<Props> = ({ isMyProfile }) => {
  const menuItems = isMyProfile
    ? [
        {
          icon: 'card-outline',
          labelKey: 'STR_VIEW_PAYMENTS',
          onPress: () => {},
        },
        {
          icon: 'wallet-outline',
          labelKey: 'STR_VIEW_POINTS',
          onPress: () => {},
        },
        { icon: 'ban-outline', labelKey: 'STR_BLOCK_LIST', onPress: () => {} },
        {
          icon: 'language-outline',
          labelKey: 'STR_LANGUAGE_SETTING',
          onPress: () => {},
        },
        {
          icon: 'lock-closed-outline',
          labelKey: 'STR_CHANGE_PASSWORD',
          onPress: () => {},
        },
        { icon: 'log-out-outline', labelKey: 'STR_LOGOUT', onPress: () => {} },
        {
          icon: 'trash-outline',
          labelKey: 'STR_DELETE_ACCOUNT',
          onPress: () => {},
        },
      ]
    : [{ icon: 'ban-outline', labelKey: 'STR_BLOCK_USER', onPress: () => {} }];

  return (
    <BottomSheetView style={styles.container}>
      {menuItems.map((item, i) => (
        <TouchableOpacity
          key={i}
          style={styles.row}
          activeOpacity={0.7}
          onPress={item.onPress}
        >
          <AppIcon type="ion" name={item.icon} size={22} variant="primary" />
          <AppText variant="body" i18nKey={item.labelKey} style={styles.text} />
        </TouchableOpacity>
      ))}
    </BottomSheetView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: SPACING.md,
    paddingBottom: 50,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  text: {
    marginLeft: 12,
    color: COLORS.body,
  },
});
