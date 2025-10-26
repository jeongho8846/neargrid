// src/features/thread/sheets/openThreadLikeListSheet.tsx
import React from 'react';
import { StyleSheet } from 'react-native';
import { BottomSheetView } from '@gorhom/bottom-sheet';
import AppText from '@/common/components/AppText';
import { useBottomSheetStore } from '@/common/state/bottomSheetStore';
import { SPACING } from '@/common/styles/spacing';

export const openThreadLikeListSheet = ({ threadId }: { threadId: string }) => {
  const { open } = useBottomSheetStore.getState();

  open(
    <BottomSheetView style={styles.container}>
      <AppText style={styles.title}>좋아요 리스트</AppText>
      <AppText style={styles.desc}>threadId: {threadId}</AppText>
      {/* ✅ 나중에 BottomSheetFlatList 추가해도 스크롤 완벽 */}
    </BottomSheetView>,
    {
      snapPoints: ['90%'],
      initialIndex: 1,
      enableHandlePanningGesture: true,
      enableContentPanningGesture: true,
    },
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    alignSelf: 'center',
    marginBottom: SPACING.sm,
  },
  desc: {
    fontSize: 14,
  },
});
