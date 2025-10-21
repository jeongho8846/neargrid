// src/features/thread/sheets/openThreadShareSheet.tsx
import React from 'react';
import { View } from 'react-native';
import AppText from '@/common/components/AppText';
import { useBottomSheetStore } from '@/common/state/bottomSheetStore';
import { Thread } from '../model/ThreadModel';

export const openThreadShareSheet = ({ thread }: { thread: Thread }) => {
  const { open } = useBottomSheetStore.getState();
  open(
    <View>
      <AppText>공유하기 (threadId: {thread.threadId})</AppText>
    </View>,
    { snapPoints: ['40%'], initialIndex: 1 },
  );
};
