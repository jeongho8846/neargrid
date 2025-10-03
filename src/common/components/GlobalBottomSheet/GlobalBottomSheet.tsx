import React, { useEffect, useRef } from 'react';
import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import { useBottomSheetStore } from '@/common/state/bottomSheetStore';

const GlobalBottomSheet = () => {
  const ref = useRef<BottomSheetModal>(null);
  const { setRef, content, snapPoints, close } = useBottomSheetStore();

  useEffect(() => {
    setRef(ref.current);
  }, [setRef]);

  return (
    <BottomSheetModal
      ref={ref}
      snapPoints={snapPoints}
      onDismiss={close}
      enablePanDownToClose
    >
      <BottomSheetView style={{ flex: 1 }}>{content}</BottomSheetView>
    </BottomSheetModal>
  );
};

export default GlobalBottomSheet;
