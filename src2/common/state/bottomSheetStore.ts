import { create } from 'zustand';

type BottomSheetStore = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
};

export const useBottomSheetStore = create<BottomSheetStore>(set => ({
  isOpen: false,
  setIsOpen: open => set({ isOpen: open }),
}));
