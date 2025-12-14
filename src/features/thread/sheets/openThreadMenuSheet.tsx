// 📄 src/features/thread/sheets/openThreadMenuSheet.tsx
import React from 'react';
import { BottomSheetView } from '@gorhom/bottom-sheet';
import { useBottomSheetStore } from '@/common/state/bottomSheetStore';
import { Thread } from '../model/ThreadModel';
import ThreadMenuContent from '../components/ThreadMenuContent';

/**
 * ✅ openThreadMenuSheet
 * - NavigationContext 공유 가능 (App 구조 변경 덕분)
 * - 그냥 open() 호출로 시트 열기
 */
export const openThreadMenuSheet = ({
  thread,
  hubThreadId,
}: {
  thread: Thread;
  hubThreadId?: string;
}) => {
  const { open } = useBottomSheetStore.getState();

  open(
    <BottomSheetView>
      <ThreadMenuContent thread={thread} hubThreadId={hubThreadId} />
    </BottomSheetView>,
    {
      snapPoints: [400],
      initialIndex: 1,
      enableHandlePanningGesture: true,
      enableContentPanningGesture: true,
    },
  );
};
