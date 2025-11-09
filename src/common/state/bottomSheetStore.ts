import { create } from 'zustand';
import type { ReactNode, RefObject } from 'react';
import type { BottomSheetModal } from '@gorhom/bottom-sheet';

type Snap = Array<number | string>;

/**
 * ✅ 바텀시트 open 시 전달 가능한 옵션
 */
type OpenOptions = {
  snapPoints?: Snap;
  initialIndex?: number;
  onCloseCallback?: () => void;
  enableHandlePanningGesture?: boolean;
  enableContentPanningGesture?: boolean;
  enablePanDownToClose?: boolean;
  autoCloseOnIndexZero?: boolean;
  backdropPressToClose?: boolean;
  useBackdrop?: boolean;
};

/**
 * ✅ Zustand 상태 정의
 */
type State = {
  ref: RefObject<BottomSheetModal> | null;
  content: ReactNode | null;
  snapPoints: Snap;
  initialIndex: number;
  onCloseCallback?: () => void;
  enableHandlePanningGesture: boolean;
  enableContentPanningGesture: boolean;
  enablePanDownToClose: boolean;
  autoCloseOnIndexZero: boolean;
  backdropPressToClose: boolean;
  useBackdrop: boolean;
  isOpen: boolean;
};

/**
 * ✅ 액션 정의
 */
type Actions = {
  setRef: (ref: RefObject<BottomSheetModal> | null) => void;
  open: (content: ReactNode, opts?: OpenOptions) => void;
  close: () => void;
};

/**
 * ✅ 전역 바텀시트 스토어
 */
export const useBottomSheetStore = create<State & Actions>((set, get) => ({
  ref: null,
  content: null,
  snapPoints: ['50%'],
  initialIndex: 0,
  onCloseCallback: undefined,
  enableHandlePanningGesture: true,
  enableContentPanningGesture: true,
  enablePanDownToClose: true,
  autoCloseOnIndexZero: true,
  backdropPressToClose: true,
  useBackdrop: true,
  isOpen: false, // ✅ 초기값 false

  /**
   * ✅ ref 등록 (GlobalBottomSheet에서 호출)
   */
  setRef: ref => set({ ref }),

  /**
   * ✅ 바텀시트 열기
   */
  open: (content, opts) => {
    const snap =
      Array.isArray(opts?.snapPoints) && opts.snapPoints.length > 0
        ? opts.snapPoints
        : ['50%'];

    const index =
      typeof opts?.initialIndex === 'number' ? opts.initialIndex : 0;

    set({
      content,
      isOpen: true,
      snapPoints: snap,
      initialIndex: index,
      onCloseCallback: opts?.onCloseCallback,
      enableHandlePanningGesture: opts?.enableHandlePanningGesture ?? true,
      enableContentPanningGesture: opts?.enableContentPanningGesture ?? true,
      enablePanDownToClose: opts?.enablePanDownToClose ?? true,
      autoCloseOnIndexZero: opts?.autoCloseOnIndexZero ?? true,
      backdropPressToClose: opts?.backdropPressToClose ?? true,
      useBackdrop: opts?.useBackdrop ?? true,
    });

    // ✅ 다음 프레임에서 present()
    requestAnimationFrame(() => {
      const modal = get().ref?.current;
      if (!modal) {
        console.warn('⚠️ GlobalBottomSheet ref 없음');
        return;
      }
      modal.present();
      requestAnimationFrame(() => modal.snapToIndex(index));
    });
  },

  /**
   * ✅ 바텀시트 닫기
   */
  close: () => {
    const { ref, onCloseCallback } = get();

    ref?.current?.dismiss?.();
    onCloseCallback?.();

    set({
      content: null,
      onCloseCallback: undefined,
      isOpen: false,
    });
  },
}));
