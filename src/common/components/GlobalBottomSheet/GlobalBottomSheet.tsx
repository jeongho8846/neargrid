// src/common/components/GlobalBottomSheet.tsx
import React, { useEffect, useRef } from 'react';
import { BottomSheetModal, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import type {
  BottomSheetModal as BottomSheetModalType,
  BottomSheetBackdropProps,
} from '@gorhom/bottom-sheet';
import { StyleSheet } from 'react-native';
import { useBottomSheetStore } from '@/common/state/bottomSheetStore';
import { COLORS } from '@/common/styles/colors';
import { SPACING } from '@/common/styles';

const SheetBackdrop = React.memo((props: BottomSheetBackdropProps) => (
  <BottomSheetBackdrop
    {...props}
    appearsOnIndex={0}
    disappearsOnIndex={-1}
    pressBehavior="close"
    style={[props.style, styles.backdrop]}
  />
));

const GlobalBottomSheet = () => {
  // ✅ ref 타입 올바르게 지정
  const ref = useRef<BottomSheetModalType>(null);

  const {
    setRef,
    content,
    snapPoints,
    close,
    initialIndex,
    enableHandlePanningGesture,
    enableContentPanningGesture,
  } = useBottomSheetStore();

  useEffect(() => {
    setRef(ref);
  }, [setRef]);

  const safeSnapPoints =
    Array.isArray(snapPoints) && snapPoints.length > 0 ? snapPoints : ['50%'];

  const resolvedInitialIndex = initialIndex === 0 ? -1 : initialIndex;

  return (
    <BottomSheetModal
      ref={ref}
      index={resolvedInitialIndex}
      snapPoints={safeSnapPoints}
      onDismiss={close}
      onChange={idx => {
        if (idx === 0) {
          ref.current?.dismiss();
          close();
        }
      }}
      enableDismissOnClose
      enablePanDownToClose
      enableHandlePanningGesture={enableHandlePanningGesture ?? true}
      enableContentPanningGesture={enableContentPanningGesture ?? true}
      keyboardBehavior="interactive"
      keyboardBlurBehavior="restore"
      backgroundStyle={styles.sheetBackground}
      handleStyle={styles.handle}
      handleIndicatorStyle={styles.handleIndicator}
      backdropComponent={SheetBackdrop}
    >
      {content}
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
