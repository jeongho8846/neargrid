import { create } from 'zustand';

/**
 * ✅ 전역 탭바 상태 (CustomTabBar visible)
 */
type TabBarState = {
  visible: boolean;
  setVisible: (v: boolean) => void;
};

export const useTabBarStore = create<TabBarState>(set => ({
  visible: true,
  setVisible: v => set({ visible: v }),
}));
