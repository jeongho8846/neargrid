import React from 'react';
import { StyleSheet } from 'react-native';
import { BottomSheetView } from '@gorhom/bottom-sheet';
import { useBottomSheetStore } from '@/common/state/bottomSheetStore';
import DonateContainer from './DonateContainer';
import { SPACING } from '@/common/styles/spacing';

export type OpenDonateSheetParams = {
  currentMemberId: string;
  threadId: string;
  currentPoint?: number;
};

export const openDonateSheet = (params: OpenDonateSheetParams) => {
  // ✅ 빠른 런타임 가드
  if (!params?.currentMemberId || !params?.threadId) {
    console.warn('[openDonateSheet] missing ids', params);
  }

  const { open } = useBottomSheetStore.getState();

  // ✅ 반드시 BottomSheetView로 감싸기 (MenuSheet 구조 통일)
  open(
    <>
      <DonateContainer {...params} />
    </>,
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
});
