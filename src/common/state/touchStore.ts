import { create } from 'zustand';

/**
 * ✅ 전역 터치 상태 Store
 * - isTouching: 유저가 화면을 손으로 터치 중인지 여부
 */
type TouchState = {
  isTouching: boolean;
  setTouching: (value: boolean) => void;
};

export const useTouchStore = create<TouchState>(set => ({
  isTouching: false,
  setTouching: value => set({ isTouching: value }),
}));
