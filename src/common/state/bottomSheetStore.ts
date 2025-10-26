import { create } from 'zustand';
import type { ReactNode, RefObject } from 'react';
import type { BottomSheetModal } from '@gorhom/bottom-sheet'; // ✅ 수정

type Snap = Array<number | string>;

type OpenOptions = {
  snapPoints?: Snap;
  initialIndex?: number;
  onCloseCallback?: () => void;
  enableHandlePanningGesture?: boolean;
  enableContentPanningGesture?: boolean;
};

type State = {
  ref: RefObject<BottomSheetModal> | null; // ✅ 여기 변경
  content: ReactNode | null;
  snapPoints: Snap;
  initialIndex: number;
  onCloseCallback?: () => void;
  enableHandlePanningGesture?: boolean;
  enableContentPanningGesture?: boolean;
};

type Actions = {
  setRef: (ref: RefObject<BottomSheetModal> | null) => void; // ✅ 동일하게 변경
  open: (content: ReactNode, opts?: OpenOptions) => void;
  close: () => void;
};

export const useBottomSheetStore = create<State & Actions>((set, get) => ({
  ref: null,
  content: null,
  snapPoints: ['50%'],
  initialIndex: 0,
  onCloseCallback: undefined,
  enableHandlePanningGesture: true,
  enableContentPanningGesture: true,

  setRef: ref => set({ ref }),

  open: (content, opts) => {
    const snap =
      Array.isArray(opts?.snapPoints) && opts.snapPoints.length > 0
        ? opts.snapPoints
        : ['50%'];
    const index =
      typeof opts?.initialIndex === 'number' ? opts.initialIndex : 0;

    set({
      content,
      snapPoints: snap,
      initialIndex: index,
      onCloseCallback: opts?.onCloseCallback,
      enableHandlePanningGesture: opts?.enableHandlePanningGesture ?? true,
      enableContentPanningGesture: opts?.enableContentPanningGesture ?? true,
    });

    requestAnimationFrame(() => {
      const modal = get().ref?.current;
      if (!modal) {
        console.warn('⚠️ GlobalBottomSheet ref 없음');
        return;
      }
      modal.present(); // ✅ BottomSheetModal 인스턴스에서 사용 가능
      requestAnimationFrame(() => modal.snapToIndex(index));
    });
  },

  close: () => {
    const { ref, onCloseCallback } = get();
    ref?.current?.dismiss?.();
    onCloseCallback?.();
    set({ content: null, onCloseCallback: undefined });
  },
}));
