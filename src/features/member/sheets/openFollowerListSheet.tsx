import React from 'react';
import { StyleSheet } from 'react-native';
import { useBottomSheetStore } from '@/common/state/bottomSheetStore';
import AppText from '@/common/components/AppText';
import { SPACING } from '@/common/styles/spacing';
import { COLORS } from '@/common/styles/colors';
import FollowerList from '../lists/FollowerList';

export const openFollowerListSheet = ({ targetId }: { targetId: string }) => {
  const { open } = useBottomSheetStore.getState();

  open(<FollowerListSheetContent targetId={targetId} />, {
    snapPoints: ['25%', '90%'],
    initialIndex: 2,
    enableHandlePanningGesture: true,
    enableContentPanningGesture: true,
  });
};

const FollowerListSheetContent: React.FC<{ targetId: string }> = ({
  targetId,
}) => {
  return (
    <>
      <AppText
        i18nKey="STR_FOLLOWERS" // ✅ 팔로워용 텍스트 키
        variant="caption"
        style={styles.title}
      />
      <FollowerList targetId={targetId} />
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
