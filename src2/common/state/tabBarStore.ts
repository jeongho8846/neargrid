import { create } from 'zustand';

type TabBarStore = {
  visible: boolean;
  setVisible: (visible: boolean) => void;
};

export const useTabBarStore = create<TabBarStore>(set => ({
  visible: true,
  setVisible: visible => set({ visible }),
}));
