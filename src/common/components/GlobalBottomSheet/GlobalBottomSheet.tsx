import React, { useEffect, useRef } from 'react';
import { BottomSheetModal, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import type {
  BottomSheetModal as BottomSheetModalType,
  BottomSheetBackdropProps,
} from '@gorhom/bottom-sheet';
import { StyleSheet, Platform, View } from 'react-native';
import { useBottomSheetStore } from '@/common/state/bottomSheetStore';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// ✅ 새로운 테스트 디자인 토큰 기반
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
  /** ✅ 시트 배경 */
  sheetBackground: {
    backgroundColor: TEST_COLORS.surface, // ✅ 카드/시트용 서피스 컬러
    borderTopLeftRadius: TEST_RADIUS.xl,
    borderTopRightRadius: TEST_RADIUS.xl,
    paddingTop: TEST_SPACING.md,
    ...TEST_SHADOW.soft, // ✅ 부드러운 그림자 적용
  },

  /** ✅ 핸들바 */
  handle: {
    backgroundColor: 'transparent',
  },
  handleIndicator: {
    backgroundColor: TEST_COLORS.border, // ✅ 은은한 그레이 라인
    width: 40,
    height: 4,
    borderRadius: 2,
  },

  /** ✅ 백드롭 (뒤 어두운 영역) */
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.55)', // ✅ 반투명 다크 톤
  },

  /** ✅ 컨텐츠 */
  content: {
    flex: 1,
    backgroundColor: 'transparent',
    paddingHorizontal: TEST_SPACING.sm,
  },
});
