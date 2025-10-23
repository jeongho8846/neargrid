// src/common/components/GlobalBottomSheet.tsx
import React, { useEffect, useRef } from 'react';
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetBackdrop,
} from '@gorhom/bottom-sheet';
import type { BottomSheetBackdropProps } from '@gorhom/bottom-sheet';
import { StyleSheet } from 'react-native';
import { useBottomSheetStore } from '@/common/state/bottomSheetStore';
import { COLORS } from '@/common/styles/colors';
import { SPACING } from '@/common/styles';

/** 렌더 밖으로 뺀 Backdrop 컴포넌트 (memo로 불필요한 리렌더 방지) */
const SheetBackdrop = React.memo((props: BottomSheetBackdropProps) => {
  return (
    <BottomSheetBackdrop
      {...props}
      appearsOnIndex={0}
      disappearsOnIndex={-1}
      pressBehavior="close"
      style={[props.style, styles.backdrop]}
    />
  );
});

const GlobalBottomSheet = () => {
  const ref = useRef<BottomSheetModal>(null);
  const { setRef, content, snapPoints, close, initialIndex } =
    useBottomSheetStore();

  useEffect(() => {
    if (ref.current) setRef(ref.current);
  }, [setRef]);

  const safeSnapPoints =
    Array.isArray(snapPoints) && snapPoints.length > 0 ? snapPoints : ['50%'];

  // 인덱스 0이면 닫힌 상태(-1)로 시작
  const resolvedInitialIndex = initialIndex === 0 ? -1 : initialIndex;

  return (
    <BottomSheetModal
      ref={ref}
      index={resolvedInitialIndex}
      snapPoints={safeSnapPoints}
      onDismiss={close}
      // 인덱스 변화 시 0이면 즉시 닫기
      onChange={idx => {
        if (idx === 0) {
          ref.current?.dismiss();
          close();
        }
      }}
      enableDismissOnClose
      enablePanDownToClose
      backgroundStyle={styles.sheetBackground}
      handleStyle={styles.handle}
      handleIndicatorStyle={styles.handleIndicator}
      /** ← 컴포넌트 참조를 전달 (렌더 중 새 정의 금지) */
      backdropComponent={SheetBackdrop}
      // bottomInset={100}
    >
      <BottomSheetView style={styles.content}>{content}</BottomSheetView>
    </BottomSheetModal>
  );
};

export default GlobalBottomSheet;

const styles = StyleSheet.create({
  sheetBackground: {
    backgroundColor: COLORS.sheet_background,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
  },
  handle: { backgroundColor: 'transparent' },
  handleIndicator: { backgroundColor: COLORS.sheet_handle },
  backdrop: { backgroundColor: COLORS.sheet_backdrop },
  content: {
    flex: 1,
    backgroundColor: 'transparent',
    paddingHorizontal: SPACING.xs,
  },
});
