import { create } from 'zustand';

type BottomSheetState = {
  isInteracting: boolean; // 바텀시트나 리스트가 현재 제스처 중인지
  isVisible: boolean; // 네비게이터가 보여야 하는지
  setInteracting: (v: boolean) => void;
  setVisible: (v: boolean) => void;
};

export const useBottomSheetStore = create<BottomSheetState>(set => ({
  isInteracting: false,
  isVisible: true,
  setInteracting: v => set({ isInteracting: v }),
  setVisible: v => set({ isVisible: v }),
}));
