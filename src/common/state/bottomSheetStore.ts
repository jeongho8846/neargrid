import { ReactNode } from 'react';
import { create } from 'zustand';
import type { BottomSheetModal } from '@gorhom/bottom-sheet';

type BottomSheetState = {
  ref: BottomSheetModal | null;
  content: ReactNode | null;
  snapPoints: (string | number)[];
  setRef: (ref: BottomSheetModal | null) => void;
  open: (content: ReactNode, snapPoints?: (string | number)[]) => void;
  close: () => void;
};

export const useBottomSheetStore = create<BottomSheetState>((set, get) => ({
  ref: null,
  content: null,
  snapPoints: ['50%'], // 기본값
  setRef: ref => set({ ref }),
  open: (content, snapPoints = ['50%']) => {
    set({ content, snapPoints });
    get().ref?.present();
  },
  close: () => {
    get().ref?.dismiss();
    set({ content: null });
  },
}));
