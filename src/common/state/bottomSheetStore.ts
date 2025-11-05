import { create } from 'zustand';
import type { ReactNode, RefObject } from 'react';
import type { BottomSheetModal } from '@gorhom/bottom-sheet';

type Snap = Array<number | string>;

/**
 * ✅ 바텀시트 open 시 전달 가능한 옵션
 */
type OpenOptions = {
  snapPoints?: Snap; // 스냅 포인트 ['25%', '50%', ...]
  initialIndex?: number; // 기본 표시 인덱스
  onCloseCallback?: () => void; // 닫힐 때 실행할 콜백
  enableHandlePanningGesture?: boolean; // 상단 핸들 드래그 허용
  enableContentPanningGesture?: boolean; // 내부 컨텐츠 드래그 허용
  enablePanDownToClose?: boolean; // 아래로 스와이프 시 닫기
  autoCloseOnIndexZero?: boolean; // index 0일 때 자동 닫기
  backdropPressToClose?: boolean; // 배경 터치 시 닫기
  useBackdrop?: boolean; // ✅ 백드롭 자체 사용 여부 (false면 완전히 투명)
};

/**
 * ✅ Zustand 상태 타입 정의
 */
type State = {
  ref: RefObject<BottomSheetModal> | null;
  content: ReactNode | null;
  snapPoints: Snap;
  initialIndex: number;
  onCloseCallback?: () => void;
  enableHandlePanningGesture?: boolean;
  enableContentPanningGesture?: boolean;
  enablePanDownToClose: boolean;
  autoCloseOnIndexZero: boolean;
  backdropPressToClose: boolean;
  useBackdrop: boolean;
  isOpen: boolean; // ✅ 현재 바텀시트가 열려있는지 여부
};

/**
 * ✅ 액션 타입 정의
 */
type Actions = {
  setRef: (ref: RefObject<BottomSheetModal> | null) => void;
  open: (content: ReactNode, opts?: OpenOptions) => void;
  close: () => void;
};

/**
 * ✅ 전역 바텀시트 Zustand 스토어
 * - 모든 바텀시트는 이 스토어를 통해 열리고 닫힘
 * - GlobalBottomSheet 컴포넌트가 이 상태를 구독하여 렌더링
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
   * ✅ ref 등록 (GlobalBottomSheet에서 setRef 호출)
   */
  setRef: ref => set({ ref }),

  /**
   * ✅ 바텀시트 열기 (모든 옵션을 통합적으로 제어)
   */
  open: (content, opts) => {
    console.log('오픈 체크');
    const snap =
      Array.isArray(opts?.snapPoints) && opts.snapPoints.length > 0
        ? opts.snapPoints
        : ['50%'];

    const index =
      typeof opts?.initialIndex === 'number' ? opts.initialIndex : 0;

    set({
      content,
      isOpen: true, // ✅ 열릴 때 true
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

    // 닫힌 후 content 제거 및 상태 초기화
    set({
      content: null,
      onCloseCallback: undefined,
      isOpen: false, // ✅ 닫힐 때 false
    });
  },
}));
