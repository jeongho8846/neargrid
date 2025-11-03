import React from 'react';
import { StyleSheet } from 'react-native';
import { useBottomSheetStore } from '@/common/state/bottomSheetStore';
import AppText from '@/common/components/AppText';
import { SPACING } from '@/common/styles/spacing';
import ThreadDonationTabContainer from '../components/ThreadDonationTabContainer';

/**
 * ✅ openThreadDonationListSheet
 * - 탭 구조 도네이션 시트
 */
export const openThreadDonationListSheet = ({
  threadId,
  currentMemberId,
}: {
  threadId: string;
  currentMemberId: string;
}) => {
  const { open, close } = useBottomSheetStore.getState();

  // ✅ 프롭 전달 디버깅 로그
  console.log('🧾 [openThreadDonationListSheet] props:');
  console.log('  • threadId:', threadId);
  console.log('  • currentMemberId:', currentMemberId);

  open(
    <>
      <AppText style={styles.title} i18nKey="STR_DONATION_LIST_TITLE" />
      <ThreadDonationTabContainer
        threadId={threadId}
        currentMemberId={currentMemberId}
      />
    </>,
    {
      snapPoints: ['1%', '90%'],
      initialIndex: 1,
      enableHandlePanningGesture: true,
      enableContentPanningGesture: true,
      onCloseCallback: () => {
        console.log('🧹 도네이션 시트 닫힘 → 데이터 초기화');
      },
    },
  );

  // ✅ 시트 열림 로그
  console.log('✅ [openThreadDonationListSheet] 시트 오픈 완료');
};

const styles = StyleSheet.create({
  title: {
    marginBottom: SPACING.sm,
    alignSelf: 'center',
  },
});
