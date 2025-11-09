import { create } from 'zustand';

type TabBarStore = {
  visible: boolean;
  hide: () => void;
  show: () => void;
};

export const useTabBarStore = create<TabBarStore>(set => ({
  visible: true,
  hide: () => set({ visible: false }),
  show: () => set({ visible: true }),
}));
