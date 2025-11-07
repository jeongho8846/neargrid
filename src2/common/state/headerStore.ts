import { create } from 'zustand';

/**
 * ✅ 전역 헤더 상태 (AppHeader visible)
 */
type HeaderState = {
  visible: boolean;
  setVisible: (v: boolean) => void;
};

export const useHeaderStore = create<HeaderState>(set => ({
  visible: true,
  setVisible: v => set({ visible: v }),
}));
