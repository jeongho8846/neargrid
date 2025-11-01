import React from 'react';
import { StyleSheet } from 'react-native';
import { BottomSheetView } from '@gorhom/bottom-sheet';
import AppText from '@/common/components/AppText';
import { useBottomSheetStore } from '@/common/state/bottomSheetStore';
import { SPACING } from '@/common/styles/spacing';
import { COLORS } from '@/common/styles/colors';

/**
 * ✅ openMapThreadListSheet
 * - 지도에서 보이는 쓰레드 목록을 바텀시트로 표시
 * - ThreadList와 유사 구조 (향후 실제 리스트 연결 예정)
 */
export const openMapThreadListSheet = () => {
  const { open } = useBottomSheetStore.getState();

  open(
    <BottomSheetView style={styles.container}>
      <AppText i18nKey="STR_MAP_THREAD_LIST_TITLE" variant="title" />
      <AppText i18nKey="STR_MAP_THREAD_LIST_DESC" variant="caption" />
    </BottomSheetView>,
    {
      snapPoints: ['35%', '90%'],
      initialIndex: 1,
      enableHandlePanningGesture: true,
      enableContentPanningGesture: true,
      autoCloseOnIndexZero: false, // index 내려가도 닫히지 않음
      enablePanDownToClose: false, // 아래로 내려도 닫히지 않음
      backdropPressToClose: false, // 바깥 눌러도 닫히지 않음 ✅
      useBackdrop: false, // ✅ 완전히 투명, 맵 터치 가능
    },
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.sheet_background,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
});
