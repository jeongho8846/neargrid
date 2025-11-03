/**
 * ✅ openReportSheet.tsx
 * - 전역 BottomSheet 열기 전용 함수
 * - Hook 사용 금지 (useTranslation 등)
 */
import React from 'react';
import { Alert } from 'react-native';
import { BottomSheetView } from '@gorhom/bottom-sheet';
import { useBottomSheetStore } from '@/common/state/bottomSheetStore';
import { memberStorage } from '@/features/member/utils/memberStorage';
import ReportSheetContent from './ReportSheetContent';

export const openReportSheet = async ({
  contentId,
  parent_content_id,
  content_type,
}: {
  contentId: string;
  parent_content_id?: string;
  content_type: string;
}) => {
  const { open, close } = useBottomSheetStore.getState();

  // ✅ 로그인 체크
  const member = await memberStorage.getMember();
  if (!member) {
    Alert.alert('Login required', 'You must be logged in to report content.');
    return;
  }

  // ✅ 실제 시트 열기 (UI는 분리)
  open(
    <>
      <ReportSheetContent
        contentId={contentId}
        parent_content_id={parent_content_id}
        content_type={content_type}
        memberId={member.id}
        onClose={close}
      />
    </>,
    {
      snapPoints: ['90%'],
      initialIndex: 1,
      enableHandlePanningGesture: true,
      enableContentPanningGesture: true,
    },
  );
};
