// src/features/donation/sheets/openDonateSheet.tsx
import React from 'react';
import { useBottomSheetStore } from '@/common/state/bottomSheetStore';
import DonateContainer from './DonateContainer';

export type OpenDonateSheetParams = {
  currentMemberId: string;
  threadId: string;
  currentPoint?: number;
};

export const openDonateSheet = (params: OpenDonateSheetParams) => {
  // 빠른 런타임 가드(옵션)
  if (!params?.currentMemberId || !params?.threadId) {
    console.warn('[openDonateSheet] missing ids', params);
  }

  const { open } = useBottomSheetStore.getState();
  open(<DonateContainer {...params} />, {
    snapPoints: ['90%'],
    initialIndex: 1, // ✅ 규칙 준수
  });
};
