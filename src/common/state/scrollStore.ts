import { create } from 'zustand';

type ScrollState = {
  isScrolling: boolean;
  setScrolling: (scrolling: boolean) => void;
};

export const useScrollStore = create<ScrollState>(set => ({
  isScrolling: false,
  setScrolling: scrolling => set({ isScrolling: scrolling }),
}));
