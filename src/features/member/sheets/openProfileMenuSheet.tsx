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
import { useFetchMemberPoint } from '@/features/point/hooks/useFetchMemberPoint'; // ✅ 단순 API 훅

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

  const itemCount = isMyProfile ? 7 : 1;
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
  const { member: currentMember } = useCurrentMember();
  const { point, loading, error } = useFetchMemberPoint(
    currentMember?.id ?? '',
    true,
  );

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
          extra: (
            <AppText variant="body" style={styles.pointText}>
              {loading
                ? '...'
                : error
                ? '-'
                : `${point?.toLocaleString?.() ?? 0} P`}
            </AppText>
          ),
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
          activeOpacity={item.onPress ? 0.7 : 1}
          onPress={item.onPress}
        >
          <AppIcon
            type="ion"
            name={item.icon}
            size={22}
            variant={item.isDanger ? 'danger' : 'primary'}
          />
          <View style={styles.textRow}>
            <AppText
              variant="body"
              i18nKey={item.labelKey}
              style={[styles.text, item.isDanger && { color: COLORS.error }]}
            />
            {item.extra}
          </View>
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
  textRow: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginLeft: 12,
    alignItems: 'center',
  },
  text: {
    color: COLORS.body,
  },
  pointText: {},
});
