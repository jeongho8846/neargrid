// src/features/thread/sheets/openDonateSheet.tsx
import React from 'react';
import { View } from 'react-native';
import AppText from '@/common/components/AppText';
import { useBottomSheetStore } from '@/common/state/bottomSheetStore';

export const openDonateSheet = ({
  targetMemberId,
  threadId,
}: {
  targetMemberId: string;
  threadId: string;
}) => {
  const { open } = useBottomSheetStore.getState();
  open(
    <View>
      <AppText>
        후원하기 (memberId: {targetMemberId}, threadId: {threadId})
      </AppText>
    </View>,
    { snapPoints: ['90%'], initialIndex: 1 }, // ✅ initialIndex를 0으로 수정
  );
};
