import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { BottomSheetView } from '@gorhom/bottom-sheet';

import { useBottomSheetStore } from '@/common/state/bottomSheetStore';
import AppText from '@/common/components/AppText';
import AppIcon from '@/common/components/AppIcon';
import { SPACING } from '@/common/styles/spacing';
import { COLORS } from '@/common/styles/colors';

import { openLogoutConfirmModal } from '../modals/openLogoutConfirmModal';
import { openBlockedMemberListSheet } from './openBlockedMemberListSheet';
import { openBlockConfirmModal } from '../modals/openBlockConfirmModal';
import { useCurrentMember } from '@/features/member/hooks/useCurrentMember';

type Props = {
  isMyProfile: boolean;
  targetMemberId?: string;
};

/**
 * ✅ 프로필 메뉴 바텀시트 오픈 함수
 */
export const openProfileMenuSheet = ({
  isMyProfile,
  targetMemberId,
}: Props) => {
  const { open } = useBottomSheetStore.getState();

  // ✅ 항목 수 계산
  const itemCount = isMyProfile ? 7 : 1;

  // ✅ 높이 동적 계산
  const snapHeight = Math.min(80 + itemCount * 56, 500);

  open(
    <ProfileMenuContent
      isMyProfile={isMyProfile}
      targetMemberId={targetMemberId}
    />,
    {
      snapPoints: [snapHeight],
      initialIndex: 1,
      enableHandlePanningGesture: true,
      enableContentPanningGesture: true,
    },
  );
};

const ProfileMenuContent: React.FC<Props> = ({
  isMyProfile,
  targetMemberId,
}) => {
  const { member: currentMember } = useCurrentMember(); // ✅ 현재 로그인 유저

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
        {
          icon: 'ban-outline',
          labelKey: 'STR_BLOCK_LIST',
          onPress: () => openBlockedMemberListSheet(),
        },
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
        {
          icon: 'log-out-outline',
          labelKey: 'STR_LOGOUT',
          onPress: () => openLogoutConfirmModal({ isMyProfile }),
          isDanger: true,
        },
        {
          icon: 'trash-outline',
          labelKey: 'STR_DELETE_ACCOUNT',
          onPress: () => {},
          isDanger: true,
        },
      ]
    : [
        {
          icon: 'ban-outline',
          labelKey: 'STR_BLOCK_USER',
          onPress: () =>
            openBlockConfirmModal({
              isMyProfile,
              currentMemberId: currentMember?.id ?? '',
              targetMemberId,
            }),
          isDanger: true,
        },
      ];

  return (
    <BottomSheetView style={styles.container}>
      {menuItems.map((item, index) => (
        <TouchableOpacity
          key={index}
          style={styles.row}
          activeOpacity={0.7}
          onPress={item.onPress}
        >
          <AppIcon
            type="ion"
            name={item.icon}
            size={22}
            variant={item.isDanger ? 'danger' : 'primary'}
          />
          <AppText
            variant="body"
            i18nKey={item.labelKey}
            style={[styles.text, item.isDanger && { color: COLORS.error }]}
          />
        </TouchableOpacity>
      ))}
    </BottomSheetView>
  );
};

export default ProfileMenuContent;

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
