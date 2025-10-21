// src/common/state/bottomSheetStore.ts
import { create } from 'zustand';
import type { ReactNode } from 'react';
import type { BottomSheetModal } from '@gorhom/bottom-sheet';

type Snap = Array<number | string>;
type OpenOptions = {
  snapPoints?: Snap;
  initialIndex?: number; // 추가
};

type State = {
  ref: BottomSheetModal | null;
  content: ReactNode | null;
  snapPoints: Snap;
  initialIndex: number; // 추가
};

type Actions = {
  setRef: (ref: BottomSheetModal | null) => void;
  open: (content: ReactNode, opts?: OpenOptions) => void;
  close: () => void;
};

export const useBottomSheetStore = create<State & Actions>((set, get) => ({
  ref: null,
  content: null,
  snapPoints: ['50%'],
  initialIndex: 0, // 기본 0

  setRef: ref => set({ ref }),

  open: (content, opts) => {
    const snap =
      Array.isArray(opts?.snapPoints) && opts!.snapPoints.length > 0
        ? opts!.snapPoints
        : ['50%'];

    const index =
      typeof opts?.initialIndex === 'number' ? opts!.initialIndex : 0;

    set({ content, snapPoints: snap, initialIndex: index });

    // present → 곧바로 원하는 스냅 인덱스로
    requestAnimationFrame(() => {
      const modal = get().ref;
      if (!modal) return;
      modal.present();
      requestAnimationFrame(() => modal.snapToIndex(index));
    });
  },

  close: () => {
    get().ref?.dismiss?.();
    set({ content: null });
  },
}));
