// src/features/thread/sheets/openThreadLikeListSheet.tsx
import React from 'react';
import { View } from 'react-native';
import AppText from '@/common/components/AppText';
import { useBottomSheetStore } from '@/common/state/bottomSheetStore';

export const openThreadLikeListSheet = ({ threadId }: { threadId: string }) => {
  const { open } = useBottomSheetStore.getState();
  open(
    <View>
      <AppText>좋아요 리스트 (threadId: {threadId})</AppText>
    </View>,
    { snapPoints: ['95%', '60%'], initialIndex: 1 },
  );
};
