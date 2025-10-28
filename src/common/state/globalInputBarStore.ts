// src/common/state/globalInputBarStore.ts
import { create } from 'zustand';

type OpenParams = {
  placeholder?: string;
  onSubmit?: (text: string) => void;
  isFocusing?: boolean; // ✅ 추가: 열 때 포커싱 여부
};

type GlobalInputBarState = {
  isVisible: boolean;
  text: string;
  placeholder?: string;
  onSubmit?: (text: string) => void;
  isFocusing: boolean; // ✅ 추가: 현재 포커싱 상태
  open: (params?: OpenParams) => void;
  close: () => void;
  setText: (text: string) => void;
};

export const useGlobalInputBarStore = create<GlobalInputBarState>(set => ({
  isVisible: false,
  text: '',
  placeholder: '',
  onSubmit: undefined,
  isFocusing: false, // 기본값: 자동 포커싱 안 함

  open: ({ placeholder, onSubmit, isFocusing }: OpenParams = {}) =>
    set({
      isVisible: true,
      placeholder,
      onSubmit,
      isFocusing: !!isFocusing, // ✅ true일 때만 포커싱
    }),

  close: () =>
    set({
      isVisible: false,
      text: '',
      onSubmit: undefined,
      isFocusing: false, // ✅ 닫힐 때는 항상 해제
    }),

  setText: text => set({ text }),
}));
