// src/common/hooks/useGlobalBottomSheet.ts
import { useBottomSheetStore } from '@/common/state/bottomSheetStore';

const useGlobalBottomSheet = () => {
  const { open, close } = useBottomSheetStore();
  return { openBottomSheet: open, closeBottomSheet: close };
};

export default useGlobalBottomSheet;
