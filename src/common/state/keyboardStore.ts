import { create } from 'zustand';

type KeyboardState = {
  isVisible: boolean;
  height: number;
  setKeyboard: (isVisible: boolean, height: number) => void;
};

export const useKeyboardStore = create<KeyboardState>(set => ({
  isVisible: false,
  height: 0,
  setKeyboard: (isVisible, height) => set({ isVisible, height }),
}));
