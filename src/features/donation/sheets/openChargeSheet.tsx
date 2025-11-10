// src/features/donation/charge/sheets/openChargeSheet.tsx
import React from 'react';
import { useBottomSheetStore } from '@/common/state/bottomSheetStore';
import ChargeContainer from './ChargeContainer';
import type { BankCode } from '@/features/donation/api/bankTypes';

export type OpenChargeSheetParams = {
  currentMemberId: string;
  threadId: string;
  currentPoint?: number;
  defaultBank?: BankCode;
  defaultAccount?: string;
};

export const openChargeSheet = (params: OpenChargeSheetParams) => {
  const { open } = useBottomSheetStore.getState();
  open(<ChargeContainer {...params} />, {
    snapPoints: ['90%'],
    initialIndex: 1,
    enableHandlePanningGesture: true,
    enableContentPanningGesture: true,
  });
};
