// 📄 src/features/member/sheets/openFollowingListSheet.tsx
import React from 'react';
import { StyleSheet } from 'react-native';
import { useBottomSheetStore } from '@/common/state/bottomSheetStore';
import AppText from '@/common/components/AppText';
import { SPACING } from '@/common/styles/spacing';
import { COLORS } from '@/common/styles/colors';
import FollowingList from '../lists/FollowingList';

export const openFollowingListSheet = ({ targetId }: { targetId: string }) => {
  const { open } = useBottomSheetStore.getState();

  open(<FollowingListSheetContent targetId={targetId} />, {
    snapPoints: ['25%', '90%'],
    initialIndex: 2,
    enableHandlePanningGesture: true,
    enableContentPanningGesture: true,
  });
};

const FollowingListSheetContent: React.FC<{ targetId: string }> = ({
  targetId,
}) => {
  return (
    <>
      <AppText
        i18nKey="STR_FOLLOWINGS"
        variant="caption"
        style={styles.title}
      />
      <FollowingList targetId={targetId} />
    </>
  );
};

const styles = StyleSheet.create({
  title: {
    alignSelf: 'center',
    fontSize: 15,
    lineHeight: 18,
    fontWeight: '600',
    color: COLORS.body,
    marginTop: SPACING.sm,
    marginBottom: SPACING.xs,
    justifyContent: 'center',
  },
});
