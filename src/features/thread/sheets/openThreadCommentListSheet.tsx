// src/features/thread/sheets/openThreadCommentListSheet.tsx
import React from 'react';
import { View } from 'react-native';
import AppText from '@/common/components/AppText';
import { useBottomSheetStore } from '@/common/state/bottomSheetStore';

export const openThreadCommentListSheet = ({
  threadId,
}: {
  threadId: string;
}) => {
  const { open } = useBottomSheetStore.getState();
  open(
    <View>
      <AppText>댓글 리스트 (threadId: {threadId})</AppText>
    </View>,
    { snapPoints: ['95%'], initialIndex: 1 },
  );
};
