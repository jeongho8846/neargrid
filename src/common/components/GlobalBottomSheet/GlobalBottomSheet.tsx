import React, { useEffect, useRef } from 'react';
import { BottomSheetModal, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import type {
  BottomSheetModal as BottomSheetModalType,
  BottomSheetBackdropProps,
} from '@gorhom/bottom-sheet';
import { BackHandler, StyleSheet, Platform, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useBottomSheetStore } from '@/common/state/bottomSheetStore';

// ✅ 테스트 디자인 토큰
import { TEST_COLORS } from '@/test/styles/colors';
import { TEST_RADIUS } from '@/test/styles/radius';
import { TEST_SPACING } from '@/test/styles/spacing';
import { TEST_SHADOW } from '@/test/styles/shadows';

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
  const { top } = useSafeAreaInsets();

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
    isOpen,
  } = useBottomSheetStore();

  useEffect(() => {
    setRef(ref);
  }, [setRef]);

  // ✅ 안드로이드 뒤로가기 처리
  useEffect(() => {
    const onBackPress = () => {
      if (isOpen) {
        ref.current?.dismiss();
        close();
        return true; // 뒤로가기 이벤트 소비
      }
      return false; // 닫혀있으면 네비게이션 뒤로가기 허용
    };

    const sub = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => sub.remove();
  }, [isOpen, close]);

  const safeSnapPoints =
    Array.isArray(snapPoints) && snapPoints.length > 0 ? snapPoints : ['50%'];
  const resolvedInitialIndex = initialIndex === 0 ? -1 : initialIndex;

  return (
    <BottomSheetModal
      ref={ref}
      index={resolvedInitialIndex}
      snapPoints={safeSnapPoints}
      onChange={idx => {
        if (idx >= 0) useBottomSheetStore.setState({ isOpen: true });
        if (idx === -1) useBottomSheetStore.setState({ isOpen: false });

        if (autoCloseOnIndexZero && idx === 0) {
          ref.current?.dismiss();
          close();
        }
      }}
      onDismiss={() => {
        useBottomSheetStore.setState({ isOpen: false });
        close();
      }}
      enableDismissOnClose
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
    backgroundColor: TEST_COLORS.surface,
    borderTopLeftRadius: TEST_RADIUS.xl,
    borderTopRightRadius: TEST_RADIUS.xl,
    paddingTop: TEST_SPACING.md,
    ...TEST_SHADOW.soft,
  },
  handle: { backgroundColor: 'transparent' },
  handleIndicator: {
    backgroundColor: TEST_COLORS.border,
    width: 40,
    height: 4,
    borderRadius: 2,
  },
  backdrop: { backgroundColor: 'rgba(0, 0, 0, 0.55)' },
  content: {
    flex: 1,
    backgroundColor: 'transparent',
    paddingHorizontal: TEST_SPACING.sm,
  },
});
