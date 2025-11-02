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
import { useSafeAreaInsets } from 'react-native-safe-area-context';

/** ✅ 커스텀 백드롭 (시트별 동적 설정 반영) */
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
);

const GlobalBottomSheet = () => {
  const ref = useRef<BottomSheetModal>(null);
  const { top, bottom } = useSafeAreaInsets(); // ✅ 안전영역 가져오기

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

  if (!content) return null;

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
      containerStyle={styles.containerGap}
      enablePanDownToClose={enablePanDownToClose ?? true}
      enableHandlePanningGesture={enableHandlePanningGesture ?? true}
      enableContentPanningGesture={enableContentPanningGesture ?? true}
      keyboardBehavior="interactive"
      keyboardBlurBehavior="restore"
      backgroundStyle={styles.sheetBackground}
      handleStyle={styles.handle}
      handleIndicatorStyle={styles.handleIndicator}
      topInset={top} // ✅ 추가된 핵심 라인
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
      {content}
    </BottomSheetModal>
  );
};

export default GlobalBottomSheet;

/** ✅ 스타일 정의 */
const styles = StyleSheet.create({
  /** 시트 배경 */
  sheetBackground: {
    backgroundColor: COLORS.sheet_background,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
  },
  handle: { backgroundColor: 'transparent' },
  handleIndicator: { backgroundColor: COLORS.sheet_handle },
  backdrop: { backgroundColor: COLORS.sheet_backdrop },

  /** 내부 콘텐츠 스타일 */
  content: {
    flex: 1,
    backgroundColor: 'transparent',
    paddingHorizontal: SPACING.xs,
  },

  /** ✅ 탭바 높이만큼 띄우기 */
  containerGap: {
    marginBottom: 60, // 탭바 높이 or SafeAreaInsets.bottom + margin
  },
});
