// 📄 src/common/components/GlobalBottomSheet/index.tsx
import React, { useEffect, useRef } from 'react';
import { BottomSheetModal, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import type {
  BottomSheetModal as BottomSheetModalType,
  BottomSheetBackdropProps,
} from '@gorhom/bottom-sheet';
import { StyleSheet, Platform, View } from 'react-native';
import { useBottomSheetStore } from '@/common/state/bottomSheetStore';
import { COLORS } from '@/common/styles/colors';
import { SPACING } from '@/common/styles';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const SheetBackdrop = React.memo(
  ({
    pressBehavior,
    ...props
  }: BottomSheetBackdropProps & { pressBehavior: 'close' | 'none' }) => (
    <BottomSheetBackdrop
      {...props}
      appearsOnIndex={0}
      disappearsOnIndex={-1}
      pressBehavior={pressBehavior}
      style={[props.style, styles.backdrop]}
    />
  ),
  (prev, next) => prev.pressBehavior === next.pressBehavior,
);

const GlobalBottomSheet = () => {
  const ref = useRef<BottomSheetModalType>(null);
  const { top, bottom } = useSafeAreaInsets();

  const {
    setRef,
    content,
    snapPoints,
    close,
    initialIndex,
    enableHandlePanningGesture,
    enableContentPanningGesture,
    enablePanDownToClose,
    autoCloseOnIndexZero,
    backdropPressToClose,
    useBackdrop,
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
        if (autoCloseOnIndexZero && idx === 0) {
          ref.current?.dismiss();
          close();
        }
      }}
      enableDismissOnClose
      containerStyle={[styles.containerGap, { marginBottom: bottom + 10 }]}
      enablePanDownToClose={enablePanDownToClose ?? true}
      enableHandlePanningGesture={enableHandlePanningGesture ?? true}
      enableContentPanningGesture={enableContentPanningGesture ?? true}
      keyboardBehavior={Platform.OS === 'ios' ? 'extend' : 'interactive'}
      keyboardBlurBehavior="restore"
      backgroundStyle={styles.sheetBackground}
      handleStyle={styles.handle}
      handleIndicatorStyle={styles.handleIndicator}
      topInset={top}
      backdropComponent={
        useBackdrop
          ? props => (
              <SheetBackdrop
                {...props}
                pressBehavior={backdropPressToClose ? 'close' : 'none'}
              />
            )
          : null
      }
    >
      {content ?? <View style={{ height: 1 }} />}
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
  containerGap: {
    marginBottom: 60,
  },
});
